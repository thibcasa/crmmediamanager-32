import { AppLayout } from "@/components/layout/AppLayout";
import { CampaignWorkflow } from "@/components/social/CampaignWorkflow";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Target, 
  Zap, 
  BarChart3, 
  Users, 
  MessageSquare,
  Image,
  Video,
  Mail,
  Workflow as WorkflowIcon
} from "lucide-react";
import { ContentGenerator } from "@/components/content/ContentGenerator";
import { EmailCampaign } from "@/components/EmailCampaign";
import { WorkflowSteps } from "@/components/workflow/WorkflowSteps";

const Index = () => {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Tableau de bord CRM Immobilier
          </h1>
          <p className="text-muted-foreground mt-2">
            Gérez vos stratégies de prospection et optimisez vos conversions
          </p>
        </div>

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span>Création Contenu</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>Campagnes Email</span>
            </TabsTrigger>
            <TabsTrigger value="workflow" className="flex items-center gap-2">
              <WorkflowIcon className="h-4 w-4" />
              <span>Workflow</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analyses</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <Card className="p-6">
              <ContentGenerator />
            </Card>
          </TabsContent>

          <TabsContent value="email">
            <Card className="p-6">
              <EmailCampaign />
            </Card>
          </TabsContent>

          <TabsContent value="workflow">
            <Card className="p-6">
              <WorkflowSteps />
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Analyses et performances</h3>
                <p className="text-muted-foreground">
                  Suivez vos indicateurs clés et optimisez vos campagnes.
                </p>
                <div className="text-center py-8 text-muted-foreground">
                  Module en cours de développement
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Index;