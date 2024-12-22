import { Prospect } from '@/services/ProspectService';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";

interface ProspectCardProps {
  prospect: Prospect;
  onScheduleMeeting: (prospectId: string) => void;
}

export const ProspectCard = ({ prospect, onScheduleMeeting }: ProspectCardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 50) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getStatusColor = (status: string) => {
    const colors = {
      cold: "bg-blue-100 text-blue-800",
      warm: "bg-yellow-100 text-yellow-800",
      hot: "bg-red-100 text-red-800",
      converted: "bg-green-100 text-green-800",
      lost: "bg-gray-100 text-gray-800"
    };
    return colors[status as keyof typeof colors] || colors.cold;
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div>
            <h3 className="font-medium text-lg">
              {prospect.first_name} {prospect.last_name}
            </h3>
            <p className="text-sm text-gray-600">{prospect.email}</p>
            {prospect.phone && (
              <p className="text-sm text-gray-600">{prospect.phone}</p>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary" className={getScoreColor(prospect.score)}>
              Score: {prospect.score}
            </Badge>
            <Badge variant="secondary" className={getStatusColor(prospect.status)}>
              {prospect.status.charAt(0).toUpperCase() + prospect.status.slice(1)}
            </Badge>
            <Badge variant="outline">
              {prospect.source}
            </Badge>
          </div>
          {prospect.notes && (
            <p className="text-sm text-gray-600 mt-2">{prospect.notes}</p>
          )}
        </div>
        <Button 
          onClick={() => onScheduleMeeting(prospect.id)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <CalendarIcon className="h-4 w-4" />
          Programmer RDV
        </Button>
      </div>
    </Card>
  );
};