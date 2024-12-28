import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface CampaignSettingsProps {
  onUpdate: () => void;
}

export const CampaignSettings = ({ onUpdate }: CampaignSettingsProps) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    defaultObjective: "Générer des leads immobiliers qualifiés dans les Alpes-Maritimes",
    targetROI: 200,
    minEngagement: 30
  });

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Mise à jour des paramètres dans la base de données
      const { error } = await supabase
        .from('marketing_campaigns')
        .update({
          metadata: {
            defaultSettings: settings
          }
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Paramètres sauvegardés",
        description: "Les paramètres ont été mis à jour avec succès"
      });
      
      onUpdate();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="defaultObjective">Objectif par défaut</Label>
          <Input
            id="defaultObjective"
            value={settings.defaultObjective}
            onChange={(e) => setSettings(prev => ({ ...prev, defaultObjective: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="targetROI">ROI cible (%)</Label>
          <Input
            id="targetROI"
            type="number"
            value={settings.targetROI}
            onChange={(e) => setSettings(prev => ({ ...prev, targetROI: parseInt(e.target.value) }))}
          />
        </div>

        <div>
          <Label htmlFor="minEngagement">Engagement minimum (%)</Label>
          <Input
            id="minEngagement"
            type="number"
            value={settings.minEngagement}
            onChange={(e) => setSettings(prev => ({ ...prev, minEngagement: parseInt(e.target.value) }))}
          />
        </div>
      </div>

      <Button onClick={handleSave} className="w-full">
        Sauvegarder les paramètres
      </Button>
    </Card>
  );
};