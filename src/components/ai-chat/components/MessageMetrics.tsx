import { MetricsData } from '../types/chat';

interface MessageMetricsProps {
  metrics: MetricsData;
}

export const MessageMetrics = ({ metrics }: MessageMetricsProps) => {
  return (
    <div className="mt-2 p-2 bg-sage-50 rounded-md">
      <p className="text-sm font-medium text-sage-700">Métriques:</p>
      <div className="space-y-2 mt-2">
        {metrics.engagement !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-sage-600">Engagement:</span>
            <span className="text-sm font-medium text-sage-700">
              {(metrics.engagement * 100).toFixed(1)}%
            </span>
          </div>
        )}
        {metrics.clicks !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-sage-600">Clics:</span>
            <span className="text-sm font-medium text-sage-700">
              {metrics.clicks}
            </span>
          </div>
        )}
        {metrics.conversions !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-sage-600">Conversions:</span>
            <span className="text-sm font-medium text-sage-700">
              {metrics.conversions}
            </span>
          </div>
        )}
        {metrics.roi !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-sage-600">ROI:</span>
            <span className="text-sm font-medium text-sage-700">
              {metrics.roi.toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};