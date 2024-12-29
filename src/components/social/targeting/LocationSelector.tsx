import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { MapPin, Loader2, Search } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { LocationList } from './components/LocationList';
import { Location } from './types';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

interface LocationSelectorProps {
  selectedLocations: string[];
  onLocationChange: (locations: string[]) => void;
}

export const LocationSelector = ({ selectedLocations, onLocationChange }: LocationSelectorProps) => {
  const { toast } = useToast();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    postalCode: '',
    city: '',
  });

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Non authentifié');

        let query = supabase
          .from('target_locations')
          .select('*')
          .eq('department', 'Alpes-Maritimes');

        if (filters.city) {
          query = query.ilike('city', `%${filters.city}%`);
        }

        if (filters.postalCode) {
          query = query.ilike('postal_code', `%${filters.postalCode}%`);
        }

        const { data, error } = await query;

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
  }, [toast, filters]);

  const handleLocationToggle = (locationId: string, checked: boolean) => {
    const newLocations = checked
      ? [...selectedLocations, locationId]
      : selectedLocations.filter(id => id !== locationId);
    
    onLocationChange(newLocations);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.match(/^\d/)) {
      setFilters(prev => ({ ...prev, postalCode: value, city: '' }));
    } else {
      setFilters(prev => ({ ...prev, city: value, postalCode: '' }));
    }
  };

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

        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une ville ou un code postal..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        <ScrollArea className="h-[300px] rounded-md border">
          <div className="p-4 space-y-4">
            {locations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucune ville trouvée
              </div>
            ) : (
              locations.map((location) => (
                <div
                  key={location.id}
                  className="flex items-center space-x-3 hover:bg-accent rounded-lg p-2 transition-colors"
                >
                  <Checkbox
                    id={location.id}
                    checked={selectedLocations.includes(location.id)}
                    onCheckedChange={(checked) => handleLocationToggle(location.id, checked as boolean)}
                  />
                  <label
                    htmlFor={location.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                  >
                    {location.city} ({location.postal_code})
                  </label>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};