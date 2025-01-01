import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SeoAnalysisProps {
  analysis: {
    keywordDensity: { [key: string]: number };
    readabilityScore: number;
    wordCount: number;
    structure: {
      h1Count: number;
      h2Count: number;
      paragraphCount: number;
    };
  };
}

export const SeoAnalysis = ({ analysis }: SeoAnalysisProps) => {
  return (
    <Card className="p-6 mt-4">
      <h2 className="text-xl font-bold mb-4">Analyse SEO</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Score de lisibilité</h3>
          <Progress value={analysis.readabilityScore} className="w-full" />
          <p className="text-sm text-gray-500 mt-1">
            {analysis.readabilityScore}/100 - {analysis.wordCount} mots
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Densité des mots-clés</h3>
          <div className="space-y-2">
            {Object.entries(analysis.keywordDensity).map(([keyword, density]) => (
              <div key={keyword} className="flex justify-between items-center">
                <span className="text-sm">{keyword}</span>
                <span className="text-sm font-medium">{density.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Structure du contenu</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{analysis.structure.h1Count}</p>
              <p className="text-sm text-gray-500">Titres H1</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{analysis.structure.h2Count}</p>
              <p className="text-sm text-gray-500">Sous-titres H2</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{analysis.structure.paragraphCount}</p>
              <p className="text-sm text-gray-500">Paragraphes</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};