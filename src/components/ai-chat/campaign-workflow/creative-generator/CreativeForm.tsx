import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wand2, Loader2 } from 'lucide-react';

interface CreativeFormProps {
  onSubmit: (prompt: string) => void;
  isGenerating: boolean;
}

export const CreativeForm = ({ onSubmit, isGenerating }: CreativeFormProps) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = () => {
    onSubmit(prompt);
    setPrompt('');
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Ex: Une belle villa avec vue mer à Nice..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <Button
        onClick={handleSubmit}
        disabled={isGenerating || !prompt}
        className="w-full"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Génération en cours...
          </>
        ) : (
          <>
            <Wand2 className="mr-2 h-4 w-4" />
            Générer les créatives
          </>
        )}
      </Button>
    </div>
  );
};