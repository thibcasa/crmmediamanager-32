import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';
import { MapPin, Search } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [propertyType, setPropertyType] = useState<string>('all');

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase
          .from('target_locations')
          .select('*')
          .order('city');

        if (error) throw error;
        setLocations(data);
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
  }, [toast]);

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.postal_code.includes(searchTerm) ||
                         location.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    return true;
  });

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-primary" />
          <Label className="text-lg font-medium">Zones géographiques ciblées</Label>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Sélectionnez les zones que vous souhaitez cibler pour votre campagne
        </p>

        <div className="space-y-4 mb-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une ville, un code postal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Gamme de prix</Label>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une gamme de prix" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les prix</SelectItem>
                  <SelectItem value="luxury">Luxe (&gt; 1M€)</SelectItem>
                  <SelectItem value="high">Haut de gamme (500K€ - 1M€)</SelectItem>
                  <SelectItem value="medium">Moyen (300K€ - 500K€)</SelectItem>
                  <SelectItem value="entry">Premier achat (&lt; 300K€)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Type de bien</Label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type de bien" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="apartment">Appartement</SelectItem>
                  <SelectItem value="house">Maison</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="land">Terrain</SelectItem>
                  <SelectItem value="commercial">Local commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-4">Chargement des zones...</div>
        ) : (
          <ScrollArea className="h-[300px] rounded-md border p-4">
            <div className="space-y-2">
              {filteredLocations.map((location) => (
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
                      {location.postal_code} - {location.department}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};