import { TestResults } from "../types/test-results";

export interface TestStepProps {
  isAnalyzing: boolean;
  onTest: () => void;
  testResults: TestResults;
  previousResults?: TestResults;
  iterationCount: number;
}