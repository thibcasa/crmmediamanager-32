import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';
import { MapPin, Loader2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Location {
  id: string;
  city: string;
  postal_code: string;
  department: string;
  region: string;
}

interface LocationSelectorProps {
  selectedLocations: string[];
  onLocationChange: (locations: string[]) => void;
}

export const LocationSelector = ({ selectedLocations, onLocationChange }: LocationSelectorProps) => {
  const { toast } = useToast();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCount, setSelectedCount] = useState(0);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>("");

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
          setSelectedCount(selectedLocations.length);
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
      setSelectedCount(0);
      setIsAllSelected(false);
    } else {
      const allLocationIds = locations.map(loc => loc.id);
      onLocationChange(allLocationIds);
      setSelectedCount(locations.length);
      setIsAllSelected(true);
    }
  };

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    const location = locations.find(loc => loc.city === cityName);
    if (location) {
      const isLocationSelected = selectedLocations.includes(location.id);
      let newLocations: string[];
      
      if (isLocationSelected) {
        // Si la ville est déjà sélectionnée, on la retire
        newLocations = selectedLocations.filter(id => id !== location.id);
      } else {
        // Si la ville n'est pas sélectionnée, on l'ajoute
        newLocations = [...selectedLocations, location.id];
      }
      
      onLocationChange(newLocations);
      const newCount = newLocations.length;
      setSelectedCount(newCount);
      setIsAllSelected(newCount === locations.length);
    }
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
          {selectedCount} zone{selectedCount > 1 ? 's' : ''} sélectionnée{selectedCount > 1 ? 's' : ''}
        </Badge>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Sélectionnez les zones des Alpes-Maritimes où vous souhaitez diffuser vos campagnes
      </p>

      <div className="space-y-4 mb-6">
        <Select value={selectedCity} onValueChange={handleCitySelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionnez une ville..." />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem 
                key={location.id} 
                value={location.city}
              >
                {location.city} ({location.postal_code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="flex items-center space-x-2 bg-accent/50 p-2 rounded-md">
          <Checkbox 
            id="select-all"
            checked={isAllSelected}
            onCheckedChange={handleSelectAll}
          />
          <label
            htmlFor="select-all"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {isAllSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
          </label>
        </div>
      </div>

      {locations.length === 0 ? (
        <div className="text-center py-4 bg-muted/50 rounded-lg">
          Aucune zone disponible
        </div>
      ) : (
        <ScrollArea className="h-[400px] rounded-md border p-4">
          <div className="space-y-2">
            {locations.map((location) => (
              <div
                key={location.id}
                className="flex items-start space-x-3 p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <Checkbox
                  id={location.id}
                  checked={selectedLocations.includes(location.id)}
                  onCheckedChange={(checked) => {
                    const newLocations = checked
                      ? [...selectedLocations, location.id]
                      : selectedLocations.filter(id => id !== location.id);
                    onLocationChange(newLocations);
                    const newCount = checked ? selectedCount + 1 : selectedCount - 1;
                    setSelectedCount(newCount);
                    setIsAllSelected(newCount === locations.length);
                  }}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor={location.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {location.city}
                  </label>
                  <p className="text-sm text-muted-foreground">
                    {location.postal_code}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </Card>
  );
};