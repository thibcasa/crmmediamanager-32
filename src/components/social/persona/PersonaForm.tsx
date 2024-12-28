import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';

interface PersonaFormProps {
  onSuccess?: () => void;
}

export const PersonaForm = ({ onSuccess }: PersonaFormProps) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [ageMin, setAgeMin] = useState('35');
  const [ageMax, setAgeMax] = useState('65');
  const [interests, setInterests] = useState(['Immobilier', 'Investissement']);
  const [jobTitles, setJobTitles] = useState(['Cadre', 'Chef d\'entreprise', 'Profession libérale']);
  const [propertyTypes, setPropertyTypes] = useState(['Appartement', 'Villa', 'Maison']);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('personas')
        .insert({
          name,
          age_range: { min: parseInt(ageMin), max: parseInt(ageMax) },
          interests,
          job_titles: jobTitles,
          property_types: propertyTypes,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Persona créé",
        description: "Le persona a été créé avec succès"
      });

      onSuccess?.();
    } catch (error) {
      console.error('Erreur lors de la création du persona:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le persona",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nom du persona</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Propriétaire investisseur"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ageMin">Âge minimum</Label>
              <Input
                id="ageMin"
                type="number"
                value={ageMin}
                onChange={(e) => setAgeMin(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="ageMax">Âge maximum</Label>
              <Input
                id="ageMax"
                type="number"
                value={ageMax}
                onChange={(e) => setAgeMax(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Centres d'intérêt</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['Immobilier', 'Investissement', 'Finance', 'Luxe', 'Art de vivre', 'Technologie'].map((interest) => (
                <div
                  key={interest}
                  className={`p-2 border rounded cursor-pointer ${
                    interests.includes(interest) 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => {
                    setInterests(prev =>
                      prev.includes(interest)
                        ? prev.filter(i => i !== interest)
                        : [...prev, interest]
                    );
                  }}
                >
                  {interest}
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Professions</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {[
                'Cadre', 
                'Chef d\'entreprise', 
                'Profession libérale',
                'Investisseur',
                'Retraité',
                'Commerçant'
              ].map((job) => (
                <div
                  key={job}
                  className={`p-2 border rounded cursor-pointer ${
                    jobTitles.includes(job) 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => {
                    setJobTitles(prev =>
                      prev.includes(job)
                        ? prev.filter(j => j !== job)
                        : [...prev, job]
                    );
                  }}
                >
                  {job}
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Types de biens</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {[
                'Appartement',
                'Villa',
                'Maison',
                'Terrain',
                'Local commercial',
                'Immeuble'
              ].map((type) => (
                <div
                  key={type}
                  className={`p-2 border rounded cursor-pointer ${
                    propertyTypes.includes(type) 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => {
                    setPropertyTypes(prev =>
                      prev.includes(type)
                        ? prev.filter(t => t !== type)
                        : [...prev, type]
                    );
                  }}
                >
                  {type}
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full">
          Créer le persona
        </Button>
      </form>
    </Card>
  );
};