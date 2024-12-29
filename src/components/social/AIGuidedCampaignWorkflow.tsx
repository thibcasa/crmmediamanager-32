import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { SocialCampaignService } from '@/services/SocialCampaignService';

export const AIGuidedCampaignWorkflow = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState('targeting');

  return (
    <Card className="p-6">
      <Tabs value={currentStep} onValueChange={setCurrentStep}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="targeting">Ciblage</TabsTrigger>
          <TabsTrigger value="content">Contenu</TabsTrigger>
          <TabsTrigger value="schedule">Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="targeting">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Définir le ciblage</h3>
            <div className="grid gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Localisation</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Ex: Nice, Alpes-Maritimes"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type de propriétaire</label>
                <select className="w-full p-2 border rounded">
                  <option value="residential">Résidentiel</option>
                  <option value="commercial">Commercial</option>
                  <option value="investor">Investisseur</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Valeur estimée du bien</label>
                <select className="w-full p-2 border rounded">
                  <option value="0-300k">0 - 300k€</option>
                  <option value="300k-600k">300k - 600k€</option>
                  <option value="600k+">600k€ +</option>
                </select>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="content">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Créer le contenu</h3>
            <div className="grid gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type de message</label>
                <select className="w-full p-2 border rounded">
                  <option value="estimation">Proposition d'estimation</option>
                  <option value="market_analysis">Analyse du marché</option>
                  <option value="property_value">Évolution des prix</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Ton du message</label>
                <select className="w-full p-2 border rounded">
                  <option value="professional">Professionnel</option>
                  <option value="friendly">Amical</option>
                  <option value="direct">Direct</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message personnalisé</label>
                <textarea
                  className="w-full p-2 border rounded min-h-[100px]"
                  placeholder="Entrez votre message ici..."
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="schedule">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Planifier la campagne</h3>
            <div className="grid gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date de début</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Fréquence d'envoi</label>
                <select className="w-full p-2 border rounded">
                  <option value="daily">Quotidien</option>
                  <option value="weekly">Hebdomadaire</option>
                  <option value="monthly">Mensuel</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre de messages par jour</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  min="1"
                  max="50"
                  defaultValue="10"
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};