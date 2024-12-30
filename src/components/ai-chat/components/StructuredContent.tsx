import { StructuredMessage } from '../types/chat';
import { MessageMetrics } from './MessageMetrics';

interface StructuredContentProps {
  content: StructuredMessage;
}

export const StructuredContent = ({ content }: StructuredContentProps) => {
  return (
    <div className="space-y-4">
      {content.text && (
        <p className="text-sage-700">{content.text}</p>
      )}
      {content.platform && (
        <p className="text-sm text-sage-600">
          Plateforme: {content.platform}
        </p>
      )}
      {content.targetAudience && (
        <p className="text-sm text-sage-600">
          Audience cible: {content.targetAudience}
        </p>
      )}
      {content.metrics && (
        <MessageMetrics metrics={content.metrics} />
      )}
    </div>
  );
};