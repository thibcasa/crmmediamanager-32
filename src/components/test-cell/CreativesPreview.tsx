import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Eye } from 'lucide-react';

export const CreativesPreview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((index) => (
        <Card key={index} className="p-4 space-y-4">
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            Aperçu {index}
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Créatif {index}</h3>
            <p className="text-sm text-muted-foreground">
              Post Facebook optimisé pour l'engagement
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};