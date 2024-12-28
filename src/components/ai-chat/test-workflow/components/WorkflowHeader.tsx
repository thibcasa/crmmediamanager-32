import { Card } from "@/components/ui/card";

interface WorkflowHeaderProps {
  iterationCount: number;
  isAnalyzing: boolean;
  progress: number;
}

export const WorkflowHeader = ({ iterationCount, isAnalyzing, progress }: WorkflowHeaderProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Test & Validation</h3>
        <div className="text-sm text-muted-foreground">
          Itération {iterationCount}
        </div>
      </div>
      
      {isAnalyzing && (
        <Card className="p-4">
          <div className="space-y-2">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-in-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Analyse en cours... {progress}%
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};