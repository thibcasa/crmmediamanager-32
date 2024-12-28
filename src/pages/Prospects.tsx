import { ProspectList } from "@/components/prospects/ProspectList";

const Prospects = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Prospects</h1>
        <p className="text-muted-foreground mt-2">
          Gérez vos prospects et leurs interactions.
        </p>
      </div>
      <ProspectList />
    </div>
  );
};

export default Prospects;