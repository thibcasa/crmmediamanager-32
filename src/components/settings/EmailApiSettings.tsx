import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { MailchimpSettings } from "./api/MailchimpSettings";
import { BrevoSettings } from "./api/BrevoSettings";
import { GmailSettings } from "./api/GmailSettings";
import { OutlookSettings } from "./api/OutlookSettings";
import { SmtpSettings } from "./api/SmtpSettings";
import { Mail, Send, MailPlus } from "lucide-react";

export const EmailApiSettings = () => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Configuration Email Marketing</h2>
      
      <Tabs defaultValue="brevo" className="w-full">
        <TabsList className="grid w-full grid-cols-5 gap-2">
          <TabsTrigger value="brevo" className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Brevo
          </TabsTrigger>
          <TabsTrigger value="mailchimp" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Mailchimp
          </TabsTrigger>
          <TabsTrigger value="gmail" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Gmail
          </TabsTrigger>
          <TabsTrigger value="outlook" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Outlook
          </TabsTrigger>
          <TabsTrigger value="smtp" className="flex items-center gap-2">
            <MailPlus className="w-4 h-4" />
            SMTP
          </TabsTrigger>
        </TabsList>

        <TabsContent value="brevo" className="mt-6">
          <BrevoSettings />
        </TabsContent>

        <TabsContent value="mailchimp" className="mt-6">
          <MailchimpSettings />
        </TabsContent>

        <TabsContent value="gmail" className="mt-6">
          <GmailSettings />
        </TabsContent>

        <TabsContent value="outlook" className="mt-6">
          <OutlookSettings />
        </TabsContent>

        <TabsContent value="smtp" className="mt-6">
          <SmtpSettings />
        </TabsContent>
      </Tabs>
    </Card>
  );
};