import { AppLayout } from "@/components/layout/AppLayout";
import { CampaignWorkflow } from "@/components/social/CampaignWorkflow";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Target, Zap, BarChart3, Users, MessageSquare } from "lucide-react";

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

        <Tabs defaultValue="workflow" className="space-y-6">
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-4">
            <TabsTrigger value="workflow" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>Workflow</span>
            </TabsTrigger>
            <TabsTrigger value="targeting" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>Ciblage</span>
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Automation</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analyses</span>
            </TabsTrigger>
            <TabsTrigger value="prospects" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Prospects</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Messages</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workflow">
            <Card className="p-6">
              <CampaignWorkflow />
            </Card>
          </TabsContent>

          <TabsContent value="targeting">
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Configuration du ciblage</h3>
                <p className="text-muted-foreground">
                  Définissez vos critères de ciblage pour atteindre les propriétaires immobiliers des Alpes-Maritimes.
                </p>
                <div className="text-center py-8 text-muted-foreground">
                  Module en cours de développement
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="automation">
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Automatisation des tâches</h3>
                <p className="text-muted-foreground">
                  Configurez vos règles d'automatisation pour optimiser votre prospection.
                </p>
                <div className="text-center py-8 text-muted-foreground">
                  Module en cours de développement
                </div>
              </div>
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

          <TabsContent value="prospects">
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Gestion des prospects</h3>
                <p className="text-muted-foreground">
                  Gérez et qualifiez vos prospects immobiliers.
                </p>
                <div className="text-center py-8 text-muted-foreground">
                  Module en cours de développement
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Messages et communications</h3>
                <p className="text-muted-foreground">
                  Gérez vos communications avec vos prospects.
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