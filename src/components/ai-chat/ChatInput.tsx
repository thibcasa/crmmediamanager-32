import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ChatInput = ({ input, isLoading, onInputChange, onSubmit }: ChatInputProps) => {
  return (
    <form onSubmit={onSubmit} className="p-4 border-t border-sage-200 bg-white">
      <div className="flex gap-3">
        <Input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Ex: Crée une stratégie LinkedIn pour obtenir des mandats..."
          disabled={isLoading}
          className="flex-1 border-sage-200 focus:ring-sage-500"
        />
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-sage-600 hover:bg-sage-700 text-white"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};