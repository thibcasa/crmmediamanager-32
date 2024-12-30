import { ModuleInteractionCard } from "./ModuleInteractionCard";
import { ModuleState, ModuleType, ModuleConfig } from "@/types/modules";

interface ModuleInteractionGridProps {
  moduleStates: Record<ModuleType, ModuleState>;
  moduleConfigs: ModuleConfig[];
}

export const ModuleInteractionGrid = ({
  moduleStates,
  moduleConfigs
}: ModuleInteractionGridProps) => {
  const isModuleReady = (config: ModuleConfig): boolean => {
    if (!config.dependsOn) return true;
    return config.dependsOn.every(
      dependency => moduleStates[dependency].status === 'validated'
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {moduleConfigs.map((config) => {
        const state = moduleStates[config.type];
        const ready = isModuleReady(config);

        return (
          <div key={config.type} className={ready ? '' : 'opacity-50'}>
            <ModuleInteractionCard
              type={config.type}
              state={state}
              name={config.name}
              description={config.description}
              requiredScore={config.requiredScore}
            />
          </div>
        );
      })}
    </div>
  );
};