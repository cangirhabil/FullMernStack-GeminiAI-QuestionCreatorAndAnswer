import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFile } from "fs/promises";
import connectToDatabase from "@/lib/mongodb";
import { Document, QuestionSet } from "@/models";
import User from "@/models/User";
import { IDocument } from "@/models/Document";
import { verifyToken } from "@/lib/auth";
import RAGService from "@/lib/rag";
import DocumentParser from "@/lib/document-parser";
import { withRetry } from "@/lib/rate-limit-utils";

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // Get user and check for API key (unless a test key header is provided)
    const testHeaderKey = request.headers.get('x-test-api-key') || undefined;

    const user = await User.findById(userId).select('+geminiApiKey');
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

  if (!user.geminiApiKey && !testHeaderKey) {
      return NextResponse.json(
        { 
          error: "API key required",
          message: "Please add your Gemini API key in your profile settings to generate questions."
        },
        { status: 400 }
      );
    }

  // Use provided test header key if present, else user's key
  const effectiveKey = testHeaderKey || user.geminiApiKey;
  const userGenAI = new GoogleGenerativeAI(effectiveKey);

    const body = await request.json();
    const {
      documentId,
      numberOfQuestions = 10,
      difficulty = "medium",
      dryRun = false,
      mode,
      language = 'en'
    } = body;

    // Fast path: API key validation dry run (no DB question set persist)
    if (dryRun || mode === 'validation') {
      try {
        const model = userGenAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const testPrompt = `Return the word OK only.`;
        const result = await withRetry(async () => await model.generateContent(testPrompt), 2, 500);
        const text = result.response.text().trim();
        if (/^OK$/i.test(text)) {
          return NextResponse.json({ valid: true, message: 'Key valid' });
        }
        return NextResponse.json({ valid: true, message: 'Model responded' });
      } catch (e) {
        const error = e as { status?: number; message?: string };
        const status = error.status || 400;
        return NextResponse.json({ valid: false, error: 'Key test failed', detail: error.message }, { status });
      }
    }

  if (!documentId) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find the document
    const document = await Document.findById(documentId);
    if (!document || document.userId.toString() !== userId) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    const docWithPossibleContent = document as IDocument & { content?: Buffer };
    console.log("Document found:", {
      id: docWithPossibleContent._id,
      filename: docWithPossibleContent.filename,
      uploadPath: docWithPossibleContent.uploadPath,
      hasInlineContent: Boolean(docWithPossibleContent.content),
    });

    // Determine raw content source (database binary or local path)
    let rawBuffer: Buffer | undefined;
    if (docWithPossibleContent.content) {
      rawBuffer = docWithPossibleContent.content;
    } else if (docWithPossibleContent.uploadPath) {
      const { existsSync } = await import("fs");
      if (existsSync(docWithPossibleContent.uploadPath)) {
        try {
          rawBuffer = await readFile(docWithPossibleContent.uploadPath);
        } catch (e) {
          console.warn("Failed to read local file, continuing with placeholder", e);
        }
      }
    }

    // Parse document content using enhanced parser
    let textContent = '';
    if (rawBuffer && rawBuffer.length > 32) {
      try {
        const parsedDoc = await DocumentParser.parseDocument(
          rawBuffer, 
          docWithPossibleContent.mimeType, 
          docWithPossibleContent.originalName
        );
        
        textContent = DocumentParser.cleanText(parsedDoc.text);
        
        console.log(`Parsed document: ${parsedDoc.pages} pages, ${textContent.length} characters`);
        
        // Update document with parsed content if not already stored
        if (!docWithPossibleContent.content && textContent.length > 100) {
          document.content = Buffer.from(textContent, 'utf-8');
          await document.save();
          console.log('Saved parsed content to database');
        }
      } catch (parseError) {
        console.error('Document parsing failed:', parseError);
        textContent = `Placeholder content for ${docWithPossibleContent.originalName}.`;
      }
    } else {
      textContent = `Placeholder content for ${docWithPossibleContent.originalName}.`;
    }

    console.log("Final text content length:", textContent.length);

    // Minimal guard
    if (!textContent || textContent.trim().length < 10) {
      return NextResponse.json({ error: "Empty document content" }, { status: 400 });
    }

    // Initialize RAG service and generate questions
    const ragService = new RAGService(user.geminiApiKey);
    
    let questions;
    try {
      // Use RAG-enhanced question generation
      questions = await ragService.generateQuestionsWithRAG(
        textContent,
        numberOfQuestions,
        difficulty,
        docWithPossibleContent.originalName,
        language
      );
      
      console.log(`RAG service generated ${questions.length} questions`);
      
    } catch (ragError) {
      console.error("RAG generation failed, falling back to simple generation:", ragError);
      
      // Fallback to simple generation if RAG fails - use Gemini 2.5 Flash
      let model;
      try {
        model = userGenAI.getGenerativeModel({ 
          model: "gemini-2.5-flash",
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 8192,
          }
        });
        console.log("Using Gemini 2.5 Flash for fallback generation");
      } catch (error) {
        console.warn("Gemini 2.5 Flash not available, using Gemini 1.5 Flash:", error);
        model = userGenAI.getGenerativeModel({ 
          model: "gemini-1.5-flash",
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            maxOutputTokens: 8192,
          }
        });
      }
      
      const langLabel = language === 'tr' ? 'Turkish' : language === 'nl' ? 'Dutch' : 'English';
      const fallbackPrompt = `
You are an expert at creating interview questions based on document content.
Return output strictly in ${langLabel}. If the source content is another language, still produce the questions and answers in ${langLabel}.

Based on the following document content, create exactly ${numberOfQuestions} interview questions with their answers.
Each question should be at ${difficulty} difficulty level.

Document content:
"""
${textContent.slice(0, 8000)}
"""

Respond ONLY with valid JSON array. Each item structure:
{
  "question": "${langLabel} interview question",
  "answer": "${langLabel} detailed answer",
  "difficulty": "${difficulty}",
  "category": "Kategori / Category",
  "keywords": ["kelime", "keywords"],
  "source_context": "Belge bölümü / Document section"
}

Rules:
1. Output language: ${langLabel}
2. No explanations outside JSON
3. Exactly ${numberOfQuestions} items
4. Ensure culturally and linguistically natural phrasing
`;

      const result = await withRetry(async () => {
        return await model.generateContent(fallbackPrompt);
      }, 3, 2000);
      
      const response = await result.response;
      const text = response.text();

      // Parse the JSON response
      try {
        const jsonStart = text.indexOf("[");
        const jsonEnd = text.lastIndexOf("]") + 1;
        const jsonText = text.slice(jsonStart, jsonEnd);
        questions = JSON.parse(jsonText);
      } catch (parseError) {
        console.error("Failed to parse fallback AI response:", parseError);
        return NextResponse.json(
          { error: "Failed to generate questions. Please try again." },
          { status: 500 }
        );
      }
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: "No questions were generated" },
        { status: 500 }
      );
    }

    // Save to database with enhanced question structure
    const questionSet = new QuestionSet({
      userId,
      documentId,
      title: `Questions from ${docWithPossibleContent.originalName}`,
      questions: questions.map((q) => ({
        question: q.question,
        answer: q.answer,
        difficulty: q.difficulty || difficulty,
        category: q.category || "General",
        cognitive_level: q.cognitive_level || "Understand",
        keywords: q.keywords || [],
        sourceContext: q.source_context || "Document content",
        assessment_criteria: q.assessment_criteria || "General knowledge assessment",
        follow_up_potential: q.follow_up_potential || "None specified",
        industry_relevance: q.industry_relevance || "General application"
      })),
      metadata: {
        generationMethod: 'RAG-enhanced with Gemini 2.5 Flash',
        documentLength: textContent.length,
        generatedAt: new Date(),
        ragEnabled: true,
        aiModel: 'gemini-2.5-flash'
      }
    });

    await questionSet.save();

    // Update document status
    document.status = "completed";
    await document.save();

    return NextResponse.json({
      message: "Questions generated successfully",
      questionSetId: questionSet._id,
      questions: questionSet.questions,
      totalQuestions: questionSet.totalQuestions,
    });
  } catch (error) {
    console.error("Generate questions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
