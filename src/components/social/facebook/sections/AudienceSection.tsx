import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AudienceSectionProps {
  data: {
    location: string;
    ageRange: string;
    interests: string[];
  };
  onChange: (data: AudienceSectionProps['data']) => void;
}

export const AudienceSection = ({ data, onChange }: AudienceSectionProps) => {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Définition de l'audience</h3>
        <p className="text-sm text-muted-foreground">
          Configurez le ciblage de votre audience
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="location">Zone géographique</Label>
          <Input
            id="location"
            value={data.location}
            onChange={(e) => onChange({...data, location: e.target.value})}
            placeholder="Ex: Nice, Alpes-Maritimes"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ageRange">Tranche d'âge</Label>
          <Select 
            value={data.ageRange}
            onValueChange={(value) => onChange({...data, ageRange: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une tranche d'âge" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25-34">25-34 ans</SelectItem>
              <SelectItem value="35-44">35-44 ans</SelectItem>
              <SelectItem value="45-54">45-54 ans</SelectItem>
              <SelectItem value="55-65">55-65 ans</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Centres d'intérêt</Label>
          <div className="grid grid-cols-2 gap-2">
            {['Immobilier', 'Investissement', 'Finance', 'Luxe'].map((interest) => (
              <div
                key={interest}
                className={`p-2 border rounded cursor-pointer ${
                  data.interests.includes(interest) 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => {
                  const newInterests = data.interests.includes(interest)
                    ? data.interests.filter(i => i !== interest)
                    : [...data.interests, interest];
                  onChange({...data, interests: newInterests});
                }}
              >
                {interest}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};