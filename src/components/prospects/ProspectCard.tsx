import { Prospect } from '@/services/ProspectService';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ProspectCardProps {
  prospect: Prospect;
  onScheduleMeeting: (prospectId: string) => void;
}

export const ProspectCard = ({ prospect, onScheduleMeeting }: ProspectCardProps) => {
  return (
    <Card key={prospect.id} className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">{prospect.first_name} {prospect.last_name}</p>
          <p className="text-sm text-gray-600">{prospect.email}</p>
          <div className="mt-2 flex gap-2">
            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
              Score: {prospect.score}
            </span>
            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
              Status: {prospect.status}
            </span>
          </div>
        </div>
        <Button 
          onClick={() => onScheduleMeeting(prospect.id)}
          variant="outline"
          size="sm"
        >
          Programmer RDV
        </Button>
      </div>
    </Card>
  );
};