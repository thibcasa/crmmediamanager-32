import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface KPIsSectionProps {
  data: {
    targetCTR: number;
    targetCPL: number;
    targetConversionRate: number;
  };
  onChange: (data: KPIsSectionProps['data']) => void;
}

export const KPIsSection = ({ data, onChange }: KPIsSectionProps) => {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Indicateurs de performance (KPIs)</h3>
        <p className="text-sm text-muted-foreground">
          Définissez vos objectifs de performance
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="targetCTR">Taux de clics cible (%)</Label>
          <Input
            id="targetCTR"
            type="number"
            step="0.1"
            min="0"
            value={data.targetCTR}
            onChange={(e) => onChange({...data, targetCTR: Number(e.target.value)})}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetCPL">Coût par lead cible (€)</Label>
          <Input
            id="targetCPL"
            type="number"
            step="0.5"
            min="0"
            value={data.targetCPL}
            onChange={(e) => onChange({...data, targetCPL: Number(e.target.value)})}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetConversionRate">Taux de conversion cible (%)</Label>
          <Input
            id="targetConversionRate"
            type="number"
            step="0.1"
            min="0"
            value={data.targetConversionRate}
            onChange={(e) => onChange({...data, targetConversionRate: Number(e.target.value)})}
          />
        </div>
      </div>
    </Card>
  );
};