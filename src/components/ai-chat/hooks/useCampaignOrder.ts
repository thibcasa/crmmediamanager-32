import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { CampaignOrder } from '../types/campaign-order';
import { CampaignOrderService } from '../services/CampaignOrderService';

export const useCampaignOrder = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const createCampaign = async (order: CampaignOrder) => {
    setIsProcessing(true);
    try {
      const result = await CampaignOrderService.createCampaignFromOrder(order);
      
      toast({
        title: "Campagne créée avec succès",
        description: "Le workflow et le pipeline ont été configurés.",
      });

      return result;
    } catch (error) {
      console.error('Error in useCampaignOrder:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la campagne",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const updateMetrics = async (campaignId: string, metrics: any) => {
    try {
      return await CampaignOrderService.updateCampaignMetrics(campaignId, metrics);
    } catch (error) {
      console.error('Error updating metrics:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les métriques",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    createCampaign,
    updateMetrics,
    isProcessing
  };
};