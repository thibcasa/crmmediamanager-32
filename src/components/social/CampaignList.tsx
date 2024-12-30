import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SocialCampaign } from "@/types/social";
import { Facebook, Instagram, Linkedin, Twitter, MessageSquare, FileText, RefreshCw } from 'lucide-react';
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CampaignListProps {
  campaigns: SocialCampaign[];
  onSelectCampaign: (campaign: SocialCampaign) => void;
  onUpdate: (campaign: SocialCampaign) => void;
}

export const CampaignList = ({ campaigns, onSelectCampaign, onUpdate }: CampaignListProps) => {
  const [selectedCampaign, setSelectedCampaign] = useState<SocialCampaign | null>(null);

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

  const getStatusBadge = (status: string) => {
    const statusColors = {
      active: "bg-green-500",
      pending: "bg-yellow-500",
      completed: "bg-blue-500",
      draft: "bg-gray-500"
    };

    return (
      <Badge className={`${statusColors[status as keyof typeof statusColors]} text-white`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const generateReport = async (campaign: SocialCampaign) => {
    // Implementation for report generation would go here
    console.log("Generating report for campaign:", campaign.id);
  };

  return (
    <div className="space-y-4">
      {campaigns.map((campaign) => (
        <Card
          key={campaign.id}
          className="p-4 hover:bg-accent/50 transition-colors relative group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                {getPlatformIcon(campaign.platform)}
              </div>
              <div className="flex-1">
                <h3 className="font-medium group-hover:text-primary transition-colors">
                  {campaign.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusBadge(campaign.status || 'draft')}
                  <span className="text-sm text-muted-foreground">
                    Créée le {new Date(campaign.created_at || '').toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateReport(campaign)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Rapport
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectCampaign(campaign)}
              >
                Voir détails
              </Button>
            </div>
          </div>

          {campaign.ai_feedback && (
            <div className="mt-4 p-3 bg-primary/5 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Retour IA :</h4>
              <div className="text-sm text-muted-foreground">
                {campaign.ai_feedback.suggestions?.map((suggestion, index) => (
                  <p key={index} className="mb-1">• {suggestion}</p>
                ))}
              </div>
            </div>
          )}

          {campaign.target_metrics && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Engagement</p>
                <p className="text-lg font-medium">
                  {(campaign.target_metrics.engagement_rate || 0) * 100}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Conversion</p>
                <p className="text-lg font-medium">
                  {(campaign.target_metrics.conversion_rate || 0) * 100}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">ROI</p>
                <p className="text-lg font-medium">
                  {campaign.target_metrics.roi || 0}x
                </p>
              </div>
            </div>
          )}
        </Card>
      ))}

      {campaigns.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Aucune campagne trouvée</p>
        </div>
      )}

      <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Détails de la campagne</DialogTitle>
          </DialogHeader>
          {selectedCampaign && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">{selectedCampaign.name}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Plateforme</p>
                    <p className="font-medium">{selectedCampaign.platform}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Statut</p>
                    <div className="mt-1">
                      {getStatusBadge(selectedCampaign.status || 'draft')}
                    </div>
                  </div>
                </div>
              </div>

              {selectedCampaign.content_strategy && (
                <div>
                  <h4 className="font-medium mb-2">Stratégie de contenu</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Types de posts</p>
                      <ul className="list-disc list-inside">
                        {selectedCampaign.content_strategy.post_types.map((type, index) => (
                          <li key={index} className="text-sm">{type}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fréquence</p>
                      <p className="text-sm">{selectedCampaign.content_strategy.posting_frequency}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => generateReport(selectedCampaign)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Générer rapport
                </Button>
                <Button
                  onClick={() => {
                    onSelectCampaign(selectedCampaign);
                    setSelectedCampaign(null);
                  }}
                >
                  Voir analyse complète
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};