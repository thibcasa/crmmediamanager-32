import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SocialApiSettings } from "@/components/settings/SocialApiSettings";
import { EmailApiSettings } from "@/components/settings/EmailApiSettings";

const ApiSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Paramètres API</h1>
        <p className="text-muted-foreground mt-2">
          Configurez vos connexions aux réseaux sociaux et autres services
        </p>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="social" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
            <TabsTrigger value="social">Réseaux Sociaux</TabsTrigger>
            <TabsTrigger value="email">Email Marketing</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="social" className="mt-6">
            <SocialApiSettings />
          </TabsContent>

          <TabsContent value="email" className="mt-6">
            <EmailApiSettings />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="text-center py-8 text-gray-500">
              Configuration des services d'analytics à venir
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default ApiSettings;