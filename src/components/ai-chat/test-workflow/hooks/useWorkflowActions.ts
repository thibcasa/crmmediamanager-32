import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { TestResults, WorkflowPhase } from '../types/test-results';

export const useWorkflowActions = (
  setState: React.Dispatch<React.SetStateAction<any>>,
  state: any,
  messageToTest?: string
) => {
  const { toast } = useToast();

  const updateProgress = (phase: number) => {
    setState(prev => ({ ...prev, progress: phase * 25 }));
  };

  const handleTest = async () => {
    if (!messageToTest) {
      toast({
        title: "Erreur",
        description: "Veuillez d'abord envoyer un message dans le chat",
        variant: "destructive"
      });
      return;
    }

    setState(prev => ({ ...prev, isAnalyzing: true, validationErrors: [] }));
    
    try {
      updateProgress(1);
      
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke(
        'campaign-analyzer',
        {
          body: { message: messageToTest }
        }
      );

      if (analysisError) throw analysisError;

      updateProgress(2);

      const iterationMultiplier = 1 + (state.iterationCount * 0.15);
      const results: TestResults = {
        engagement: Math.min(0.85 * iterationMultiplier, 1),
        clickRate: Math.min(0.125 * iterationMultiplier, 0.3),
        conversionRate: Math.min(0.032 * iterationMultiplier, 0.1),
        cpa: Math.max(15 / iterationMultiplier, 8),
        roi: Math.min(2.5 * iterationMultiplier, 5),
        recommendations: [
          "Optimisez le ciblage géographique",
          "Précisez le type de bien immobilier",
          "Ajoutez des témoignages clients"
        ],
        risks: [
          "Coût par acquisition à surveiller",
          "Ciblage à affiner"
        ],
        opportunities: [
          "Fort potentiel d'engagement",
          "Zone géographique attractive"
        ],
        audienceInsights: {
          segments: [
            { name: "Propriétaires 45-65 ans", score: 0.85, potential: 0.92 },
            { name: "Investisseurs", score: 0.75, potential: 0.88 },
            { name: "Résidents locaux", score: 0.65, potential: 0.78 }
          ],
          demographics: {
            age: ["45-54", "55-65"],
            location: ["Nice", "Cannes", "Antibes"],
            interests: ["Immobilier", "Investissement", "Luxe"]
          }
        },
        predictedMetrics: {
          leadsPerWeek: 12,
          costPerLead: 45,
          totalBudget: 2000,
          revenueProjection: 15000
        },
        campaignDetails: {
          creatives: [
            { type: "image", content: "Vue mer panoramique", performance: 0.88 },
            { type: "video", content: "Visite virtuelle", performance: 0.92 },
            { type: "text", content: "Description détaillée", performance: 0.75 }
          ],
          content: {
            messages: [
              "Valorisez votre bien immobilier sur la Côte d'Azur",
              "Expertise locale pour une vente optimale"
            ],
            headlines: [
              "Estimation gratuite de votre propriété",
              "Vendez au meilleur prix"
            ],
            callsToAction: [
              "Demandez une estimation",
              "Contactez un expert"
            ]
          },
          workflow: {
            steps: [
              { name: "Analyse du marché", status: "completed" },
              { name: "Création des visuels", status: "in_progress" },
              { name: "Lancement campagne", status: "pending" }
            ]
          }
        }
      };

      setState(prev => ({
        ...prev,
        currentTestResults: results,
        testHistory: [...prev.testHistory, results],
        iterationCount: prev.iterationCount + 1,
        testStatus: 'success'
      }));

      updateProgress(4);
      return results;
    } catch (error) {
      console.error('Error in test workflow:', error);
      setState(prev => ({ ...prev, testStatus: 'warning' }));
      toast({
        title: "Erreur",
        description: "Une erreur est survenue pendant l'analyse",
        variant: "destructive"
      });
    } finally {
      setState(prev => ({ ...prev, isAnalyzing: false }));
      updateProgress(100);
    }
  };

  const handleCorrection = () => {
    setState(prev => ({ ...prev, activePhase: 'correction' }));
    toast({
      title: "Correction en cours",
      description: "Application des recommandations...",
    });
  };

  const handleProduction = () => {
    if (state.currentTestResults.roi < 2 || state.currentTestResults.engagement < 0.6) {
      toast({
        title: "Attention",
        description: "Les performances ne sont pas encore optimales. Continuez les itérations.",
        variant: "destructive"
      });
      return;
    }
    setState(prev => ({ ...prev, activePhase: 'production' }));
    toast({
      title: "Mise en production",
      description: "Déploiement de la campagne optimisée...",
    });
  };

  const setActivePhase = (phase: WorkflowPhase) => {
    setState(prev => ({ ...prev, activePhase: phase }));
  };

  return {
    handleTest,
    handleCorrection,
    handleProduction,
    setActivePhase
  };
};