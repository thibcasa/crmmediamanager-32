import { Button } from "@/components/ui/button";
import { TestTube, ArrowRight } from "lucide-react";

interface TestActionsProps {
  onTest: () => void;
  onNext?: () => void;
  isAnalyzing: boolean;
  canProceed?: boolean;
}

export const TestActions = ({ onTest, onNext, isAnalyzing, canProceed }: TestActionsProps) => {
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        onClick={onTest}
        disabled={isAnalyzing}
        className="flex items-center gap-2"
      >
        <TestTube className="h-4 w-4" />
        {isAnalyzing ? 'Analyse en cours...' : 'Lancer le test'}
      </Button>

      {onNext && (
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="flex items-center gap-2"
        >
          Suivant
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};