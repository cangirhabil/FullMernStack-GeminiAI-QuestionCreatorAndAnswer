let pdfParse: ((buffer: Buffer) => Promise<{
  text: string;
  numpages: number;
  info?: Record<string, unknown>;
}>) | null = null;

// Dynamically import pdf-parse to avoid build issues
const getPdfParse = async () => {
  if (!pdfParse) {
    try {
      // Clear require cache and try different import methods
      delete require.cache[require.resolve('pdf-parse')];
      
      const pdfParseModule = await import('pdf-parse');
      pdfParse = pdfParseModule.default || pdfParseModule;
      
      if (typeof pdfParse !== 'function') {
        throw new Error('pdf-parse import failed - not a function');
      }
      
    } catch (error) {
      console.error('Failed to load pdf-parse:', error);
      // Return a mock function for graceful fallback
      return async (buffer: Buffer) => {
        console.warn('PDF parsing not available, returning mock data');
        return {
          text: `PDF parsing temporarily unavailable. File size: ${buffer.length} bytes.`,
          numpages: 1,
          info: { Title: 'Unknown PDF' }
        };
      };
    }
  }
  return pdfParse;
};

interface ParsedDocument {
  text: string;
  pages: number;
  title?: string;
  metadata?: Record<string, unknown>;
}

export class DocumentParser {
  static async parsePDF(buffer: Buffer): Promise<ParsedDocument> {
    try {
      const pdfParseFunc = await getPdfParse();
      const data = await pdfParseFunc(buffer);
      
      return {
        text: data.text || '',
        pages: data.numpages || 0,
        title: (data.info && typeof data.info === 'object' && 'Title' in data.info ? data.info.Title as string : undefined) || undefined,
        metadata: data.info || {}
      };
    } catch (error) {
      console.error('PDF parsing error:', error);
      // Fallback to basic text extraction if PDF parsing fails
      const text = buffer.toString('utf-8', 0, Math.min(1000, buffer.length));
      return {
        text: text || 'Failed to parse PDF content',
        pages: 1,
        metadata: { error: 'PDF parsing failed', type: 'fallback' }
      };
    }
  }

  static async parseText(buffer: Buffer): Promise<ParsedDocument> {
    try {
      const text = buffer.toString('utf-8');
      
      return {
        text,
        pages: 1,
        metadata: { type: 'text' }
      };
    } catch (error) {
      console.error('Text parsing error:', error);
      throw new Error('Failed to parse text document');
    }
  }

  static async parseDocument(buffer: Buffer, mimeType?: string, filename?: string): Promise<ParsedDocument> {
    const extension = filename?.toLowerCase().split('.').pop();
    
    // Determine parsing method based on file extension or mime type
    if (extension === 'pdf' || mimeType?.includes('pdf')) {
      return this.parsePDF(buffer);
    } else if (extension === 'txt' || mimeType?.includes('text')) {
      return this.parseText(buffer);
    } else {
      // Default to text parsing for unknown types
      return this.parseText(buffer);
    }
  }

  static cleanText(text: string): string {
    return text
      // Remove excessive whitespace
      .replace(/\s+/g, ' ')
      // Remove special characters that might interfere with processing
      .replace(/[^\w\s\.\,\!\?\;\:\-\(\)\[\]\{\}\"\']/g, ' ')
      // Normalize line breaks
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      // Remove multiple consecutive newlines
      .replace(/\n{3,}/g, '\n\n')
      // Trim
      .trim();
  }

  static extractKeyTerms(text: string, limit: number = 20): string[] {
    // Simple keyword extraction
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3);

    // Count word frequency
    const wordCount: { [key: string]: number } = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    // Sort by frequency and return top terms
    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([word]) => word);
  }
}

export default DocumentParser;
