import { Card } from "@/components/ui/card";
import { Prospect } from '@/services/ProspectService';
import { UsersIcon, TrendingUpIcon, CheckCircleIcon, XCircleIcon } from "lucide-react";

interface ProspectStatsProps {
  prospects: Prospect[];
}

export const ProspectStats = ({ prospects }: ProspectStatsProps) => {
  const stats = {
    total: prospects.length,
    avgScore: Math.round(prospects.reduce((acc, p) => acc + p.score, 0) / prospects.length) || 0,
    converted: prospects.filter(p => p.status === 'converted').length,
    lost: prospects.filter(p => p.status === 'lost').length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <UsersIcon className="h-5 w-5 text-blue-500" />
          <div>
            <p className="text-sm font-medium text-gray-500">Total Prospects</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <TrendingUpIcon className="h-5 w-5 text-yellow-500" />
          <div>
            <p className="text-sm font-medium text-gray-500">Score Moyen</p>
            <p className="text-2xl font-bold">{stats.avgScore}</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <CheckCircleIcon className="h-5 w-5 text-green-500" />
          <div>
            <p className="text-sm font-medium text-gray-500">Convertis</p>
            <p className="text-2xl font-bold">{stats.converted}</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <XCircleIcon className="h-5 w-5 text-red-500" />
          <div>
            <p className="text-sm font-medium text-gray-500">Perdus</p>
            <p className="text-2xl font-bold">{stats.lost}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};