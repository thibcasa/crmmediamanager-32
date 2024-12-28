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

interface MonitoringContextType {
  isEnabled: boolean;
}

const MonitoringContext = createContext<MonitoringContextType>({
  isEnabled: true
});

export const MonitoringProvider = ({ children }: { children: ReactNode }) => {
  return (
    <MonitoringContext.Provider value={{ isEnabled: true }}>
      {children}
    </MonitoringContext.Provider>
  );
};

export const useMonitoringContext = () => useContext(MonitoringContext);