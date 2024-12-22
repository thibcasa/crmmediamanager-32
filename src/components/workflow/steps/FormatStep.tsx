import { Card } from "@/components/ui/card";
import { MessageSquare, Image as ImageIcon, Video, FileText } from "lucide-react";

interface FormatStepProps {
  onFormatSelect: (format: string) => void;
}

export const FormatStep = ({ onFormatSelect }: FormatStepProps) => {
  const formats = [
    {
      id: 'text',
      name: 'Message Texte',
      icon: <MessageSquare className="h-6 w-6" />,
      description: 'Messages personnalisés et directs'
    },
    {
      id: 'image',
      name: 'Image + Texte',
      icon: <ImageIcon className="h-6 w-6" />,
      description: 'Visuels attractifs avec description'
    },
    {
      id: 'video',
      name: 'Vidéo Courte',
      icon: <Video className="h-6 w-6" />,
      description: 'Contenus dynamiques et engageants'
    },
    {
      id: 'article',
      name: 'Article',
      icon: <FileText className="h-6 w-6" />,
      description: 'Analyses détaillées du marché'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-sage-800">Choisir le format de contenu</h3>
        <p className="text-sm text-sage-600">Sélectionnez le format le plus adapté à votre message</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {formats.map((format) => (
          <Card
            key={format.id}
            className="p-4 cursor-pointer hover:shadow-lg transition-all border-2 hover:border-sage-500"
            onClick={() => onFormatSelect(format.id)}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sage-100 rounded-lg">
                {format.icon}
              </div>
              <div>
                <h4 className="font-semibold text-sage-900">{format.name}</h4>
                <p className="text-sm text-sage-600">{format.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};