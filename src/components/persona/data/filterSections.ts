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

export const filterSections = [
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
  {
    title: "Professionnel",
    icon: <Briefcase className="w-5 h-5 text-primary" />,
    filters: [
      { id: "job-unemployed", label: "Sans emploi", value: "unemployed" },
      { id: "job-student", label: "Étudiant", value: "student" },
      { id: "job-worker", label: "Ouvrier", value: "worker" },
      { id: "job-employee", label: "Employé", value: "employee" },
      { id: "job-technician", label: "Technicien", value: "technician" },
      { id: "job-executive", label: "Cadre", value: "executive" },
      { id: "job-senior-executive", label: "Cadre supérieur", value: "senior-executive" },
      { id: "job-director", label: "Directeur", value: "director" },
      { id: "job-ceo", label: "PDG", value: "ceo" },
      { id: "job-entrepreneur", label: "Entrepreneur", value: "entrepreneur" },
      { id: "job-freelance", label: "Freelance", value: "freelance" },
      { id: "job-consultant", label: "Consultant", value: "consultant" },
      { id: "job-retired", label: "Retraité", value: "retired" },
      { id: "job-civil-servant", label: "Fonctionnaire", value: "civil-servant" },
      { id: "job-liberal", label: "Profession libérale", value: "liberal" }
    ]
  },
  {
    title: "Éducation",
    icon: <GraduationCap className="w-5 h-5 text-primary" />,
    filters: [
      { id: "edu-none", label: "Sans diplôme", value: "none" },
      { id: "edu-brevet", label: "Brevet des collèges", value: "brevet" },
      { id: "edu-cap", label: "CAP/BEP", value: "cap" },
      { id: "edu-bac", label: "Baccalauréat", value: "bac" },
      { id: "edu-bac2", label: "Bac+2 (DUT, BTS)", value: "bac2" },
      { id: "edu-bachelor", label: "Licence / Bachelor", value: "bachelor" },
      { id: "edu-master", label: "Master", value: "master" },
      { id: "edu-engineering", label: "École d'ingénieur", value: "engineering" },
      { id: "edu-business", label: "École de commerce", value: "business" },
      { id: "edu-phd", label: "Doctorat", value: "phd" },
      { id: "edu-self", label: "Autodidacte", value: "self-taught" },
      { id: "edu-professional", label: "Formation professionnelle", value: "professional" }
    ]
  },
  {
    title: "Revenus",
    icon: <DollarSign className="w-5 h-5 text-primary" />,
    filters: [
      { id: "income-low", label: "< 2000€/mois", value: "low" },
      { id: "income-medium-low", label: "2000€ - 3000€/mois", value: "medium-low" },
      { id: "income-medium", label: "3000€ - 5000€/mois", value: "medium" },
      { id: "income-medium-high", label: "5000€ - 8000€/mois", value: "medium-high" },
      { id: "income-high", label: "8000€ - 12000€/mois", value: "high" },
      { id: "income-very-high", label: "12000€+/mois", value: "very-high" }
    ]
  }
];
