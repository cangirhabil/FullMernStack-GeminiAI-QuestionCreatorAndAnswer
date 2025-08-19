let pdfParse: ((buffer: Buffer) => Promise<{
  text: string;
  numpages: number;
  info?: Record<string, unknown>;
}>) | null = null;

/**
 * Lazy-load pdf-parse at runtime only (server side). Avoids build-time resolution
 * issues with Turbopack / Next.js by not touching require.cache / require.resolve.
 * Falls back gracefully with a mock implementation if the module is unavailable
 * (e.g. optional dependency or edge runtime).
 */
const getPdfParse = async (): Promise<(
  buffer: Buffer
) => Promise<{ text: string; numpages: number; info?: Record<string, unknown> }>> => {
  if (pdfParse) return pdfParse;
  try {
    // Dynamic import (CommonJS default export)
    // First try the safe wrapper (skips debug code) then fall back to normal import
    try {
      const { loadPdfParse } = await import('./pdf-parse-wrapper');
      pdfParse = await loadPdfParse();
    } catch {
      const mod = await import('pdf-parse');
      const fn: unknown = (mod as { default?: unknown }).default ?? mod;
      if (typeof fn !== 'function') throw new Error('pdf-parse did not export a function');
      pdfParse = fn as (buffer: Buffer) => Promise<{ text: string; numpages: number; info?: Record<string, unknown> }>;
    }
  } catch (error) {
    console.error('Failed to load pdf-parse (using fallback):', error);
    pdfParse = async (buffer: Buffer) => {
      console.warn('Attempting pdfjs-dist fallback extraction');
      try {
        const pdfjs = await import('pdfjs-dist');
        // Use loose typing via unknown and refine
        const candidate: unknown = (pdfjs as unknown as { getDocument?: unknown; default?: { getDocument?: unknown } }).getDocument
          || (pdfjs as unknown as { default?: { getDocument?: unknown } }).default?.getDocument;
        if (typeof candidate !== 'function') throw new Error('pdfjs getDocument not available');
  interface PdfjsPage { getTextContent: () => Promise<{ items: Array<{ str?: string }> }>; }
  interface PdfjsDoc { numPages: number; getPage: (n: number) => Promise<PdfjsPage>; }
  interface PdfjsLoadingTask<T> { promise: Promise<T>; }
  const loadingTask = (candidate as (args: { data: Buffer }) => PdfjsLoadingTask<PdfjsDoc>)({ data: buffer });
  const doc = await loadingTask.promise;
        let text = '';
        const maxPages = Math.min(doc.numPages, 25); // cap for performance
        for (let i = 1; i <= maxPages; i++) {
          const page = await doc.getPage(i);
          const content: { items: Array<{ str?: string }> } = await page.getTextContent();
          const pageText = content.items.map(it => it.str || '').join(' ');
          text += pageText + '\n';
        }
        return { text, numpages: doc.numPages, info: { Title: 'Unknown PDF (pdfjs fallback)' } };
      } catch (e) {
        console.warn('pdfjs-dist fallback failed, returning minimal placeholder', e);
        return {
          text: `PDF parsing unavailable. Size: ${buffer.length} bytes (no parser).`,
          numpages: 1,
          info: { Title: 'Unknown PDF' }
        };
      }
    };
  }
  return pdfParse as (buffer: Buffer) => Promise<{ text: string; numpages: number; info?: Record<string, unknown> }>;
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
