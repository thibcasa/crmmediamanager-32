import { StructuredContent } from '../types/chat';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Users, MapPin, Home, BarChart } from "lucide-react";

interface StructuredContentDisplayProps {
  content: StructuredContent;
}

export const StructuredContentDisplay = ({ content }: StructuredContentDisplayProps) => {
  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-2">
        <p className="text-lg font-medium">{content.text}</p>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            {content.platform}
          </Badge>
          
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {content.targetAudience}
          </Badge>
          
          <Badge variant="outline" className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {content.location}
          </Badge>
          
          <Badge variant="outline" className="flex items-center gap-1">
            <Home className="h-4 w-4" />
            {content.propertyType}
          </Badge>
        </div>
      </div>

      {content.metadata?.metrics && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
            <BarChart className="h-4 w-4" />
            Métriques prévues
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Engagement</p>
              <p className="text-lg font-medium">{content.metadata.metrics.engagement}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Clics</p>
              <p className="text-lg font-medium">{content.metadata.metrics.clicks}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Conversions</p>
              <p className="text-lg font-medium">{content.metadata.metrics.conversions}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ROI</p>
              <p className="text-lg font-medium">{content.metadata.metrics.roi}x</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};