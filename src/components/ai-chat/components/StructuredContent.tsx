import { Card } from "@/components/ui/card";
import { StructuredContent } from '../types/chat';
import { MessageMetrics } from './MessageMetrics';

interface StructuredContentProps {
  content: StructuredContent;
}

export const StructuredContent = ({ content }: StructuredContentProps) => {
  return (
    <Card className="p-6 space-y-4">
      <div className="prose max-w-none">
        <p className="text-lg whitespace-pre-wrap">{content.text}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
          LinkedIn
        </span>
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
          Alpes-Maritimes
        </span>
        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
          Immobilier de luxe
        </span>
      </div>

      <MessageMetrics metrics={content.metadata.metrics} />
    </Card>
  );
};