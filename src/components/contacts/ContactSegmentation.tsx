import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tags, Users } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  score: number;
  tags?: string[];
}

interface Segment {
  name: string;
  count: number;
  criteria: Record<string, any>;
}

export const ContactSegmentation = () => {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', userData.user.id);

      if (error) throw error;
      setContacts(data || []);

      // Calculer les segments
      const highValueSegment = data?.filter(c => c.score >= 70).length || 0;
      const mediumValueSegment = data?.filter(c => c.score >= 40 && c.score < 70).length || 0;
      const newLeadsSegment = data?.filter(c => 
        new Date(c.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
      ).length || 0;

      setSegments([
        {
          name: 'Haute Valeur',
          count: highValueSegment,
          criteria: { score: '>=70' }
        },
        {
          name: 'Valeur Moyenne',
          count: mediumValueSegment,
          criteria: { score: '40-70' }
        },
        {
          name: 'Nouveaux Leads',
          count: newLeadsSegment,
          criteria: { created: 'last7days' }
        }
      ]);
    } catch (error) {
      console.error('Error loading contacts:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les contacts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium">Segmentation des Contacts</h3>
          <p className="text-sm text-muted-foreground">
            {contacts.length} contacts au total
          </p>
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={loadContacts}
          disabled={isLoading}
        >
          <Users className="w-4 h-4" />
          Rafraîchir
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {segments.map((segment) => (
          <Card key={segment.name} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">{segment.name}</h4>
                <p className="text-2xl font-bold">{segment.count}</p>
              </div>
              <Tags className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="mt-2">
              {Object.entries(segment.criteria).map(([key, value]) => (
                <Badge key={key} variant="secondary" className="mr-2">
                  {key}: {value}
                </Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};