import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SocialCampaign } from "@/types/social";
import { Facebook, Instagram, Linkedin, Twitter, MessageSquare, Pause, Play, Copy, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface CampaignListProps {
  campaigns: SocialCampaign[];
  onSelectCampaign: (campaign: SocialCampaign) => void;
  onUpdate: (campaign: SocialCampaign) => void;
}

export const CampaignList = ({ campaigns, onSelectCampaign, onUpdate }: CampaignListProps) => {
  const { toast } = useToast();

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5" />;
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      case 'whatsapp':
        return <MessageSquare className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const handleStatusToggle = (campaign: SocialCampaign) => {
    const newStatus = campaign.status === 'active' ? 'paused' : 'active';
    onUpdate({ ...campaign, status: newStatus });
  };

  const handleDuplicate = (campaign: SocialCampaign) => {
    const duplicatedCampaign = {
      ...campaign,
      id: undefined,
      name: `${campaign.name} (copie)`,
      status: 'draft'
    };
    onUpdate(duplicatedCampaign);
  };

  const handleDelete = async (campaign: SocialCampaign) => {
    try {
      onUpdate({ ...campaign, status: 'deleted' });
      toast({
        title: "Succès",
        description: "La campagne a été supprimée"
      });
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la campagne",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      {campaigns.map((campaign) => (
        <Card
          key={campaign.id}
          className="p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onSelectCampaign(campaign)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {getPlatformIcon(campaign.platform)}
              <div>
                <h3 className="font-medium">{campaign.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Créée le {new Date(campaign.created_at || '').toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusToggle(campaign);
                }}
              >
                {campaign.status === 'active' ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDuplicate(campaign);
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(campaign);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};