import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Location } from "../types";

interface CitySelectProps {
  locations: Location[];
  onCitySelect: (cityId: string) => void;
  selectedLocations: string[];
}

export const CitySelect = ({ locations, onCitySelect, selectedLocations }: CitySelectProps) => {
  return (
    <Select onValueChange={onCitySelect}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Sélectionnez une ville..." />
      </SelectTrigger>
      <SelectContent>
        {locations.map((location) => (
          <SelectItem 
            key={location.id} 
            value={location.id}
          >
            {location.city} ({location.postal_code})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};