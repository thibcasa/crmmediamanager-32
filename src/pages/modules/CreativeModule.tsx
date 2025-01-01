import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VisualGenerator } from "@/components/visuals/VisualGenerator";
import { VisualChatModifier } from "@/components/visuals/VisualChatModifier";

export default function CreativeModule() {
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>("");

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Module Créatif</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <VisualGenerator 
          onImageGenerated={setGeneratedImageUrl}
          subject="Investir dans une villa de luxe" 
        />
        
        {generatedImageUrl && (
          <VisualChatModifier imageUrl={generatedImageUrl} />
        )}
      </div>
    </div>
  );
}