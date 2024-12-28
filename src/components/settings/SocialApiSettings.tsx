import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Facebook, Instagram, Linkedin, Twitter, MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export const SocialApiSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveApiKey = async (platform: string, key: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('update-social-api-key', {
        body: { platform, key }
      });

      if (error) throw error;

      toast({
        title: "Configuration mise à jour",
        description: `Les paramètres de ${platform} ont été mis à jour avec succès.`
      });
    } catch (error) {
      console.error(`Error updating ${platform} API key:`, error);
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour la configuration de ${platform}.`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Configuration des API Réseaux Sociaux</h2>
      
      <Tabs defaultValue="linkedin" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="linkedin" className="flex items-center gap-2">
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </TabsTrigger>
          <TabsTrigger value="facebook" className="flex items-center gap-2">
            <Facebook className="w-4 h-4" />
            Facebook
          </TabsTrigger>
          <TabsTrigger value="instagram" className="flex items-center gap-2">
            <Instagram className="w-4 h-4" />
            Instagram
          </TabsTrigger>
          <TabsTrigger value="twitter" className="flex items-center gap-2">
            <Twitter className="w-4 h-4" />
            Twitter
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </TabsTrigger>
        </TabsList>

        <TabsContent value="linkedin">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Configuration LinkedIn</h3>
              <p className="text-sm text-gray-500 mb-4">
                Connectez-vous avec l'API LinkedIn pour automatiser vos campagnes de prospection.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Client ID</label>
                  <Input
                    type="password"
                    placeholder="Entrez votre Client ID LinkedIn"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Client Secret</label>
                  <Input
                    type="password"
                    placeholder="Entrez votre Client Secret LinkedIn"
                    className="w-full"
                  />
                </div>
                <Button 
                  onClick={() => handleSaveApiKey('linkedin', 'test')}
                  disabled={isLoading}
                >
                  Sauvegarder
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="facebook">
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-2">Configuration Facebook</h3>
            <p className="text-sm text-gray-500 mb-4">
              Configurez l'API Facebook pour gérer vos campagnes publicitaires immobilières.
            </p>
            <div>
              <label className="block text-sm font-medium mb-1">Access Token</label>
              <Input
                type="password"
                placeholder="Entrez votre Access Token Facebook"
                className="w-full"
              />
            </div>
            <Button 
              onClick={() => handleSaveApiKey('facebook', 'test')}
              disabled={isLoading}
            >
              Sauvegarder
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="instagram">
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-2">Configuration Instagram</h3>
            <p className="text-sm text-gray-500 mb-4">
              Paramétrez l'API Instagram pour partager vos biens immobiliers.
            </p>
            <div>
              <label className="block text-sm font-medium mb-1">Access Token</label>
              <Input
                type="password"
                placeholder="Entrez votre Access Token Instagram"
                className="w-full"
              />
            </div>
            <Button 
              onClick={() => handleSaveApiKey('instagram', 'test')}
              disabled={isLoading}
            >
              Sauvegarder
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="twitter">
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-2">Configuration Twitter</h3>
            <p className="text-sm text-gray-500 mb-4">
              Configurez l'API Twitter pour partager vos actualités immobilières.
            </p>
            <div>
              <label className="block text-sm font-medium mb-1">API Key</label>
              <Input
                type="password"
                placeholder="Entrez votre API Key Twitter"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">API Secret</label>
              <Input
                type="password"
                placeholder="Entrez votre API Secret Twitter"
                className="w-full"
              />
            </div>
            <Button 
              onClick={() => handleSaveApiKey('twitter', 'test')}
              disabled={isLoading}
            >
              Sauvegarder
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="whatsapp">
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-2">Configuration WhatsApp</h3>
            <p className="text-sm text-gray-500 mb-4">
              Paramétrez l'API WhatsApp Business pour communiquer avec vos prospects.
            </p>
            <div>
              <label className="block text-sm font-medium mb-1">Access Token</label>
              <Input
                type="password"
                placeholder="Entrez votre Access Token WhatsApp"
                className="w-full"
              />
            </div>
            <Button 
              onClick={() => handleSaveApiKey('whatsapp', 'test')}
              disabled={isLoading}
            >
              Sauvegarder
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};