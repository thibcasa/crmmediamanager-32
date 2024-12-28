import { Button } from "@/components/ui/button";
import { UserPlus } from 'lucide-react';
import { ProspectImportExport } from './ProspectImportExport';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProspectForm } from './ProspectForm';

interface ProspectHeaderProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  onAddSuccess: () => void;
  onImportSuccess: () => void;
}

export const ProspectHeader = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  onAddSuccess,
  onImportSuccess
}: ProspectHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-semibold">Liste des Contacts</h2>
      <div className="flex gap-4">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Ajouter un contact
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau contact</DialogTitle>
            </DialogHeader>
            <ProspectForm 
              onSuccess={onAddSuccess} 
              onCancel={() => setIsAddDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
        <ProspectImportExport onImportSuccess={onImportSuccess} />
      </div>
    </div>
  );
};