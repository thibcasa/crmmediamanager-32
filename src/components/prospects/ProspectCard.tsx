import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, Mail, Calendar, MessageSquare } from 'lucide-react';
import { Prospect } from '@/services/ProspectService';

interface ProspectCardProps {
  prospect: Prospect;
  onScheduleMeeting: (prospectId: string) => void;
  onGenerateStrategy: (prospect: Prospect) => void;
  isGeneratingStrategy: boolean;
  getQualificationColor: (qualification: string) => string;
}

export const ProspectCard = ({ 
  prospect, 
  onScheduleMeeting, 
  onGenerateStrategy,
  isGeneratingStrategy,
  getQualificationColor 
}: ProspectCardProps) => {
  return (
    <Card key={prospect.id} className="p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-lg">
                {prospect.first_name} {prospect.last_name}
              </p>
              <Badge className={getQualificationColor(prospect.qualification)}>
                {prospect.qualification?.charAt(0).toUpperCase() + prospect.qualification?.slice(1)}
              </Badge>
            </div>
            
            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{prospect.email}</span>
              </div>
              {prospect.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{prospect.phone}</span>
                </div>
              )}
            </div>

            <div className="mt-3 flex gap-2 flex-wrap">
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                Score: {prospect.score}
              </span>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                Source: {prospect.source}
              </span>
              {prospect.notes && (
                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                  <MessageSquare className="w-3 h-3 inline mr-1" />
                  Notes disponibles
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => onGenerateStrategy(prospect)}
              variant="outline"
              size="sm"
              disabled={isGeneratingStrategy}
            >
              Générer Stratégie
            </Button>
            <Button 
              onClick={() => onScheduleMeeting(prospect.id)}
              variant="outline"
              size="sm"
            >
              <Calendar className="w-4 h-4 mr-2" />
              RDV
            </Button>
          </div>
        </div>

        {prospect.notes && (
          <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm">
            <p className="font-medium mb-1">Notes:</p>
            <p className="text-gray-600">{prospect.notes}</p>
          </div>
        )}
      </div>
    </Card>
  );
};