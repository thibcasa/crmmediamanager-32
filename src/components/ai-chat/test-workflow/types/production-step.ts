import { TestResults } from "./test-results";

export interface ProductionStepProps {
  onDeploy: () => void;
  testResults: TestResults;
  iterationHistory: TestResults[];
  canProceed: boolean;
}