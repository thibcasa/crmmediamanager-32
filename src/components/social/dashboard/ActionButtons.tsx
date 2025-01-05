import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ActionButtonsProps {
  onRefresh: () => void;
}

export const ActionButtons = ({ onRefresh }: ActionButtonsProps) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={onRefresh}
        className="flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Rafraîchir
      </Button>
    </div>
  );
};