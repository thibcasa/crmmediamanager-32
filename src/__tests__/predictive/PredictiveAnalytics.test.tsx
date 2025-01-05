import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { PredictiveAnalytics } from '@/components/predictive/PredictiveAnalytics';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PredictiveAnalysisService } from '@/services/ai/PredictiveAnalysisService';

// Mock the service
vi.mock('@/services/ai/PredictiveAnalysisService', () => ({
  PredictiveAnalysisService: {
    generateOptimizationSuggestions: vi.fn()
  }
}));

describe('PredictiveAnalytics', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders recommendations when data is available', async () => {
    const mockRecommendations = {
      recommendations: [
        'Augmenter la fréquence des posts entre 18h et 20h',
        'Cibler davantage la région des Alpes-Maritimes'
      ]
    };

    (PredictiveAnalysisService.generateOptimizationSuggestions as ReturnType<typeof vi.fn>).mockResolvedValue(mockRecommendations);

    render(
      <QueryClientProvider client={queryClient}>
        <PredictiveAnalytics />
      </QueryClientProvider>
    );

    // Verify loading state
    expect(screen.getByText('Analyses Prédictives')).toBeInTheDocument();

    // Wait for recommendations to load
    await waitFor(() => {
      expect(screen.getByText('Augmenter la fréquence des posts entre 18h et 20h')).toBeInTheDocument();
      expect(screen.getByText('Cibler davantage la région des Alpes-Maritimes')).toBeInTheDocument();
    });

    // Verify impact badges are rendered
    const impactBadges = screen.getAllByText(/Impact Estimé: \+\d+%/);
    expect(impactBadges.length).toBeGreaterThan(0);
  });

  test('handles error state gracefully', async () => {
    (PredictiveAnalysisService.generateOptimizationSuggestions as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('Failed to fetch predictions')
    );

    render(
      <QueryClientProvider client={queryClient}>
        <PredictiveAnalytics />
      </QueryClientProvider>
    );

    // Component should not crash and should handle the error gracefully
    await waitFor(() => {
      expect(screen.queryByText(/Error:/)).not.toBeInTheDocument();
    });
  });
});