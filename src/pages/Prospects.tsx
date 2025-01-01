import { ProspectList } from "@/components/prospects/ProspectList";
import { ProspectImportExport } from "@/components/prospects/ProspectImportExport";
import { Card } from "@/components/ui/card";

const Prospects = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Prospects</h1>
          <p className="text-muted-foreground mt-2">
            Gérez vos prospects et leurs interactions.
          </p>
        </div>
        <ProspectImportExport />
      </div>
      
      <Card className="p-6">
        <ProspectList />
      </Card>
    </div>
  );
};

export default Prospects;