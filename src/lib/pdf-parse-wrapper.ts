// Wrapper around pdf-parse to avoid executing debug code in its index which
// references a non-existent test file in production builds.
// We import the internal implementation directly.
type PdfParseFn = (buffer: Buffer) => Promise<{ text: string; numpages: number; info?: Record<string, unknown> }>;
let impl: PdfParseFn | null = null;

export const loadPdfParse = async () => {
  if (impl) return impl;
  try {
    // Import internal lib directly to skip index.js debug harness
  const mod = await import('pdf-parse/lib/pdf-parse.js');
  const fn = (mod as { default?: unknown } | unknown as { default?: unknown }).default ?? (mod as unknown);
    if (typeof fn !== 'function') throw new Error('pdf-parse internal lib did not export a function');
  impl = fn as PdfParseFn;
  } catch (e) {
    throw e;
  }
  return impl;
};

export default loadPdfParse;
