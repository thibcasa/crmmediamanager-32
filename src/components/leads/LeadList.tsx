import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LeadScoreCard } from "./LeadScoreCard";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export const LeadList = () => {
  const [selectedLead, setSelectedLead] = useState<any>(null);

  const { data: leads, isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("score", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Chargement des leads...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total des Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{leads?.length || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Score Moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {leads?.length 
                ? Math.round(leads.reduce((acc, lead) => acc + lead.score, 0) / leads.length)
                : 0}
            </p>
          </CardContent>
        </Card>

        {selectedLead && (
          <LeadScoreCard 
            score={selectedLead.score}
            aiConfidence={75}
            corrections={selectedLead.corrections}
          />
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads?.map((lead) => (
                <TableRow 
                  key={lead.id}
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => setSelectedLead(lead)}
                >
                  <TableCell>{lead.first_name} {lead.last_name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.source}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${
                      lead.score >= 70 ? "text-green-500" : 
                      lead.score >= 40 ? "text-yellow-500" : 
                      "text-red-500"
                    }`}>
                      {lead.score}/100
                    </span>
                  </TableCell>
                  <TableCell>{lead.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};