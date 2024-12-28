import { Card } from "@/components/ui/card";
import { TestResults } from "./types/test-results";
import { MetricsVisualization } from "./MetricsVisualization";
import { Brain, Target, Users, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DetailedReportProps {
  before: TestResults;
  after?: TestResults;
}

export const DetailedReport = ({ before, after }: DetailedReportProps) => {
  const results = after || before;

  return (
    <div className="space-y-6">
      <MetricsVisualization before={before} after={after} />

      <Tabs defaultValue="audience" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="audience" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Audience
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Prédictions
          </TabsTrigger>
          <TabsTrigger value="targeting" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Ciblage
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="audience">
          <Card className="p-4">
            {results.audienceInsights?.segments.map((segment, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{segment.name}</h4>
                  <span className="text-sm text-muted-foreground">
                    Score: {(segment.score * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${segment.potential * 100}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Potentiel: {(segment.potential * 100).toFixed(1)}%
                </p>
              </div>
            ))}
          </Card>
        </TabsContent>

        <TabsContent value="predictions">
          <Card className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Leads par semaine</p>
                <p className="text-2xl font-bold">
                  {results.predictedMetrics?.leadsPerWeek || 0}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Coût par lead</p>
                <p className="text-2xl font-bold">
                  {results.predictedMetrics?.costPerLead || 0}€
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Budget total</p>
                <p className="text-2xl font-bold">
                  {results.predictedMetrics?.totalBudget || 0}€
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Revenus projetés</p>
                <p className="text-2xl font-bold">
                  {results.predictedMetrics?.revenueProjection || 0}€
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="targeting">
          <Card className="p-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Âge</h4>
                <div className="flex flex-wrap gap-2">
                  {results.audienceInsights?.demographics.age.map((age, index) => (
                    <span key={index} className="px-2 py-1 bg-muted rounded-full text-sm">
                      {age}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Localisation</h4>
                <div className="flex flex-wrap gap-2">
                  {results.audienceInsights?.demographics.location.map((location, index) => (
                    <span key={index} className="px-2 py-1 bg-muted rounded-full text-sm">
                      {location}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Centres d'intérêt</h4>
                <div className="flex flex-wrap gap-2">
                  {results.audienceInsights?.demographics.interests.map((interest, index) => (
                    <span key={index} className="px-2 py-1 bg-muted rounded-full text-sm">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card className="p-4">
            <div className="space-y-4">
              {results.campaignDetails?.creatives.map((creative, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium capitalize">{creative.type}</p>
                    <p className="text-sm text-muted-foreground">{creative.content}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Performance</p>
                    <p className="font-medium text-green-600">
                      {(creative.performance * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};