import { TestResults } from '../types/test-results';

export const calculateImprovement = (current: TestResults, previous: TestResults): number => {
  if (!previous) return 0;
  const engagementImprovement = (current.engagement - previous.engagement) / previous.engagement;
  const roiImprovement = (current.roi - previous.roi) / previous.roi;
  return ((engagementImprovement + roiImprovement) / 2) * 100;
};

export const checkProductionReadiness = (results: TestResults): boolean => {
  return results.roi >= 3 && results.engagement >= 0.3;
};