import { GoogleGenerativeAI } from "@google/generative-ai";

interface DocumentChunk {
  id: string;
  text: string;
  metadata: {
    documentId: string;
    chunkIndex: number;
    filename: string;
  };
}

interface Question {
  question: string;
  answer: string;
  difficulty: string;
  category: string;
  cognitive_level?: string;
  keywords: string[];
  source_context: string;
  assessment_criteria?: string;
  follow_up_potential?: string;
  industry_relevance?: string;
}

interface VectorDocument {
  chunk: DocumentChunk;
  embedding: number[];
  similarity?: number;
}

class SimpleVectorStore {
  private documents: VectorDocument[] = [];
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async addDocuments(chunks: DocumentChunk[]): Promise<void> {
    // Use Gemini 2.5 Pro for embeddings (fallback to text-embedding-004 if not available)
    let model;
    try {
      model = this.genAI.getGenerativeModel({ model: "gemini-2.5-pro-latest" });
    } catch (error) {
      console.warn("Gemini 2.5 Pro not available, using text-embedding-004:", error);
      model = this.genAI.getGenerativeModel({ model: "text-embedding-004" });
    }
    
    for (const chunk of chunks) {
      try {
        const result = await model.embedContent(chunk.text);
        const embedding = result.embedding.values;
        
        this.documents.push({
          chunk,
          embedding: embedding || []
        });
      } catch (error) {
        console.error(`Failed to embed chunk ${chunk.id}:`, error);
        // Try fallback embedding model
        try {
          const fallbackModel = this.genAI.getGenerativeModel({ model: "text-embedding-004" });
          const fallbackResult = await fallbackModel.embedContent(chunk.text);
          const fallbackEmbedding = fallbackResult.embedding.values;
          
          this.documents.push({
            chunk,
            embedding: fallbackEmbedding || []
          });
        } catch (fallbackError) {
          console.error(`Fallback embedding also failed for chunk ${chunk.id}:`, fallbackError);
        }
      }
    }
  }

  async similaritySearch(query: string, k: number = 5): Promise<DocumentChunk[]> {
    if (this.documents.length === 0) return [];

    try {
      // Use Gemini 2.5 Pro for query embeddings (fallback to text-embedding-004 if not available)
      let model;
      try {
        model = this.genAI.getGenerativeModel({ model: "gemini-2.5-pro-latest" });
      } catch (error) {
        console.warn("Gemini 2.5 Pro not available, using text-embedding-004:", error);
        model = this.genAI.getGenerativeModel({ model: "text-embedding-004" });
      }
      
      const queryResult = await model.embedContent(query);
      const queryEmbedding = queryResult.embedding.values;

      if (!queryEmbedding) return [];

      // Calculate cosine similarity
      const similarities = this.documents.map(doc => ({
        ...doc,
        similarity: this.cosineSimilarity(queryEmbedding, doc.embedding)
      }));

      // Sort by similarity and return top k
      return similarities
        .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
        .slice(0, k)
        .map(item => item.chunk);
    } catch (error) {
      console.error("Similarity search failed:", error);
      return [];
    }
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  clear(): void {
    this.documents = [];
  }

  getDocumentCount(): number {
    return this.documents.length;
  }
}

export class RAGService {
  private vectorStore: SimpleVectorStore;
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.vectorStore = new SimpleVectorStore(apiKey);
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  // Split text into chunks
  private splitTextIntoChunks(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
    const chunks: string[] = [];
    let start = 0;

    // Validate input
    if (!text || text.length === 0) {
      return [text || ""];
    }

    // Ensure reasonable chunk size
    chunkSize = Math.max(100, Math.min(chunkSize, text.length));
    overlap = Math.max(0, Math.min(overlap, Math.floor(chunkSize / 2)));

    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      const chunk = text.slice(start, end).trim();
      
      if (chunk.length > 0) {
        chunks.push(chunk);
      }
      
      start = end - overlap;
      
      if (start >= text.length) break;
    }

    return chunks.length > 0 ? chunks : [text];
  }

