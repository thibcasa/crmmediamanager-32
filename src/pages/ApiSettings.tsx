import { Card } from "@/components/ui/card"
import { ApiKeyForm } from "@/components/lead-scraper/ApiKeyForm"

const ApiSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Paramètres API</h1>
        <p className="text-muted-foreground mt-2">
          Gérez vos clés API et intégrations
        </p>
      </div>

      <Card className="p-6">
        <ApiKeyForm />
      </Card>
    </div>
  )
}

export default ApiSettings