import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface ContentStrategy {
  postTypes: string[];
  postingFrequency: string;
  bestTimes: string[];
  contentThemes: string[];
}

interface ContentStrategyFormProps {
  initialStrategy?: ContentStrategy;
  onChange: (strategy: ContentStrategy) => void;
}

export const ContentStrategyForm = ({ initialStrategy, onChange }: ContentStrategyFormProps) => {
  const [strategy, setStrategy] = useState<ContentStrategy>(initialStrategy || {
    postTypes: ['image', 'carousel'],
    postingFrequency: 'daily',
    bestTimes: ['09:00', '12:00', '17:00'],
    contentThemes: ['property_showcase']
  });

  const handleChange = (updates: Partial<ContentStrategy>) => {
    const newStrategy = { ...strategy, ...updates };
    setStrategy(newStrategy);
    onChange(newStrategy);
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <Label className="text-lg font-medium">Stratégie de contenu</Label>
        <p className="text-sm text-muted-foreground">
          Définissez votre stratégie de publication
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Types de posts</Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {[
              { id: 'image', label: 'Images' },
              { id: 'carousel', label: 'Carrousel' },
              { id: 'video', label: 'Vidéos' },
              { id: 'story', label: 'Stories' }
            ].map(type => (
              <div key={type.id} className="flex items-center space-x-2">
                <Switch
                  checked={strategy.postTypes.includes(type.id)}
                  onCheckedChange={(checked) => {
                    const newTypes = checked
                      ? [...strategy.postTypes, type.id]
                      : strategy.postTypes.filter(t => t !== type.id);
                    handleChange({ postTypes: newTypes });
                  }}
                />
                <Label>{type.label}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Fréquence de publication</Label>
          <Select
            value={strategy.postingFrequency}
            onValueChange={(value) => handleChange({ postingFrequency: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir une fréquence" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Quotidienne</SelectItem>
              <SelectItem value="weekly">Hebdomadaire</SelectItem>
              <SelectItem value="biweekly">Bi-hebdomadaire</SelectItem>
              <SelectItem value="monthly">Mensuelle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Thèmes de contenu</Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {[
              { id: 'property_showcase', label: 'Présentation de biens' },
              { id: 'market_insights', label: 'Analyse du marché' },
              { id: 'testimonials', label: 'Témoignages' },
              { id: 'tips', label: 'Conseils immobiliers' },
              { id: 'local_news', label: 'Actualités locales' },
              { id: 'lifestyle', label: 'Art de vivre' }
            ].map(theme => (
              <div key={theme.id} className="flex items-center space-x-2">
                <Switch
                  checked={strategy.contentThemes.includes(theme.id)}
                  onCheckedChange={(checked) => {
                    const newThemes = checked
                      ? [...strategy.contentThemes, theme.id]
                      : strategy.contentThemes.filter(t => t !== theme.id);
                    handleChange({ contentThemes: newThemes });
                  }}
                />
                <Label>{theme.label}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};