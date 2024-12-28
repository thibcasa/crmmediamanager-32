import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Download, Upload } from "lucide-react";
import { useState } from "react";
import Papa from "papaparse";
import { ProspectService } from "@/services/ProspectService";
import { LeadStatus } from "@/types/leads";

interface ProspectImportExportProps {
  onImportSuccess?: () => void;
}

interface CSVProspectData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  source: string;
  status: LeadStatus;
  score: string;
  qualification: "lead" | "prospect" | "client";
  notes?: string;
}

export const ProspectImportExport = ({ onImportSuccess }: ProspectImportExportProps) => {
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const validatePhone = (phone?: string) => {
    if (!phone) return true;
    return phone.match(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      Papa.parse<CSVProspectData>(file, {
        header: true,
        complete: async (results) => {
          const errors: string[] = [];
          const validData: CSVProspectData[] = [];

          results.data.forEach((row, index) => {
            if (!row.email || !validateEmail(row.email)) {
              errors.push(`Ligne ${index + 1}: Email invalide`);
              return;
            }
            if (row.phone && !validatePhone(row.phone)) {
              errors.push(`Ligne ${index + 1}: Numéro de téléphone invalide`);
              return;
            }
            if (!row.first_name || !row.last_name) {
              errors.push(`Ligne ${index + 1}: Nom ou prénom manquant`);
              return;
            }
            validData.push(row);
          });

          if (errors.length > 0) {
            toast({
              title: "Erreurs dans le fichier",
              description: (
                <div className="mt-2 space-y-2">
                  {errors.map((error, index) => (
                    <p key={index} className="text-sm text-red-600">{error}</p>
                  ))}
                </div>
              ),
              variant: "destructive",
            });
            return;
          }

          try {
            for (const row of validData) {
              await ProspectService.createProspect({
                first_name: row.first_name,
                last_name: row.last_name,
                email: row.email,
                phone: row.phone,
                source: row.source || 'direct',
                status: row.status as LeadStatus || 'cold',
                score: parseInt(row.score) || 0,
                qualification: row.qualification || 'lead',
                notes: row.notes,
                last_contact_date: new Date(),
              });
            }
            toast({
              title: "Import réussi",
              description: `${validData.length} contacts importés avec succès`,
            });
            if (onImportSuccess) {
              onImportSuccess();
            }
          } catch (error) {
            console.error('Error importing contacts:', error);
            toast({
              title: "Erreur",
              description: "Une erreur est survenue lors de l'import",
              variant: "destructive",
            });
          }
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

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const contacts = await ProspectService.getProspects();
      const csv = Papa.unparse(contacts.map(contact => ({
        first_name: contact.first_name,
        last_name: contact.last_name,
        email: contact.email,
        phone: contact.phone,
        source: contact.source,
        status: contact.status,
        score: contact.score,
        qualification: contact.qualification,
        notes: contact.notes,
        created_at: contact.created_at,
      })));

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'contacts.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export réussi",
        description: `${contacts.length} contacts exportés avec succès`,
      });
    } catch (error) {
      console.error('Error exporting contacts:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'export",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex gap-4">
      <Button
        variant="outline"
        onClick={() => document.getElementById('importFile')?.click()}
        disabled={isImporting}
        className="flex items-center gap-2"
      >
        <Upload className="w-4 h-4" />
        {isImporting ? 'Import en cours...' : 'Importer'}
      </Button>
      <input
        type="file"
        id="importFile"
        accept=".csv"
        onChange={handleImport}
        className="hidden"
      />
      
      <Button
        variant="outline"
        onClick={handleExport}
        disabled={isExporting}
        className="flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        {isExporting ? 'Export en cours...' : 'Exporter'}
      </Button>
    </div>
  );
};