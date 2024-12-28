import { TestResults } from "../types/test-results";

export interface PredictionStepProps {
  isAnalyzing: boolean;
  progress: number;
  testResults: TestResults;
  onAnalyze: () => Promise<TestResults>;
  messageToTest?: string;
  iterationCount: number;
}