import { Card } from "@/components/ui/card";
import { ModuleType, ModuleResult } from '@/types/modules';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ModuleResultsProps {
  moduleType: ModuleType;
  result: ModuleResult;
}

export const ModuleResults = ({ moduleType, result }: ModuleResultsProps) => {
  const { toast } = useToast();

  const renderContent = () => {
    switch (moduleType) {
      case 'title':
        return (
          <div className="space-y-4">
            <h3 className="font-medium">Titres générés</h3>
            {result.data.titles?.map((title: string, index: number) => (
              <div key={index} className="p-3 bg-muted rounded-lg">
                {title}
              </div>
            ))}
          </div>
        );
      case 'content':
        return (
          <div className="space-y-4">
            <h3 className="font-medium">Contenu généré</h3>
            <div className="prose max-w-none">
              {result.data.content}
            </div>
          </div>
        );
      case 'creative':
        return (
          <div className="space-y-4">
            <h3 className="font-medium">Créatifs générés</h3>
            <div className="grid grid-cols-2 gap-4">
              {result.data.creatives?.map((creative: any, index: number) => (
                <div key={index} className="relative">
                  <img 
                    src={creative.url} 
                    alt={`Créatif ${index + 1}`}
                    className="rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        );
      case 'workflow':
        return (
          <div className="space-y-4">
            <h3 className="font-medium">Workflow généré</h3>
            <div className="p-4 bg-muted rounded-lg">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(result.data.workflow, null, 2)}
              </pre>
            </div>
          </div>
        );
      case 'pipeline':
        return (
          <div className="space-y-4">
            <h3 className="font-medium">Pipeline généré</h3>
            <div className="p-4 bg-muted rounded-lg">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(result.data.pipeline, null, 2)}
              </pre>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-4 bg-muted rounded-lg">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <Card className="p-4">
      <ScrollArea className="h-[400px]">
        {renderContent()}
      </ScrollArea>
    </Card>
  );
};