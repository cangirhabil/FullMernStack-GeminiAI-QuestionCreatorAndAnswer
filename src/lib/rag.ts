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
  keywords: string[];
  source_context: string;
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
    const model = this.genAI.getGenerativeModel({ model: "text-embedding-004" });
    
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
      }
    }
  }

  async similaritySearch(query: string, k: number = 5): Promise<DocumentChunk[]> {
    if (this.documents.length === 0) return [];

    try {
      const model = this.genAI.getGenerativeModel({ model: "text-embedding-004" });
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

    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      chunks.push(text.slice(start, end));
      start = end - overlap;
      
      if (start >= text.length) break;
    }

    return chunks;
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
    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
You are an expert interview question creator with access to specific document content.
Your goal is to create comprehensive, well-structured interview questions that thoroughly test understanding of the material.

DOCUMENT INFORMATION:
Filename: ${filename}
Total Content Length: ${documentContent.length} characters

RELEVANT CONTEXT FROM DOCUMENT:
"""
${retrievedContext || documentContent.slice(0, 6000)}
"""

TASK:
Create exactly ${numberOfQuestions} interview questions at ${difficulty} difficulty level.

REQUIREMENTS:
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

FORMAT:
Return a valid JSON array where each object has this exact structure:
{
  "question": "Clear, specific interview question",
  "answer": "Comprehensive answer with relevant details from the document",
  "difficulty": "${difficulty}",
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
        
        // Validate each question has required fields
        questions = questions.map((q, index) => ({
          question: q.question || `Question ${index + 1}`,
          answer: q.answer || "Answer not provided",
          difficulty: q.difficulty || difficulty,
          category: q.category || "General",
          keywords: q.keywords || [],
          source_context: q.source_context || "Document content"
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
