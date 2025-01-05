import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";

export const NavigationMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    { label: 'Tableau de bord', route: '/dashboard' },
    { label: 'Campagnes', route: '/campaigns' },
    { label: 'Analytics', route: '/analytics' }
  ];

  return (
    <nav className="flex gap-2">
      {menuItems.map(item => (
        <Button
          key={item.route}
          variant={location.pathname === item.route ? "default" : "outline"}
          size="sm"
          onClick={() => navigate(item.route)}
        >
          {item.label}
        </Button>
      ))}
    </nav>
  );
};