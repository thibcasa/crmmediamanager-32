import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { MailchimpSettings } from "./api/MailchimpSettings";
import { BrevoSettings } from "./api/BrevoSettings";
import { Mail, Send } from "lucide-react";

export const EmailApiSettings = () => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Configuration Email Marketing</h2>
      
      <Tabs defaultValue="brevo" className="w-full">
        <TabsList className="grid w-full grid-cols-2 gap-2">
          <TabsTrigger value="brevo" className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Brevo
          </TabsTrigger>
          <TabsTrigger value="mailchimp" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Mailchimp
          </TabsTrigger>
        </TabsList>

        <TabsContent value="brevo" className="mt-6">
          <BrevoSettings />
        </TabsContent>

        <TabsContent value="mailchimp" className="mt-6">
          <MailchimpSettings />
        </TabsContent>
      </Tabs>
    </Card>
  );
};