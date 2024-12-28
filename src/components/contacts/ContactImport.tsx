import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Users } from 'lucide-react';
import Papa from 'papaparse';
import { supabase } from '@/lib/supabaseClient';

interface ContactData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  source: string;
  notes?: string;
}

export const ContactImport = () => {
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      Papa.parse<ContactData>(file, {
        header: true,
        complete: async (results) => {
          const { data: userData } = await supabase.auth.getUser();
          if (!userData.user) throw new Error('Not authenticated');

          const validContacts = results.data.filter(contact => 
            contact.email && contact.first_name && contact.last_name
          );

          for (const contact of validContacts) {
            await supabase.from('leads').insert({
              ...contact,
              user_id: userData.user.id,
              source: contact.source || 'import',
              status: 'cold',
              score: 0
            });
          }

          toast({
            title: "Import réussi",
            description: `${validContacts.length} contacts importés avec succès`,
          });
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          toast({
            title: "Erreur",
            description: "Le fichier CSV n'est pas valide",
            variant: "destructive",
          });
        }
      });
    } catch (error) {
      console.error('Error importing contacts:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'import",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Import de Contacts</h3>
          <p className="text-sm text-muted-foreground">
            Importez vos contacts depuis un fichier CSV
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => document.getElementById('importFile')?.click()}
            disabled={isImporting}
            className="flex items-center gap-2"
          >
            {isImporting ? (
              <>
                <Users className="w-4 h-4 animate-pulse" />
                Import en cours...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Importer CSV
              </>
            )}
          </Button>
          <input
            type="file"
            id="importFile"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>
    </Card>
  );
};