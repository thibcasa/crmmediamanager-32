import { TestResults } from "./test-results";

export interface CorrectionStepProps {
  validationErrors: string[];
  onApplyCorrections: () => void;
  testResults: TestResults;
  previousResults?: TestResults;
}