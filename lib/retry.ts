interface RateLimitError {
  error: {
    code: string;
  };
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Check if it's a rate limit error
      const rateLimitError = error as RateLimitError;
      if (rateLimitError?.error?.code === "RATE_LIMITED") {
        // Wait with exponential backoff (1s, 2s, 4s)
        await new Promise((resolve) =>
          setTimeout(resolve, Math.min(1000 * Math.pow(2, i), 10000)),
        );
        continue;
      }

      // If it's not a rate limit error, throw immediately
      throw error;
    }
  }

  throw lastError;
}
