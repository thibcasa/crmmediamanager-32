import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Platform } from '@/services/SocialCampaignService';
import { Facebook, Instagram, Linkedin, MessageCircle } from 'lucide-react';

interface SocialPlatformSelectorProps {
  platform: Platform;
  onPlatformChange: (platform: Platform) => void;
}

export const SocialPlatformSelector = ({ platform, onPlatformChange }: SocialPlatformSelectorProps) => {
  return (
    <Card className="p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Plateforme</label>
        <Select value={platform} onValueChange={onPlatformChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une plateforme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="linkedin">
              <div className="flex items-center gap-2">
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </div>
            </SelectItem>
            <SelectItem value="whatsapp">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </div>
            </SelectItem>
            <SelectItem value="facebook">
              <div className="flex items-center gap-2">
                <Facebook className="w-4 h-4" />
                Facebook
              </div>
            </SelectItem>
            <SelectItem value="instagram">
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4" />
                Instagram
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};