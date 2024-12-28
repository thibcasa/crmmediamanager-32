import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { TestStep } from "./TestStep";
import { PredictionStep } from "./PredictionStep";
import { CorrectionStep } from "./CorrectionStep";
import { ProductionStep } from "./ProductionStep";
import { useWorkflowState } from "./hooks/useWorkflowState";
import { useWorkflowActions } from "./hooks/useWorkflowActions";
import { CampaignOverview } from "../campaign-workflow/CampaignOverview";

export const TestWorkflow = ({ messageToTest }: { messageToTest?: string }) => {
  const { toast } = useToast();
  const { state, actions } = useWorkflowState(messageToTest);
  const [activeTab, setActiveTab] = useState("overview");

  const handlePrediction = async () => {
    try {
      await actions.handlePrediction();
      toast({
        title: "Analyse prédictive terminée",
        description: "Les résultats sont disponibles"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer la prédiction",
        variant: "destructive"
      });
    }
  };

  const handleRecommendationClick = (recommendation: string) => {
    if (messageToTest) {
      const updatedMessage = `${messageToTest}\n\nAméliorations appliquées:\n- ${recommendation}`;
      actions.setMessageToTest(updatedMessage);
      toast({
        title: "Prompt mis à jour",
        description: "Le message a été modifié selon la recommandation"
      });
      // Lancer automatiquement une nouvelle prédiction
      handlePrediction();
    }
  };

  return (
    <div className="space-y-8">
      <CampaignOverview
        creatives={state.creatives || []}
        content={state.content || []}
        onPredictionClick={handlePrediction}
        onRecommendationClick={handleRecommendationClick}
        recommendations={[
          ...(state.currentTestResults.recommendations || []),
          ...(state.currentTestResults.risks || []),
          ...(state.currentTestResults.opportunities || [])
        ]}
      />

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="prediction">Prédiction</TabsTrigger>
          <TabsTrigger value="correction">Correction</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <TestStep
            isAnalyzing={state.isAnalyzing}
            onTest={actions.handleTest}
            testResults={state.currentTestResults}
            previousResults={state.testHistory[state.testHistory.length - 2]}
            iterationCount={state.iterationCount}
          />
        </TabsContent>

        <TabsContent value="prediction">
          <PredictionStep
            isAnalyzing={state.isAnalyzing}
            progress={state.progress}
            testResults={state.currentTestResults}
            onAnalyze={handlePrediction}
            messageToTest={messageToTest}
            iterationCount={state.iterationCount}
          />
        </TabsContent>

        <TabsContent value="correction">
          <CorrectionStep
            validationErrors={state.validationErrors}
            onCorrection={actions.handleCorrection}
            testResults={state.currentTestResults}
            onRecommendationClick={handleRecommendationClick}
          />
        </TabsContent>

        <TabsContent value="production">
          <ProductionStep
            onDeploy={actions.handleProduction}
            testResults={state.currentTestResults}
            iterationHistory={state.testHistory}
            canProceed={state.readyForProduction}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};