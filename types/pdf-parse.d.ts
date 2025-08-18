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
