import { MetricsData } from '../types/chat';

interface MessageMetricsProps {
  metrics: MetricsData;
}

export const MessageMetrics = ({ metrics }: MessageMetricsProps) => {
  return (
    <div className="grid grid-cols-4 gap-4 mt-4">
      <div className="text-center">
        <div className="text-sm font-medium text-gray-500">Engagement</div>
        <div className="text-lg font-semibold">{metrics.engagement}%</div>
      </div>
      <div className="text-center">
        <div className="text-sm font-medium text-gray-500">Clics</div>
        <div className="text-lg font-semibold">{metrics.clicks}</div>
      </div>
      <div className="text-center">
        <div className="text-sm font-medium text-gray-500">Conversions</div>
        <div className="text-lg font-semibold">{metrics.conversions}</div>
      </div>
      <div className="text-center">
        <div className="text-sm font-medium text-gray-500">ROI</div>
        <div className="text-lg font-semibold">{metrics.roi}x</div>
      </div>
    </div>
  );
};