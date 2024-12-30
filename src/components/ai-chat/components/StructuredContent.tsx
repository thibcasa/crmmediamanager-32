import { Card } from "@/components/ui/card";
import { StructuredContent } from '../types/chat';
import { MessageMetrics } from './MessageMetrics';

interface StructuredContentDisplayProps {
  content: StructuredContent;
}

export const StructuredContentDisplay = ({ content }: StructuredContentDisplayProps) => {
  return (
    <Card className="p-6 space-y-4">
      <div className="prose max-w-none">
        <p className="text-base text-gray-700">{content.text}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500">Plateforme</h4>
          <p className="text-sm">{content.platform}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Audience Cible</h4>
          <p className="text-sm">{content.targetAudience}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Localisation</h4>
          <p className="text-sm">{content.location}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Type de Bien</h4>
          <p className="text-sm">{content.propertyType}</p>
        </div>
      </div>

      <MessageMetrics metrics={content.metadata.metrics} />
    </Card>
  );
};