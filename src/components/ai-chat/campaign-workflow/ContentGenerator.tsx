import { Card } from "@/components/ui/card";
import { CampaignData } from '../types/campaign';
import { useContentGeneration } from './hooks/useContentGeneration';
import { ContentForm } from './content-generator/ContentForm';
import { ContentDisplay } from './content-generator/ContentDisplay';

interface ContentGeneratorProps {
  onContentGenerated: (content: CampaignData['content']) => void;
  existingContent: CampaignData['content'];
}

export const ContentGenerator = ({ onContentGenerated, existingContent }: ContentGeneratorProps) => {
  const {
    isGenerating,
    contentType,
    setContentType,
    platform,
    setPlatform,
    objective,
    setObjective,
    generateContent
  } = useContentGeneration(onContentGenerated, existingContent);

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Génération de Contenu</h3>
        <p className="text-sm text-muted-foreground">
          Décrivez l'objectif de votre contenu et choisissez le format
        </p>
      </div>

      <ContentForm
        isGenerating={isGenerating}
        contentType={contentType}
        platform={platform}
        objective={objective}
        onContentTypeChange={setContentType}
        onPlatformChange={setPlatform}
        onObjectiveChange={setObjective}
        onGenerate={generateContent}
      />

      <ContentDisplay content={existingContent} />
    </Card>
  );
};