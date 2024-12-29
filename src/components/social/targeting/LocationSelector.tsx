import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabaseClient';
import { MapPin, Loader2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { LocationList } from './components/LocationList';
import { Location } from './types';
import { Input } from "@/components/ui/input";

interface LocationSelectorProps {
  selectedLocations: string[];
  onLocationChange: (locations: string[]) => void;
}

export const LocationSelector = ({ selectedLocations, onLocationChange }: LocationSelectorProps) => {
  const { toast } = useToast();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Non authentifié');

        const { data, error } = await supabase
          .from('target_locations')
          .select('*')
          .eq('department', 'Alpes-Maritimes');

        if (error) throw error;
        
        if (data) {
          console.log('Locations fetched:', data.length);
          setLocations(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des locations:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les villes",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [toast]);

  const handleLocationToggle = (locationId: string, checked: boolean) => {
    const newLocations = checked
      ? [...selectedLocations, locationId]
      : selectedLocations.filter(id => id !== locationId);
    
    onLocationChange(newLocations);
  };

  const filteredLocations = locations.filter(location =>
    location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.postal_code.includes(searchTerm)
  );

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p>Chargement des villes...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Villes des Alpes-Maritimes</h3>
          </div>
          <Badge variant="secondary">
            {selectedLocations.length} ville{selectedLocations.length > 1 ? 's' : ''} sélectionnée{selectedLocations.length > 1 ? 's' : ''}
          </Badge>
        </div>

        <Input
          placeholder="Rechercher une ville..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />

        <LocationList
          locations={filteredLocations}
          selectedLocations={selectedLocations}
          onLocationToggle={handleLocationToggle}
        />
      </div>
    </Card>
  );
};