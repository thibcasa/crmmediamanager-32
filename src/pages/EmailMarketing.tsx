import { EmailCampaign } from "@/components/EmailCampaign";
import { EmailApiSettings } from "@/components/settings/EmailApiSettings";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EmailMarketing = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Email Marketing</h1>
        <p className="text-muted-foreground mt-2">
          Gérez vos campagnes email et vos intégrations
        </p>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="campaign" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="campaign">Campagnes</TabsTrigger>
            <TabsTrigger value="settings">Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="campaign" className="mt-6">
            <EmailCampaign />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <EmailApiSettings />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default EmailMarketing;