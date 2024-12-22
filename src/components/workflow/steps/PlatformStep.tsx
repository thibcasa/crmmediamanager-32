import { Button } from "@/components/ui/button";
import { LinkedinIcon, InstagramIcon, Target } from "lucide-react";
import { Platform } from "@/services/SocialCampaignService";

interface PlatformStepProps {
  onPlatformSelect: (platform: Platform) => void;
}

export const PlatformStep = ({ onPlatformSelect }: PlatformStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-sage-800">Choisir la plateforme de diffusion</h3>
        <p className="text-sm text-sage-600">Sélectionnez la plateforme la plus adaptée à votre audience</p>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <Button 
          variant="outline" 
          onClick={() => onPlatformSelect('linkedin')}
          className="h-32 flex flex-col items-center justify-center gap-3 hover:bg-sage-50 hover:border-sage-500 transition-all"
        >
          <LinkedinIcon className="w-8 h-8 text-sage-600" />
          <div className="text-center">
            <div className="font-medium mb-1">LinkedIn</div>
            <div className="text-sm text-sage-600">Prospection B2B ciblée</div>
          </div>
        </Button>
        <Button 
          variant="outline" 
          onClick={() => onPlatformSelect('instagram')}
          className="h-32 flex flex-col items-center justify-center gap-3 hover:bg-sage-50 hover:border-sage-500 transition-all"
        >
          <InstagramIcon className="w-8 h-8 text-sage-600" />
          <div className="text-center">
            <div className="font-medium mb-1">Instagram</div>
            <div className="text-sm text-sage-600">Visibilité locale maximale</div>
          </div>
        </Button>
      </div>
    </div>
  );
};