import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Wand2 } from 'lucide-react';
import { supabase } from "@/lib/supabaseClient";

export default function SubjectModule() {
  const [objective, setObjective] = useState('');
  const [domain, setDomain] = useState('luxury_real_estate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSubjects, setGeneratedSubjects] = useState<string[]>([]);
  const { toast } = useToast();

  const handleGenerateSubjects = async () => {
    try {
      setIsGenerating(true);
      console.log('Generating subjects with input:', { objective, domain });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('content-workflow-generator', {
        body: {
          action: 'generate_subjects',
          objective,
          domain,
          target_audience: "propriétaires immobiliers Alpes-Maritimes",
          count: 3
        }
      });

      if (error) throw error;

      // Ensure data.subjects exists and is an array before setting it
      const subjects = Array.isArray(data?.subjects) ? data.subjects : [];
      setGeneratedSubjects(subjects);
      
      // Log the successful generation
      await supabase.from('automation_logs').insert({
        user_id: user.id,
        action_type: 'subject_generation',
        description: 'Generated real estate subjects',
        metadata: {
          objective,
          domain,
          generated_subjects: subjects
        }
      });

      toast({
        title: "Sujets générés",
        description: "Vos sujets ont été générés avec succès",
      });
    } catch (error) {
      console.error('Error generating subjects:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer les sujets",
        variant: "destructive",
      });
      // Initialize empty array on error to prevent undefined
      setGeneratedSubjects([]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Module Sujet</h1>
      
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Domaine</label>
            <Select value={domain} onValueChange={setDomain}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un domaine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="luxury_real_estate">Immobilier de luxe</SelectItem>
                <SelectItem value="investment_property">Investissement immobilier</SelectItem>
                <SelectItem value="property_management">Gestion locative</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Objectif</label>
            <Textarea
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Ex: Créer du contenu pour attirer des propriétaires de biens de luxe..."
              className="min-h-[100px]"
            />
          </div>

          <Button
            onClick={handleGenerateSubjects}
            disabled={isGenerating || !objective}
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
                Générer des sujets
              </>
            )}
          </Button>
        </div>

        {/* Only render subjects section if there are subjects */}
        {Array.isArray(generatedSubjects) && generatedSubjects.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium">Sujets générés</h3>
            <div className="space-y-2">
              {generatedSubjects.map((subject, index) => (
                <Card key={index} className="p-4">
                  <p>{subject}</p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}