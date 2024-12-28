import { Card } from "@/components/ui/card";
import { LocationSelector } from '../targeting/LocationSelector';
import { MultiChannelSelector } from '../targeting/MultiChannelSelector';
import { SocialPlatform } from '@/types/social';

interface CampaignTargetingProps {
  selectedLocations: string[];
  onLocationsChange: (locations: string[]) => void;
  selectedPlatforms: SocialPlatform[];
  onPlatformsChange: (platforms: SocialPlatform[]) => void;
  targetingCriteria: any;
  onTargetingChange: (criteria: any) => void;
}

export const CampaignTargeting = ({
  selectedLocations,
  onLocationsChange,
  selectedPlatforms,
  onPlatformsChange,
  targetingCriteria,
  onTargetingChange
}: CampaignTargetingProps) => {
  return (
    <div className="space-y-6">
      <LocationSelector
        selectedLocations={selectedLocations}
        onLocationChange={onLocationsChange}
      />
      
      <MultiChannelSelector
        selectedPlatforms={selectedPlatforms}
        onPlatformsChange={onPlatformsChange}
      />
      
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Critères de ciblage</h3>
        <div className="space-y-4">
          {/* Additional targeting criteria UI here */}
        </div>
      </Card>
    </div>
  );
};
