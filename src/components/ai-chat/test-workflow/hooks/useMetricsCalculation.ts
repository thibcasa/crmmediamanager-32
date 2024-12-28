import { TestResults } from '../types/test-results';

export const useMetricsCalculation = () => {
  const calculateImprovement = (current: TestResults, previous?: TestResults) => {
    if (!previous) return 0;
    
    const engagementImprovement = (current.engagement - previous.engagement) / previous.engagement;
    const roiImprovement = (current.roi - previous.roi) / previous.roi;
    return ((engagementImprovement + roiImprovement) / 2) * 100;
  };

  const checkProductionReadiness = (results: TestResults) => {
    const isEngagementReady = results.engagement >= 0.6;
    const isRoiReady = results.roi >= 2;
    const isConversionReady = results.conversionRate >= 0.03;
    
    return {
      ready: isEngagementReady && isRoiReady && isConversionReady,
      metrics: {
        engagement: isEngagementReady,
        roi: isRoiReady,
        conversion: isConversionReady
      }
    };
  };

  return {
    calculateImprovement,
    checkProductionReadiness
  };
};