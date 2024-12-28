import { Prospect } from '@/services/ProspectService';
import { ProspectCard } from './ProspectCard';

interface ProspectListContentProps {
  prospects: Prospect[];
  isLoading: boolean;
  onScheduleMeeting: (prospectId: string) => void;
  onGenerateStrategy: (prospect: Prospect) => void;
  isGeneratingStrategy: boolean;
  getQualificationColor: (qualification: string) => string;
}

export const ProspectListContent = ({
  prospects,
  isLoading,
  onScheduleMeeting,
  onGenerateStrategy,
  isGeneratingStrategy,
  getQualificationColor
}: ProspectListContentProps) => {
  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      {prospects.map((prospect) => (
        <ProspectCard
          key={prospect.id}
          prospect={prospect}
          onScheduleMeeting={onScheduleMeeting}
          onGenerateStrategy={onGenerateStrategy}
          isGeneratingStrategy={isGeneratingStrategy}
          getQualificationColor={getQualificationColor}
        />
      ))}
    </div>
  );
};