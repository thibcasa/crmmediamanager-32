import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { supabase } from '@/lib/supabaseClient';

// Initialize Sentry
Sentry.init({
  dsn: "https://your-dsn@sentry.io/your-project-id", // À remplacer par votre DSN Sentry
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
  environment: import.meta.env.MODE,
});

export interface MonitoringConfig {
  pageName?: string;
  enableAutoCorrect?: boolean;
  enablePerformanceTracking?: boolean;
  enableErrorTracking?: boolean;
}

interface MonitoringContextType {
  isEnabled: boolean;
  config?: MonitoringConfig;
  isAuthenticated: boolean;
}

const MonitoringContext = createContext<MonitoringContextType>({
  isEnabled: true,
  isAuthenticated: false
});

interface MonitoringProviderProps {
  children: ReactNode;
  config?: MonitoringConfig;
}

export const MonitoringProvider = ({ children, config }: MonitoringProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check initial auth state
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <MonitoringContext.Provider value={{ 
      isEnabled: true, 
      config,
      isAuthenticated 
    }}>
      {children}
    </MonitoringContext.Provider>
  );
};

export const useMonitoringContext = () => useContext(MonitoringContext);
