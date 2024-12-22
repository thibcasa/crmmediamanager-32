import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { SocialSharingService } from "@/services/SocialSharingService";

interface ShareButtonProps {
  content: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const ShareButton = ({ content, onSuccess, onError }: ShareButtonProps) => {
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      await SocialSharingService.shareToLinkedIn(content);
      
      toast({
        title: "Partagé avec succès",
        description: "Votre contenu a été publié sur LinkedIn"
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error sharing content:', error);
      
      toast({
        title: "Erreur de partage",
        description: error.message || "Impossible de partager le contenu",
        variant: "destructive"
      });

      onError?.(error);
    }
  };

  return (
    <Button 
      onClick={handleShare}
      className="flex items-center gap-2"
    >
      <Share className="h-4 w-4" />
      Partager sur LinkedIn
    </Button>
  );
};