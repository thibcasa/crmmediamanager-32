import { TestResults } from "../types/test-results";
import { useState, useEffect } from "react";

export const useMetricsAnalysis = (currentResults: TestResults, previousResults?: TestResults) => {
  const [improvement, setImprovement] = useState(0);
  const [readyForProduction, setReadyForProduction] = useState(false);

  useEffect(() => {
    if (previousResults) {
      const engagementImprovement = 
        ((currentResults.engagement - previousResults.engagement) / previousResults.engagement) * 100;
      const roiImprovement = 
        ((currentResults.roi - previousResults.roi) / previousResults.roi) * 100;
      
      setImprovement((engagementImprovement + roiImprovement) / 2);
    }

    setReadyForProduction(
      currentResults.roi >= 2 && 
      currentResults.engagement >= 0.6 &&
      currentResults.conversionRate >= 0.03
    );
  }, [currentResults, previousResults]);

  const getMetricStatus = (metric: number, threshold: number) => {
    if (metric >= threshold) return "success";
    if (metric >= threshold * 0.7) return "warning";
    return "error";
  };

  return {
    improvement,
    readyForProduction,
    getMetricStatus,
    metrics: {
      engagement: {
        value: currentResults.engagement,
        status: getMetricStatus(currentResults.engagement, 0.6)
      },
      roi: {
        value: currentResults.roi,
        status: getMetricStatus(currentResults.roi, 2)
      },
      conversion: {
        value: currentResults.conversionRate,
        status: getMetricStatus(currentResults.conversionRate, 0.03)
      }
    }
  };
};