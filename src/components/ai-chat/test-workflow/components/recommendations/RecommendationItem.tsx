import { LucideIcon } from "lucide-react";

interface RecommendationItemProps {
  icon: LucideIcon;
  text: string;
  color: string;
}

export const RecommendationItem = ({ icon: Icon, text, color }: RecommendationItemProps) => {
  return (
    <li className="text-sm flex items-center gap-2">
      <Icon className={`h-4 w-4 text-${color}-500`} />
      {text}
    </li>
  );
};