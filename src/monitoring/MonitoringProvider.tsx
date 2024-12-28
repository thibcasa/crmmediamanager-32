import { createContext, useContext, ReactNode } from 'react';
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

// Initialize Sentry
Sentry.init({
  dsn: "https://your-dsn@sentry.io/your-project-id", // À remplacer par votre DSN Sentry
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
  environment: import.meta.env.MODE,
});

interface MonitoringConfig {
  pageName?: string;
  enableAutoCorrect?: boolean;
  enablePerformanceTracking?: boolean;
  enableErrorTracking?: boolean;
}

interface MonitoringContextType {
  isEnabled: boolean;
  config?: MonitoringConfig;
}

const MonitoringContext = createContext<MonitoringContextType>({
  isEnabled: true
});

interface MonitoringProviderProps {
  children: ReactNode;
  config?: MonitoringConfig;
}

export const MonitoringProvider = ({ children, config }: MonitoringProviderProps) => {
  return (
    <MonitoringContext.Provider value={{ isEnabled: true, config }}>
      {children}
    </MonitoringContext.Provider>
  );
};

export const useMonitoringContext = () => useContext(MonitoringContext);