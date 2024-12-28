import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Image, 
  Mail, 
  Users, 
  Workflow as WorkflowIcon,
  BarChart3,
  MessageSquare,
  FileText,
  Target,
  Settings
} from "lucide-react";
import { ContentGenerator } from "@/components/content/ContentGenerator";
import { EmailCampaign } from "@/components/EmailCampaign";
import { WorkflowSteps } from "@/components/workflow/WorkflowSteps";
import { SocialCampaigns } from "@/components/SocialCampaigns";

const Index = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Tableau de bord CRM Immobilier
        </h1>
        <p className="text-xl text-muted-foreground">
          Gérez vos stratégies de prospection et optimisez vos conversions
        </p>
      </div>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            <span>Création Contenu</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Campagnes Social</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>Campagnes Email</span>
          </TabsTrigger>
          <TabsTrigger value="workflow" className="flex items-center gap-2">
            <WorkflowIcon className="h-4 w-4" />
            <span>Workflow</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h2 className="text-2xl font-semibold">Générateur de Contenu</h2>
                  <p className="text-muted-foreground mt-1">
                    Créez du contenu optimisé pour vos réseaux sociaux
                  </p>
                </div>
                <div className="flex gap-2">
                  <Target className="h-5 w-5 text-muted-foreground" />
                  <Settings className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <ContentGenerator />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h2 className="text-2xl font-semibold">Campagnes Social Media</h2>
                  <p className="text-muted-foreground mt-1">
                    Gérez vos campagnes sur les réseaux sociaux
                  </p>
                </div>
                <div className="flex gap-2">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  <Settings className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <SocialCampaigns />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h2 className="text-2xl font-semibold">Campagnes Email</h2>
                  <p className="text-muted-foreground mt-1">
                    Créez et gérez vos campagnes email
                  </p>
                </div>
                <div className="flex gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <Settings className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <EmailCampaign />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="workflow">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h2 className="text-2xl font-semibold">Workflow Automation</h2>
                  <p className="text-muted-foreground mt-1">
                    Automatisez vos processus de prospection
                  </p>
                </div>
                <div className="flex gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <Settings className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <WorkflowSteps />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;