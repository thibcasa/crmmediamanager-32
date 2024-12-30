import { Card } from "@/components/ui/card";
import { ModuleInteractionGrid } from "./ModuleInteractionGrid";
import { useModuleStates } from "@/hooks/useModuleStates";
import { MODULE_CONFIGS } from "@/config/moduleConfigs";

export const ModuleInteractionPanel = () => {
  const { moduleStates } = useModuleStates();

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Module Status</h2>
      <ModuleInteractionGrid
        moduleStates={moduleStates}
        moduleConfigs={MODULE_CONFIGS}
      />
    </Card>
  );
};