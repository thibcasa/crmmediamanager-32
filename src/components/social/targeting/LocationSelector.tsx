import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';
import { MapPin, Loader2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { CitySelect } from './components/CitySelect';
import { SelectAllCheckbox } from './components/SelectAllCheckbox';
import { LocationList } from './components/LocationList';
import { Location } from './types';

interface LocationSelectorProps {
  selectedLocations: string[];
  onLocationChange: (locations: string[]) => void;
}

export const LocationSelector = ({ selectedLocations, onLocationChange }: LocationSelectorProps) => {
  const { toast } = useToast();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAllSelected, setIsAllSelected] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase
          .from('target_locations')
          .select('*')
          .eq('department', 'Alpes-Maritimes')
          .order('city');

        if (error) throw error;
        
        if (data) {
          console.log('Locations fetched:', data.length);
          setLocations(data);
          setIsAllSelected(data.length > 0 && selectedLocations.length === data.length);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des locations:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les zones géographiques",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [toast, selectedLocations.length]);

  const handleSelectAll = () => {
    if (isAllSelected) {
      onLocationChange([]);
      setIsAllSelected(false);
    } else {
      const allLocationIds = locations.map(loc => loc.id);
      onLocationChange(allLocationIds);
      setIsAllSelected(true);
    }
  };

  const handleCitySelect = (locationId: string) => {
    const newLocations = selectedLocations.includes(locationId)
      ? selectedLocations.filter(id => id !== locationId)
      : [...selectedLocations, locationId];
    
    onLocationChange(newLocations);
    setIsAllSelected(newLocations.length === locations.length);
  };

  const handleLocationToggle = (locationId: string, checked: boolean) => {
    const newLocations = checked
      ? [...selectedLocations, locationId]
      : selectedLocations.filter(id => id !== locationId);
    
    onLocationChange(newLocations);
    setIsAllSelected(newLocations.length === locations.length);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p>Chargement des zones...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-2 border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <Label className="text-lg font-medium">Zones des Alpes-Maritimes</Label>
        </div>
        <Badge variant="secondary" className="text-sm">
          {selectedLocations.length} zone{selectedLocations.length > 1 ? 's' : ''} sélectionnée{selectedLocations.length > 1 ? 's' : ''}
        </Badge>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Sélectionnez les zones des Alpes-Maritimes où vous souhaitez diffuser vos campagnes
      </p>

      <div className="space-y-4 mb-6">
        <CitySelect
          locations={locations}
          onCitySelect={handleCitySelect}
          selectedLocations={selectedLocations}
        />
        
        <SelectAllCheckbox
          isAllSelected={isAllSelected}
          onSelectAll={handleSelectAll}
        />
      </div>

      {locations.length === 0 ? (
        <div className="text-center py-4 bg-muted/50 rounded-lg">
          Aucune zone disponible
        </div>
      ) : (
        <LocationList
          locations={locations}
          selectedLocations={selectedLocations}
          onLocationToggle={handleLocationToggle}
        />
      )}
    </Card>
  );
};