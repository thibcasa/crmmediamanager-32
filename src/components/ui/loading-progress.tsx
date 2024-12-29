import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface LoadingProgressProps {
  isLoading: boolean;
}

export const LoadingProgress = ({ isLoading }: LoadingProgressProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? 90 : prev + 10));
      }, 500);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="px-4">
      <Progress value={progress} className="w-full h-2" />
      <p className="text-xs text-sage-600 mt-1 text-center">
        Génération en cours...
      </p>
    </div>
  );
};