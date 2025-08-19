declare module "pdf-parse" {
  interface PDFInfo {
    numpages: number;
    numrender: number;
    info: Record<string, unknown>;
    metadata?: any;
    version: string;
    text: string;
  }
  interface Options {
    max?: number;
    version?: string;
  }
  function pdf(
    dataBuffer: Buffer | Uint8Array,
    options?: Options
  ): Promise<PDFInfo>;
  export default pdf;
}

// Internal lib path shim used by wrapper to bypass debug harness
declare module 'pdf-parse/lib/pdf-parse.js' {
  interface PDFInfoInternal {
    numpages: number;
    numrender: number;
    info: Record<string, unknown>;
    metadata?: any;
    version: string;
    text: string;
  }
  function pdf(
    dataBuffer: Buffer | Uint8Array,
    options?: { max?: number; version?: string }
  ): Promise<PDFInfoInternal>;
  export default pdf;
}
