import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from '@/lib/supabaseClient';

interface Location {
  id: string;
  city: string;
  postal_code: string;
}

interface CampaignTargetingProps {
  selectedLocations: string[];
  onLocationsChange: (locations: string[]) => void;
  targetingCriteria: any;
  onTargetingChange: (criteria: any) => void;
}

export const CampaignTargeting = ({
  selectedLocations,
  onLocationsChange,
  targetingCriteria,
  onTargetingChange
}: CampaignTargetingProps) => {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const { data, error } = await supabase
        .from('target_locations')
        .select('id, city, postal_code');
      
      if (error) {
        console.error('Error fetching locations:', error);
        return;
      }

      setLocations(data || []);
    };

    fetchLocations();
  }, []);

  const handleLocationToggle = (locationId: string) => {
    const newLocations = selectedLocations.includes(locationId)
      ? selectedLocations.filter(id => id !== locationId)
      : [...selectedLocations, locationId];
    
    onLocationsChange(newLocations);
  };

  return (
    <Card className="p-4 space-y-4">
      <h3 className="font-medium">Zones géographiques ciblées</h3>
      <div className="grid grid-cols-2 gap-2">
        {locations.map((location) => (
          <div key={location.id} className="flex items-center space-x-2">
            <Checkbox
              id={location.id}
              checked={selectedLocations.includes(location.id)}
              onCheckedChange={() => handleLocationToggle(location.id)}
            />
            <label htmlFor={location.id} className="text-sm">
              {location.city} ({location.postal_code})
            </label>
          </div>
        ))}
      </div>
    </Card>
  );
};