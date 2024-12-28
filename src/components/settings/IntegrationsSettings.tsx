import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Database,
  FileText,
  Workflow,
  Building2,
  Webhook,
  Home,
  MessageCircle,
  Calendar,
  FileSignature,
  Mail,
  Store,
  Building,
  BarChart,
} from "lucide-react";
import { SeLogerSettings } from "./api/SeLogerSettings";
import { MeilleursAgentsSettings } from "./api/MeilleursAgentsSettings";
import { LeBonCoinSettings } from "./api/LeBonCoinSettings";

export const IntegrationsSettings = () => {
  const { toast } = useToast();
  const [zapierWebhook, setZapierWebhook] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleZapierTest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!zapierWebhook) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer l'URL du webhook Zapier",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("Test du webhook Zapier:", zapierWebhook);

    try {
      const response = await fetch(zapierWebhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          triggered_from: window.location.origin,
        }),
      });

      toast({
        title: "Requête envoyée",
        description: "La requête a été envoyée à Zapier. Vérifiez l'historique de votre Zap.",
      });
    } catch (error) {
      console.error("Erreur lors du test du webhook:", error);
      toast({
        title: "Erreur",
        description: "Impossible de déclencher le webhook Zapier",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const integrations = [
    {
      name: "SeLoger API",
      icon: <Home className="w-6 h-6" />,
      description: "Synchronisez vos annonces immobilières",
      url: "https://api.seloger.com/oauth/authorize",
      component: <SeLogerSettings />,
    },
    {
      name: "LeBonCoin",
      icon: <Store className="w-6 h-6" />,
      description: "Gérez vos annonces LeBonCoin",
      component: <LeBonCoinSettings />,
    },
    {
      name: "MeilleursAgents",
      icon: <Building className="w-6 h-6" />,
      description: "Accédez aux estimations de prix",
      component: <MeilleursAgentsSettings />,
    },
    {
      name: "WhatsApp Business",
      icon: <MessageCircle className="w-6 h-6" />,
      description: "Communication directe avec les clients",
      url: "https://business.whatsapp.com/products/business-platform",
    },
    {
      name: "Calendly",
      icon: <Calendar className="w-6 h-6" />,
      description: "Gestion automatisée des rendez-vous",
      url: "https://calendly.com/app/oauth/authorize",
    },
    {
      name: "DocuSign",
      icon: <FileSignature className="w-6 h-6" />,
      description: "Signature électronique de documents",
      url: "https://account-d.docusign.com/oauth/auth",
    },
    {
      name: "SendinBlue",
      icon: <Mail className="w-6 h-6" />,
      description: "Campagnes email immobilières",
      url: "https://app.sendinblue.com/oauth/authorize",
    },
    {
      name: "Zapier",
      icon: <Workflow className="w-6 h-6" />,
      description: "Automatisez vos workflows",
      isWebhook: true,
    },
    {
      name: "Monday",
      icon: <Database className="w-6 h-6" />,
      description: "Gérez vos projets et tâches",
      url: "https://monday.com/oauth/authorize",
    },
    {
      name: "Notion",
      icon: <FileText className="w-6 h-6" />,
      description: "Connectez votre espace de travail",
      url: "https://api.notion.com/v1/oauth/authorize",
    },
    {
      name: "HubSpot",
      icon: <Building2 className="w-6 h-6" />,
      description: "Synchronisez vos contacts CRM",
      url: "https://app.hubspot.com/oauth/authorize",
    },
    {
      name: "Google Analytics",
      icon: <BarChart className="w-6 h-6" />,
      description: "Analysez votre trafic web",
      url: "https://analytics.google.com/analytics/web/",
    },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Intégrations d'Applications</h2>
      
      <div className="grid gap-6">
        {integrations.map((integration) => (
          <Card key={integration.name} className="p-4">
            {integration.component ? (
              integration.component
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {integration.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{integration.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {integration.description}
                    </p>
                  </div>
                </div>
                
                {integration.isWebhook ? (
                  <form onSubmit={handleZapierTest} className="flex items-center space-x-2">
                    <Input
                      type="url"
                      placeholder="URL du webhook Zapier"
                      value={zapierWebhook}
                      onChange={(e) => setZapierWebhook(e.target.value)}
                      className="w-64"
                    />
                    <Button type="submit" disabled={isLoading}>
                      Tester
                    </Button>
                  </form>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => window.open(integration.url, '_blank')}
                  >
                    Connecter
                  </Button>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </Card>
  );
};