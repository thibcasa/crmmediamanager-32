import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Map, ListFilter, Settings } from "lucide-react";

const Properties = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Gestion des Propriétés</h1>
        <p className="text-muted-foreground mt-2">
          Gérez votre portefeuille immobilier et suivez les opportunités
        </p>
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span>Liste des Propriétés</span>
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            <span>Vue Carte</span>
          </TabsTrigger>
          <TabsTrigger value="filters" className="flex items-center gap-2">
            <ListFilter className="h-4 w-4" />
            <span>Filtres Avancés</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Paramètres</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card className="p-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Liste des Propriétés</h2>
              <p className="text-muted-foreground">
                Aucune propriété n'a encore été ajoutée.
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="map">
          <Card className="p-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Carte des Propriétés</h2>
              <div className="h-[400px] bg-muted rounded-lg flex items-center justify-center">
                Carte interactive à venir
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="filters">
          <Card className="p-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Filtres Avancés</h2>
              <p className="text-muted-foreground">
                Configuration des filtres à venir
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Paramètres</h2>
              <p className="text-muted-foreground">
                Configuration des paramètres à venir
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Properties;