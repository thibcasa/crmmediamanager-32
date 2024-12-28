import { useState } from 'react';
import { PersonaFilterSection } from './filters/PersonaFilterSection';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  Users, 
  Target, 
  Globe, 
  Briefcase, 
  Heart,
  DollarSign,
  GraduationCap,
  Clock,
  MessageCircle
} from 'lucide-react';

const filterSections = [
  {
    title: "Données Démographiques",
    icon: <Users className="w-5 h-5 text-primary" />,
    filters: [
      { id: "age-18-24", label: "18-24 ans", value: "18-24" },
      { id: "age-25-34", label: "25-34 ans", value: "25-34" },
      { id: "age-35-44", label: "35-44 ans", value: "35-44" },
      { id: "age-45-54", label: "45-54 ans", value: "45-54" },
      { id: "age-55-plus", label: "55+ ans", value: "55+" },
      { id: "status-single", label: "Célibataire", value: "single" },
      { id: "status-couple", label: "En couple", value: "couple" },
      { id: "status-family", label: "Avec enfants", value: "family" },
    ]
  },
  {
    title: "Comportements",
    icon: <Target className="w-5 h-5 text-primary" />,
    filters: [
      { id: "platform-instagram", label: "Utilise Instagram", value: "instagram" },
      { id: "platform-facebook", label: "Utilise Facebook", value: "facebook" },
      { id: "platform-linkedin", label: "Utilise LinkedIn", value: "linkedin" },
      { id: "usage-daily", label: "Utilisation quotidienne", value: "daily" },
      { id: "usage-weekly", label: "Utilisation hebdomadaire", value: "weekly" },
      { id: "content-video", label: "Préfère les vidéos", value: "video" },
      { id: "content-text", label: "Préfère les articles", value: "text" },
    ]
  },
  {
    title: "Intérêts",
    icon: <Heart className="w-5 h-5 text-primary" />,
    filters: [
      { id: "interest-realestate", label: "Immobilier", value: "realestate" },
      { id: "interest-investment", label: "Investissement", value: "investment" },
      { id: "interest-luxury", label: "Luxe", value: "luxury" },
      { id: "interest-tech", label: "Technologie", value: "tech" },
      { id: "interest-travel", label: "Voyage", value: "travel" },
      { id: "interest-architecture", label: "Architecture", value: "architecture" },
      { id: "interest-interior-design", label: "Décoration intérieure", value: "interior-design" },
      { id: "interest-sustainable-living", label: "Habitat durable", value: "sustainable-living" },
      { id: "interest-smart-home", label: "Maison connectée", value: "smart-home" },
      { id: "interest-property-management", label: "Gestion locative", value: "property-management" },
      { id: "interest-renovation", label: "Rénovation", value: "renovation" },
      { id: "interest-gastronomy", label: "Gastronomie", value: "gastronomy" },
      { id: "interest-wine", label: "Vin & Spiritueux", value: "wine" },
      { id: "interest-art", label: "Art & Culture", value: "art" },
      { id: "interest-golf", label: "Golf", value: "golf" },
      { id: "interest-yachting", label: "Yachting", value: "yachting" },
      { id: "interest-wellness", label: "Bien-être", value: "wellness" },
      { id: "interest-finance", label: "Finance", value: "finance" },
      { id: "interest-entrepreneurship", label: "Entrepreneuriat", value: "entrepreneurship" },
      { id: "interest-eco-living", label: "Mode de vie écologique", value: "eco-living" }
    ]
  },
];

export const PersonaFilterManager = () => {
  const { toast } = useToast();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleFilterChange = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const handleApplyFilters = async () => {
    try {
      toast({
        title: "Filtres appliqués",
        description: `${selectedFilters.length} filtres sélectionnés`
      });
    } catch (error) {
      console.error('Error applying filters:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'appliquer les filtres",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filterSections.map((section) => (
          <PersonaFilterSection
            key={section.title}
            section={section}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
          />
        ))}
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleApplyFilters}
          className="flex items-center gap-2"
        >
          <Target className="w-4 h-4" />
          Appliquer les filtres ({selectedFilters.length})
        </Button>
      </div>
    </div>
  );
};