  async indexDocument(documentId: string, filename: string, content: string): Promise<void> {
    // Clear existing documents for this document ID
    this.vectorStore.clear();

    // Split content into chunks
    const textChunks = this.splitTextIntoChunks(content);
    
    // Create document chunks
    const documentChunks: DocumentChunk[] = textChunks.map((text, index) => ({
      id: `${documentId}_chunk_${index}`,
      text: text.trim(),
      metadata: {
        documentId,
        chunkIndex: index,
        filename
      }
    }));

    // Add to vector store
    await this.vectorStore.addDocuments(documentChunks);
    
    console.log(`Indexed ${documentChunks.length} chunks for document ${documentId}`);
  }

  async retrieveRelevantContext(query: string, maxChunks: number = 3): Promise<string> {
    const relevantChunks = await this.vectorStore.similaritySearch(query, maxChunks);
    
    if (relevantChunks.length === 0) {
      return "";
    }

    return relevantChunks
      .map(chunk => chunk.text)
      .join("\n\n---\n\n");
  }

  async generateQuestionsWithRAG(
    documentContent: string,
    numberOfQuestions: number,
    difficulty: string,
    filename: string
  ): Promise<Question[]> {
    // Use Gemini 2.5 Pro for advanced question generation
    let model;
    try {
      model = this.genAI.getGenerativeModel({ 
        model: "gemini-2.5-pro-latest",
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 8192,
        }
      });
      console.log("Using Gemini 2.5 Pro for question generation");
    } catch (error) {
      console.warn("Gemini 2.5 Pro not available, falling back to Gemini 1.5 Flash:", error);
      model = this.genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 8192,
        }
      });
    }

    // Create a temporary document ID for indexing
    const tempDocId = `temp_${Date.now()}`;
    
    // Index the document
    await this.indexDocument(tempDocId, filename, documentContent);

    // Generate different types of queries to retrieve diverse content
    const queries = [
      "key concepts and main topics",
      "technical details and specifications",
      "practical applications and examples",
      "important definitions and terminology",
      "processes and procedures described"
    ];

    const contextParts: string[] = [];
    
    // Retrieve context for each query type
    for (const query of queries) {
      const context = await this.retrieveRelevantContext(query, 2);
      if (context) {
        contextParts.push(context);
      }
    }

    // Combine all retrieved context
    const retrievedContext = contextParts.join("\n\n========\n\n");

    const enhancedPrompt = `
You are an advanced AI interview question creator, leveraging Gemini 2.5 Pro capabilities for superior question design.
Your expertise includes psychological assessment, pedagogical principles, and industry-specific knowledge evaluation.

DOCUMENT ANALYSIS:
- Filename: ${filename}
- Content Length: ${documentContent.length} characters
- Processing Method: RAG-enhanced with semantic chunking
- Model: Gemini 2.5 Pro with advanced reasoning

CONTEXTUAL CONTENT:
"""
${retrievedContext || documentContent.slice(0, 8000)}
"""

ADVANCED TASK SPECIFICATION:
Generate exactly ${numberOfQuestions} interview questions at ${difficulty} difficulty level with the following enhanced criteria:

COGNITIVE ASSESSMENT FRAMEWORK:
1. **Knowledge Recall**: Basic understanding and memorization
2. **Comprehension**: Interpretation and explanation of concepts  
3. **Application**: Using knowledge in new situations
4. **Analysis**: Breaking down complex information
5. **Synthesis**: Combining elements to form new understanding
6. **Evaluation**: Making judgments about value or validity

DIFFICULTY SCALING:
- **Easy**: Bloom's Taxonomy Level 1-2 (Remember, Understand)
- **Medium**: Bloom's Taxonomy Level 3-4 (Apply, Analyze)  
- **Hard**: Bloom's Taxonomy Level 5-6 (Evaluate, Create)

QUESTION DIVERSIFICATION:
- 25% Factual/Definition questions
- 25% Conceptual understanding questions
- 25% Practical application scenarios
- 25% Critical thinking/problem-solving questions

ENHANCED REQUIREMENTS:
1. Questions must be directly derivable from the provided content
2. Answers should demonstrate deep comprehension of the material
3. Include real-world application examples where applicable
4. Ensure psychological validity for interview assessment
5. Consider cultural sensitivity and inclusivity
6. Optimize for both technical and behavioral evaluation

ADVANCED OUTPUT STRUCTURE:
1. Questions should be directly based on the provided content
2. Each question must be answerable from the document content
3. Include a mix of question types:
   - Conceptual understanding questions
   - Practical application questions  
   - Detail-oriented questions
   - Analysis and critical thinking questions
4. Ensure questions test different aspects of the content
5. Provide comprehensive, accurate answers based on the document

DIFFICULTY LEVEL GUIDELINES:
- Easy: Basic recall and understanding
- Medium: Application and analysis of concepts
- Hard: Complex analysis, synthesis, and critical evaluation

Return a JSON array where each object follows this sophisticated structure:
{
  "question": "Precisely crafted interview question with clear assessment intent",
  "answer": "Comprehensive, nuanced answer demonstrating deep subject mastery",
  "difficulty": "${difficulty}",
  "category": "Primary assessment domain (Technical|Conceptual|Practical|Analytical|Behavioral)",
  "cognitive_level": "Bloom's taxonomy level (Remember|Understand|Apply|Analyze|Evaluate|Create)",
  "keywords": ["domain-specific", "terminology", "and", "concepts"],
  "source_context": "Specific document section or concept area",
  "assessment_criteria": "What this question specifically evaluates",
  "follow_up_potential": "Suggested areas for deeper exploration",
  "industry_relevance": "Real-world application context"
}

GEMINI 2.5 PRO OPTIMIZATION:
- Leverage advanced reasoning for question sophistication
- Utilize enhanced context understanding for relevance
- Apply superior language generation for clarity
- Employ multi-modal thinking for comprehensive assessment

CRITICAL SUCCESS FACTORS:
- Questions must be interview-ready (clear, unambiguous)
- Answers should showcase candidate's expertise level
- Content must be directly traceable to source material
- Assessment value should be immediately apparent to interviewer

EXECUTION MANDATE:
- Generate exactly ${numberOfQuestions} questions
- Maintain strict adherence to ${difficulty} difficulty level
- Ensure JSON validity with no extraneous text
- Optimize for psychological assessment accuracy
  "category": "Question category (e.g., Technical, Conceptual, Practical, Analytical)",
  "keywords": ["key", "terms", "from", "question"],
  "source_context": "Brief reference to which part of document this relates to"
}

IMPORTANT:
- Base all questions and answers strictly on the provided document content
- Do not add external knowledge not present in the document
- Ensure answers are detailed and demonstrate deep understanding
- Return exactly ${numberOfQuestions} questions
- Return ONLY valid JSON, no additional text or formatting
`;

    try {
      const result = await model.generateContent(enhancedPrompt);
      const response = await result.response;
      const text = response.text();

      // Parse the JSON response
      let questions;
      try {
        // Clean the response to extract JSON
        const jsonStart = text.indexOf("[");
        const jsonEnd = text.lastIndexOf("]") + 1;
        
        if (jsonStart === -1 || jsonEnd === 0) {
          throw new Error("No JSON array found in response");
        }
        
        const jsonText = text.slice(jsonStart, jsonEnd);
        questions = JSON.parse(jsonText);
        
        // Validate the structure
        if (!Array.isArray(questions)) {
          throw new Error("Response is not an array");
        }
        
        // Ensure we have the right number of questions
        if (questions.length !== numberOfQuestions) {
          console.warn(`Expected ${numberOfQuestions} questions, got ${questions.length}`);
        }
        
        // Validate each question has required fields and map to enhanced structure
        questions = questions.map((q, index) => ({
          question: q.question || `Question ${index + 1}`,
          answer: q.answer || "Answer not provided",
          difficulty: q.difficulty || difficulty,
          category: q.category || "General",
          cognitive_level: q.cognitive_level || "Understand",
          keywords: q.keywords || [],
          source_context: q.source_context || "Document content",
          assessment_criteria: q.assessment_criteria || "General knowledge assessment",
          follow_up_potential: q.follow_up_potential || "None specified",
          industry_relevance: q.industry_relevance || "General application"
        }));
        
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);
        console.error("Raw response:", text);
        throw new Error("Failed to parse AI response as JSON");
      }

      return questions;
      
    } catch (error) {
      console.error("RAG question generation failed:", error);
      throw error;
    }
  }

  getVectorStoreInfo(): { documentCount: number } {
    return {
      documentCount: this.vectorStore.getDocumentCount()
    };
  }
}

export default RAGService;
