import { Card } from "@/components/ui/card";
import { CampaignData } from '../../types/campaign';

interface ContentDisplayProps {
  content: CampaignData['content'];
}

export const ContentDisplay = ({ content }: ContentDisplayProps) => {
  if (content.length === 0) return null;

  return (
    <div className="space-y-4">
      {content.map((item, index) => (
        <Card key={index} className="p-4">
          <p className="text-sm font-medium mb-2">
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </p>
          <p className="text-sm whitespace-pre-wrap">{item.text}</p>
        </Card>
      ))}
    </div>
  );
};