import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Prospect } from '@/services/ProspectService';

interface ProspectTabsProps {
  prospects: Prospect[];
  activeTab: string;
  onTabChange: (value: string) => void;
  children: React.ReactNode;
}

export const ProspectTabs = ({ prospects, activeTab, onTabChange, children }: ProspectTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="all">
          Tous ({prospects.length})
        </TabsTrigger>
        <TabsTrigger value="lead">
          Leads ({prospects.filter(p => p.qualification === 'lead').length})
        </TabsTrigger>
        <TabsTrigger value="prospect">
          Prospects ({prospects.filter(p => p.qualification === 'prospect').length})
        </TabsTrigger>
        <TabsTrigger value="client">
          Clients ({prospects.filter(p => p.qualification === 'client').length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value={activeTab} className="mt-6">
        {children}
      </TabsContent>
    </Tabs>
  );
};