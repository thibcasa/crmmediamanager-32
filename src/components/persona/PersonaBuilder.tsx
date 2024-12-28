import { Card } from "@/components/ui/card";
import { PersonaFilterManager } from './PersonaFilterManager';

export const PersonaBuilder = () => {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Création de Persona</h2>
        <p className="text-muted-foreground">
          Définissez vos personas cibles pour une meilleure segmentation de votre audience
        </p>
      </div>
      
      <PersonaFilterManager />
    </Card>
  );
};