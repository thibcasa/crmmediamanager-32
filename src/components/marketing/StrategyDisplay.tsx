import { Card } from "@/components/ui/card";
import { MarketingStrategy } from "@/types/marketing";

interface StrategyDisplayProps {
  strategy: MarketingStrategy | null;
}

export const StrategyDisplay = ({ strategy }: StrategyDisplayProps) => {
  if (!strategy) return null;

  return (
    <Card className="p-4 mt-4">
      <h3 className="text-lg font-semibold mb-2">Stratégie Marketing</h3>
      <div className="space-y-2">
        {strategy.objective && (
          <div>
            <h4 className="font-medium">Objectif</h4>
            <p>{strategy.objective.target} mandats en {strategy.objective.timeline}</p>
          </div>
        )}
        
        {strategy.approach && strategy.approach.keyMessages && (
          <div>
            <h4 className="font-medium">Approche</h4>
            <ul className="list-disc pl-4">
              {strategy.approach.keyMessages.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          </div>
        )}
        
        {strategy.actionPlan && strategy.actionPlan.steps && (
          <div>
            <h4 className="font-medium">Plan d'action</h4>
            <ul className="list-disc pl-4">
              {strategy.actionPlan.steps.map((step, index) => (
                <li key={index}>{step.description}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};