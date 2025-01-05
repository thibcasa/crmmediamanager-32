import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorDisplayProps {
  error: Error | unknown;
}

export const ErrorDisplay = ({ error }: ErrorDisplayProps) => {
  const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue";
  
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erreur</AlertTitle>
      <AlertDescription>{errorMessage}</AlertDescription>
    </Alert>
  );
};