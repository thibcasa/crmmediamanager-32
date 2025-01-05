export type GoalType = 'mandate_generation' | 'lead_generation' | 'brand_awareness' | 'sales' | 'custom';

export interface CampaignObjective {
  objective: string;
  goalType: GoalType;
  platform: string;
  mandateGoal?: number;
  frequency?: 'daily' | 'weekly' | 'monthly';
  customMetrics?: {
    [key: string]: number;
  };
}
