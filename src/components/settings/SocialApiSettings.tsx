import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Facebook, Instagram, Linkedin, Twitter, MessageCircle, Search } from 'lucide-react';
import { LinkedInSettings } from './api/LinkedInSettings';
import { FacebookSettings } from './api/FacebookSettings';
import { InstagramSettings } from './api/InstagramSettings';
import { WhatsAppSettings } from './api/WhatsAppSettings';
import { ApiKeyForm } from '@/components/lead-scraper/ApiKeyForm';

export const SocialApiSettings = () => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Configuration des API</h2>
      
      <Tabs defaultValue="firecrawl" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="firecrawl" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Firecrawl
          </TabsTrigger>
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
          <TabsTrigger value="whatsapp" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </TabsTrigger>
        </TabsList>

        <TabsContent value="firecrawl" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Configuration de l'API Firecrawl</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Configurez votre clé API Firecrawl pour activer la recherche et l'analyse de sites web.
            </p>
            <ApiKeyForm />
          </Card>
        </TabsContent>

        <TabsContent value="linkedin">
          <LinkedInSettings />
        </TabsContent>

        <TabsContent value="facebook">
          <FacebookSettings />
        </TabsContent>

        <TabsContent value="instagram">
          <InstagramSettings />
        </TabsContent>

        <TabsContent value="whatsapp">
          <WhatsAppSettings />
        </TabsContent>
      </Tabs>
    </Card>
  );
};