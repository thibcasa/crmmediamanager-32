interface RetryConfig {
  maxAttempts: number;
  delayMs: number;
  onRetry?: (attempt: number, error: any) => void;
}

export class RetryService {
  static async withRetry<T>(
    operation: () => Promise<T>,
    config: RetryConfig
  ): Promise<T> {
    const { maxAttempts, delayMs, onRetry } = config;
    let lastError: any;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        console.error(`Tentative ${attempt}/${maxAttempts} échouée:`, error);
        
        if (onRetry) {
          onRetry(attempt, error);
        }

        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
    }

    throw lastError;
  }
}