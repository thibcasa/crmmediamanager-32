import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ObjectivesSectionProps {
  data: {
    leadGeneration: boolean;
    brandAwareness: boolean;
    expertise: boolean;
  };
  onChange: (data: ObjectivesSectionProps['data']) => void;
}

export const ObjectivesSection = ({ data, onChange }: ObjectivesSectionProps) => {
  return (
    <Card className="p-6 space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Objectifs de la campagne</h3>
        <p className="text-sm text-muted-foreground">
          Sélectionnez les objectifs principaux de votre campagne
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="leadGeneration"
            checked={data.leadGeneration}
            onCheckedChange={(checked) => 
              onChange({...data, leadGeneration: checked as boolean})}
          />
          <Label htmlFor="leadGeneration">Génération de leads qualifiés</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="brandAwareness"
            checked={data.brandAwareness}
            onCheckedChange={(checked) => 
              onChange({...data, brandAwareness: checked as boolean})}
          />
          <Label htmlFor="brandAwareness">Notoriété de la marque</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="expertise"
            checked={data.expertise}
            onCheckedChange={(checked) => 
              onChange({...data, expertise: checked as boolean})}
          />
          <Label htmlFor="expertise">Démonstration d'expertise</Label>
        </div>
      </div>
    </Card>
  );
};