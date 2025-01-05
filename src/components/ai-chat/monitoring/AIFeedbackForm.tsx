import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AIMonitoringService } from '@/services/ai/monitoring/AIMonitoringService';
import { toast } from "@/components/ui/use-toast";

interface AIFeedbackFormProps {
  moduleType: string;
  suggestion: string;
}

export const AIFeedbackForm = ({ moduleType, suggestion }: AIFeedbackFormProps) => {
  const [isAccepted, setIsAccepted] = useState(true);
  const [modifications, setModifications] = useState<string>('');
  const [comments, setComments] = useState<string>('');

  const handleSubmit = async () => {
    try {
      await AIMonitoringService.logMetrics({
        moduleType,
        accuracy: isAccepted ? 1 : 0,
        confidence: 0.8,
        userFeedback: {
          isAccepted,
          modifications: modifications.split('\n').filter(m => m.trim()),
          comments: comments.trim()
        }
      });

      toast({
        title: "Feedback enregistré",
        description: "Merci de nous aider à améliorer l'IA !",
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre feedback",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Évaluation de la suggestion</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {isAccepted ? 'Acceptée' : 'Rejetée'}
          </span>
          <Switch
            checked={isAccepted}
            onCheckedChange={setIsAccepted}
          />
        </div>
      </div>

      {!isAccepted && (
        <Textarea
          placeholder="Quelles modifications avez-vous apportées ? (une par ligne)"
          value={modifications}
          onChange={(e) => setModifications(e.target.value)}
          className="min-h-[100px]"
        />
      )}

      <Textarea
        placeholder="Commentaires additionnels..."
        value={comments}
        onChange={(e) => setComments(e.target.value)}
      />

      <Button onClick={handleSubmit}>
        Envoyer le feedback
      </Button>
    </div>
  );
};