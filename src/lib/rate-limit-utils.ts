// Rate limiting utilities for Gemini API

export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error = new Error('Unknown error');
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: unknown) {
      lastError = error as Error;
      
      // Check if it's a rate limit error
      if (isRateLimitError(error)) {
        const retryAfter = extractRetryDelay(error);
        const delay = Math.min(retryAfter || baseDelay * Math.pow(2, attempt - 1), 60000); // Max 60s
        
        console.warn(`Rate limited. Retrying in ${delay}ms (attempt ${attempt}/${maxRetries})`);
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
      
      // If it's not a rate limit error or we've exhausted retries, throw
      if (attempt === maxRetries) {
        throw error;
      }
      
      // For other errors, wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, baseDelay * attempt));
    }
  }
  
  throw lastError;
}

function extractRetryDelay(error: unknown): number | null {
  try {
    const errorObj = error as { errorDetails?: Array<{ '@type'?: string; retryDelay?: string }> };
    if (errorObj.errorDetails && Array.isArray(errorObj.errorDetails)) {
      for (const detail of errorObj.errorDetails) {
        if (detail['@type'] === 'type.googleapis.com/google.rpc.RetryInfo' && detail.retryDelay) {
          // Convert seconds to milliseconds
          const seconds = parseFloat(detail.retryDelay.replace('s', ''));
          return seconds * 1000;
        }
      }
    }
  } catch (e) {
    console.warn('Failed to extract retry delay:', e);
  }
  return null;
}

export function isRateLimitError(error: unknown): boolean {
  const errorObj = error as { status?: number; message?: string };
  return (errorObj.status === 429) || 
         Boolean(errorObj.message && errorObj.message.includes('quota')) ||
         Boolean(errorObj.message && errorObj.message.includes('rate limit'));
}

export function isQuotaExceededError(error: unknown): boolean {
  const errorObj = error as { status?: number; errorDetails?: unknown };
  return Boolean(errorObj.status === 429 &&
         errorObj.errorDetails &&
         JSON.stringify(errorObj.errorDetails).includes('QuotaFailure'));
}
