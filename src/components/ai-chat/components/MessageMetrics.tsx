import { MetricsData } from '../types/chat';

interface MessageMetricsProps {
  metrics: MetricsData;
}

export const MessageMetrics = ({ metrics }: MessageMetricsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
      {metrics.engagement !== undefined && (
        <div className="bg-sage-50 p-4 rounded-lg">
          <p className="text-sm text-sage-600">Engagement</p>
          <p className="text-lg font-semibold text-sage-700">{metrics.engagement}%</p>
        </div>
      )}
      {metrics.clicks !== undefined && (
        <div className="bg-sage-50 p-4 rounded-lg">
          <p className="text-sm text-sage-600">Clics</p>
          <p className="text-lg font-semibold text-sage-700">{metrics.clicks}</p>
        </div>
      )}
      {metrics.conversions !== undefined && (
        <div className="bg-sage-50 p-4 rounded-lg">
          <p className="text-sm text-sage-600">Conversions</p>
          <p className="text-lg font-semibold text-sage-700">{metrics.conversions}</p>
        </div>
      )}
      {metrics.roi !== undefined && (
        <div className="bg-sage-50 p-4 rounded-lg">
          <p className="text-sm text-sage-600">ROI</p>
          <p className="text-lg font-semibold text-sage-700">{metrics.roi}%</p>
        </div>
      )}
    </div>
  );
};