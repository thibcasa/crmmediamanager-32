import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BudgetSectionProps {
  data: {
    daily: number;
    duration: number;
    distribution: string;
  };
  onChange: (data: BudgetSectionProps['data']) => void;
}

export const BudgetSection = ({ data, onChange }: BudgetSectionProps) => {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Planification budgétaire</h3>
        <p className="text-sm text-muted-foreground">
          Définissez votre budget et la durée de la campagne
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="daily">Budget quotidien (€)</Label>
          <Input
            id="daily"
            type="number"
            min="5"
            value={data.daily}
            onChange={(e) => onChange({...data, daily: Number(e.target.value)})}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Durée (jours)</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            value={data.duration}
            onChange={(e) => onChange({...data, duration: Number(e.target.value)})}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="distribution">Distribution du budget</Label>
          <Select 
            value={data.distribution}
            onValueChange={(value) => onChange({...data, distribution: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir une distribution" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="automatic">Automatique</SelectItem>
              <SelectItem value="manual">Manuelle</SelectItem>
              <SelectItem value="accelerated">Accélérée</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};