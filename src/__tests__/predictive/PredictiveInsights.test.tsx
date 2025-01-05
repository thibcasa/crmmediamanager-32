import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { PredictiveInsights } from '@/components/predictive/PredictiveInsights';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PredictiveAnalysisService } from '@/services/ai/PredictiveAnalysisService';

vi.mock('@/services/ai/PredictiveAnalysisService', () => ({
  PredictiveAnalysisService: {
    analyzeCampaignPerformance: vi.fn()
  }
}));

describe('PredictiveInsights', () => {
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

  test('renders insights table with correct data', async () => {
    const mockInsights = {
      insights: [
        {
          category: 'Engagement',
          description: 'Les posts avec images ont 50% plus d\'engagement',
          impact: 8,
          confidence: 0.85
        },
        {
          category: 'Timing',
          description: 'Performance optimale entre 18h et 20h',
          impact: 7,
          confidence: 0.92
        }
      ]
    };

    (PredictiveAnalysisService.analyzeCampaignPerformance as ReturnType<typeof vi.fn>).mockResolvedValue(mockInsights);

    render(
      <QueryClientProvider client={queryClient}>
        <PredictiveInsights />
      </QueryClientProvider>
    );

    // Verify table headers
    expect(screen.getByText('Catégorie')).toBeInTheDocument();
    expect(screen.getByText('Impact')).toBeInTheDocument();
    expect(screen.getByText('Confiance')).toBeInTheDocument();

    // Wait for insights to load
    await waitFor(() => {
      expect(screen.getByText('Les posts avec images ont 50% plus d\'engagement')).toBeInTheDocument();
      expect(screen.getByText('Performance optimale entre 18h et 20h')).toBeInTheDocument();
    });

    // Verify impact and confidence scores
    expect(screen.getByText('8/10')).toBeInTheDocument();
    expect(screen.getByText('85.0%')).toBeInTheDocument();
  });

  test('handles empty insights gracefully', async () => {
    (PredictiveAnalysisService.analyzeCampaignPerformance as ReturnType<typeof vi.fn>).mockResolvedValue({ insights: [] });

    render(
      <QueryClientProvider client={queryClient}>
        <PredictiveInsights />
      </QueryClientProvider>
    );

    // Component should render nothing when no insights are available
    await waitFor(() => {
      expect(screen.queryByText('Catégorie')).not.toBeInTheDocument();
    });
  });
});