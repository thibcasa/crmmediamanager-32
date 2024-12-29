import { Card } from "@/components/ui/card";
import { CampaignData } from '../types/campaign';
import { ContentWorkflowForm } from './content-generator/ContentWorkflowForm';
import { ContentWorkflowDisplay } from './content-generator/ContentWorkflowDisplay';
import { useState } from 'react';

interface ContentGeneratorProps {
  onContentGenerated: (content: CampaignData['content']) => void;
  existingContent: CampaignData['content'];
}

export const ContentGenerator = ({ onContentGenerated, existingContent }: ContentGeneratorProps) => {
  const [generatedContent, setGeneratedContent] = useState<any>(null);

  const handleContentGenerated = (content: any) => {
    setGeneratedContent(content);
    onContentGenerated([
      ...existingContent,
      {
        type: 'post',
        text: content.content
      }
    ]);
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Génération de Contenu</h3>
        <p className="text-sm text-muted-foreground">
          Créez du contenu optimisé pour vos réseaux sociaux
        </p>
      </div>

      <ContentWorkflowForm onContentGenerated={handleContentGenerated} />
      
      {generatedContent && (
        <ContentWorkflowDisplay content={generatedContent} />
      )}
    </Card>
  );
};