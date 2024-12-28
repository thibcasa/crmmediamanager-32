import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/lib/supabaseClient';

interface PersonaSelectorProps {
  selectedPersonaId: string | null;
  onPersonaSelect: (id: string) => void;
}

export const PersonaSelector = ({ selectedPersonaId, onPersonaSelect }: PersonaSelectorProps) => {
  const [personas, setPersonas] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    const fetchPersonas = async () => {
      const { data, error } = await supabase
        .from('personas')
        .select('id, name');
      
      if (error) {
        console.error('Error fetching personas:', error);
        return;
      }

      setPersonas(data || []);
    };

    fetchPersonas();
  }, []);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Persona cible</label>
      <Select value={selectedPersonaId || ''} onValueChange={onPersonaSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionnez un persona" />
        </SelectTrigger>
        <SelectContent>
          {personas.map((persona) => (
            <SelectItem key={persona.id} value={persona.id}>
              {persona.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};