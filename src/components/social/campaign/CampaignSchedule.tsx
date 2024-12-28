import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface CampaignScheduleProps {
  schedule: {
    frequency: string;
    times: string[];
    days: string[];
  };
  onChange: (schedule: any) => void;
}

export const CampaignSchedule = ({ schedule, onChange }: CampaignScheduleProps) => {
  return (
    <Card className="p-4 space-y-4">
      <h3 className="font-medium">Planning de publication</h3>
      
      <div>
        <label className="block text-sm font-medium mb-2">Fréquence</label>
        <Select 
          value={schedule.frequency} 
          onValueChange={(value) => onChange({ ...schedule, frequency: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une fréquence" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Quotidien</SelectItem>
            <SelectItem value="weekly">Hebdomadaire</SelectItem>
            <SelectItem value="monthly">Mensuel</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};