import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface ContentSectionProps {
  data: {
    format: string;
    cta: string;
    landingPage: string;
  };
  onChange: (data: ContentSectionProps['data']) => void;
}

export const ContentSection = ({ data, onChange }: ContentSectionProps) => {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Création des contenus</h3>
        <p className="text-sm text-muted-foreground">
          Définissez le format et le style de vos contenus
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="format">Format publicitaire</Label>
          <Select 
            value={data.format}
            onValueChange={(value) => onChange({...data, format: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir un format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="image">Image statique</SelectItem>
              <SelectItem value="video">Vidéo courte</SelectItem>
              <SelectItem value="carousel">Carrousel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cta">Call-to-Action (CTA)</Label>
          <Input
            id="cta"
            value={data.cta}
            onChange={(e) => onChange({...data, cta: e.target.value})}
            placeholder="Ex: En savoir plus"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="landingPage">Page de destination</Label>
          <Select 
            value={data.landingPage}
            onValueChange={(value) => onChange({...data, landingPage: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir une page de destination" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="form">Formulaire intégré</SelectItem>
              <SelectItem value="landing">Page dédiée</SelectItem>
              <SelectItem value="website">Site web</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};