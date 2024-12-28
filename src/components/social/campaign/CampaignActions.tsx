import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { SocialCampaignService } from '@/services/SocialCampaignService';
import { Copy, Pause, Play, Trash2, Wand2 } from "lucide-react";
import { useState } from "react";

interface CampaignActionsProps {
  campaignId: string;
  status: string;
  onUpdate: () => void;
}

export const CampaignActions = ({ campaignId, status, onUpdate }: CampaignActionsProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleDuplicate = async () => {
    try {
      setIsLoading(true);
      await SocialCampaignService.duplicateCampaign(campaignId);
      toast({
        title: "Succès",
        description: "La campagne a été dupliquée"
      });
      onUpdate();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de dupliquer la campagne",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await SocialCampaignService.deleteCampaign(campaignId);
      toast({
        title: "Succès",
        description: "La campagne a été supprimée"
      });
      onUpdate();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la campagne",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePause = async () => {
    try {
      setIsLoading(true);
      const newStatus = status === 'active' ? 'paused' : 'active';
      await SocialCampaignService.updateCampaign(campaignId, { status: newStatus });
      toast({
        title: "Succès",
        description: `La campagne a été ${newStatus === 'active' ? 'activée' : 'mise en pause'}`
      });
      onUpdate();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut de la campagne",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptimize = async () => {
    try {
      setIsLoading(true);
      await SocialCampaignService.optimizeCampaign(campaignId);
      toast({
        title: "Succès",
        description: "La campagne a été optimisée par l'IA"
      });
      onUpdate();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'optimiser la campagne",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleDuplicate}
        disabled={isLoading}
      >
        <Copy className="h-4 w-4 mr-2" />
        Dupliquer
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleTogglePause}
        disabled={isLoading}
      >
        {status === 'active' ? (
          <Pause className="h-4 w-4 mr-2" />
        ) : (
          <Play className="h-4 w-4 mr-2" />
        )}
        {status === 'active' ? 'Pause' : 'Activer'}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleOptimize}
        disabled={isLoading}
      >
        <Wand2 className="h-4 w-4 mr-2" />
        Optimiser (IA)
      </Button>

      <Button
        variant="destructive"
        size="sm"
        onClick={handleDelete}
        disabled={isLoading}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Supprimer
      </Button>
    </div>
  );
};