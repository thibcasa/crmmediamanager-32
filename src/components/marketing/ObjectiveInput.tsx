import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ObjectiveInputProps {
  onSubmit: (objective: string) => void;
  placeholder?: string;
}

export const ObjectiveInput = ({ onSubmit, placeholder }: ObjectiveInputProps) => {
  const [objective, setObjective] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (objective.trim()) {
      onSubmit(objective);
      setObjective('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          placeholder={placeholder || "Entrez votre objectif commercial..."}
          className="flex-1"
        />
        <Button type="submit">
          Valider
        </Button>
      </div>
    </form>
  );
};