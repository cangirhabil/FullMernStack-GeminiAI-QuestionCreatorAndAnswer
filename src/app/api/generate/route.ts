import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFile } from "fs/promises";
import connectToDatabase from "@/lib/mongodb";
import Document, { IDocument } from "@/models/Document";
import QuestionSet from "@/models/QuestionSet";
import { verifyToken } from "@/lib/auth";
import RAGService from "@/lib/rag";
import DocumentParser from "@/lib/document-parser";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      documentId,
      numberOfQuestions = 10,
      difficulty = "medium",
    } = await request.json();

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
    const ragService = new RAGService(process.env.GOOGLE_API_KEY!);
    
    let questions;
    try {
      // Use RAG-enhanced question generation
      questions = await ragService.generateQuestionsWithRAG(
        textContent,
        numberOfQuestions,
        difficulty,
        docWithPossibleContent.originalName
      );
      
      console.log(`RAG service generated ${questions.length} questions`);
      
    } catch (ragError) {
      console.error("RAG generation failed, falling back to simple generation:", ragError);
      
      // Fallback to simple generation if RAG fails
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const fallbackPrompt = `
You are an expert at creating interview questions based on document content.
Your goal is to prepare a candidate for their interview and tests.

Based on the following document content, create exactly ${numberOfQuestions} interview questions with their answers.
Each question should be at ${difficulty} difficulty level.

Document content:
"""
${textContent.slice(0, 8000)} // Limit text to avoid token limits
"""

Please format your response as a JSON array where each object has the following structure:
{
  "question": "The interview question",
  "answer": "A comprehensive answer to the question",
  "difficulty": "${difficulty}",
  "category": "Category of the question (e.g., Technical, Conceptual, Practical)",
  "keywords": ["relevant", "keywords"],
  "source_context": "Brief reference to document section"
}

Make sure to:
1. Create diverse questions covering different aspects of the content
2. Provide detailed, accurate answers
3. Ensure questions are relevant for interview preparation
4. Return exactly ${numberOfQuestions} questions
5. Return only valid JSON, no additional text
`;

      const result = await model.generateContent(fallbackPrompt);
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
        keywords: q.keywords || [],
        sourceContext: q.source_context || "Document content"
      })),
      metadata: {
        generationMethod: 'RAG-enhanced',
        documentLength: textContent.length,
        generatedAt: new Date(),
        ragEnabled: true
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
