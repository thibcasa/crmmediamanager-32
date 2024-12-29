import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Users, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  score: number;
}

interface SegmentationModuleProps {
  leads: Lead[];
  isLoading: boolean;
}

export const SegmentationModule = ({ leads, isLoading }: SegmentationModuleProps) => {
  const { toast } = useToast();
  const [isSegmenting, setIsSegmenting] = useState(false);

  const handleSegmentation = async () => {
    setIsSegmenting(true);
    try {
      const { data: segments, error } = await supabase
        .from('audience_segments')
        .insert([
          {
            name: 'Propriétaires Premium',
            description: 'Propriétaires de biens immobiliers haut de gamme',
            criteria: {
              location: 'Alpes-Maritimes',
              propertyValue: '> 1M€',
              age: '35-65'
            }
          }
        ])
        .select();

      if (error) throw error;

      toast({
        title: "Segmentation créée",
        description: "Le segment d'audience a été créé avec succès"
      });
    } catch (error) {
      console.error('Error creating segment:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le segment",
        variant: "destructive"
      });
    } finally {
      setIsSegmenting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Segmentation d'Audience</h3>
          <p className="text-sm text-muted-foreground">
            Créez des segments ciblés pour vos campagnes
          </p>
        </div>
        <Button 
          onClick={handleSegmentation}
          disabled={isSegmenting || isLoading}
          className="flex items-center gap-2"
        >
          {isSegmenting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Segmentation...
            </>
          ) : (
            <>
              <Users className="w-4 h-4" />
              Créer un segment
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {leads.map((lead) => (
          <Card key={lead.id} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">
                  {lead.first_name} {lead.last_name}
                </p>
                <p className="text-sm text-muted-foreground">{lead.email}</p>
              </div>
              <div className="text-sm font-medium">
                Score: {lead.score}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};