import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/components/ui/use-toast";

export const AIFeedbackForm = () => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback || !rating) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase.from('automation_logs').insert({
        user_id: user.id,
        action_type: 'feedback',
        description: feedback,
        status: 'completed',
        metadata: { rating, type: 'user_feedback' }
      });

      if (error) throw error;

      toast({
        title: "Merci !",
        description: "Votre retour a bien été enregistré"
      });
      
      setFeedback('');
      setRating('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre retour",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Votre retour sur l'Assistant IA</h3>
        
        <div className="space-y-4">
          <div>
            <Label>Évaluation globale</Label>
            <RadioGroup
              value={rating}
              onValueChange={setRating}
              className="flex space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="positive" id="positive" />
                <Label htmlFor="positive">Positif</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="neutral" id="neutral" />
                <Label htmlFor="neutral">Neutre</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="negative" id="negative" />
                <Label htmlFor="negative">Négatif</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Commentaire détaillé</Label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Partagez votre expérience avec l'assistant..."
              className="mt-2"
            />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Envoi...' : 'Envoyer mon retour'}
      </Button>
    </form>
  );
};