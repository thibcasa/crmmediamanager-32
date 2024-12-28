import { Progress } from "@/components/ui/progress";
import { Loader2 } from 'lucide-react';

interface TestProgressProps {
  isTesting: boolean;
  progress: number;
}

export const TestProgress = ({ isTesting, progress }: TestProgressProps) => {
  if (!isTesting) return null;

  return (
    <div className="space-y-2">
      <Progress value={progress} className="w-full" />
      <p className="text-sm text-center text-muted-foreground">
        Analyse en cours... {progress}%
      </p>
    </div>
  );
};