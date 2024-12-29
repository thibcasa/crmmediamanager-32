import { AlertCircle } from "lucide-react";

interface CharacterCounterProps {
  currentLength: number;
  maxLength: number;
}

export const CharacterCounter = ({ currentLength, maxLength }: CharacterCounterProps) => {
  const isOverLimit = currentLength > maxLength;

  return (
    <div className="flex justify-between items-center px-1">
      <div className="flex items-center">
        {isOverLimit && (
          <div className="flex items-center text-red-500 text-xs">
            <AlertCircle className="h-3 w-3 mr-1" />
            Limite de caractères dépassée
          </div>
        )}
      </div>
      <span className={`text-xs ${
        isOverLimit ? 'text-red-500' : 'text-sage-600'
      }`}>
        {currentLength}/{maxLength} caractères
      </span>
    </div>
  );
};