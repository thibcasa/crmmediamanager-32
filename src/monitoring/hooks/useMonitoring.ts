import { useEffect } from 'react';
import * as Sentry from "@sentry/react";

interface MonitoringOptions {
  componentName: string;
  enablePerformance?: boolean;
  enableErrorTracking?: boolean;
}

export const useMonitoring = ({ 
  componentName, 
  enablePerformance = true, 
  enableErrorTracking = true 
}: MonitoringOptions) => {
  useEffect(() => {
    const startTime = performance.now();
    console.log(`[Monitoring] ${componentName} mounted`);

    return () => {
      const duration = performance.now() - startTime;
      console.log(`[Monitoring] ${componentName} unmounted after ${Math.round(duration)}ms`);
    };
  }, [componentName]);

  const trackEvent = (eventName: string, data?: Record<string, any>) => {
    console.log(`[Monitoring] Event in ${componentName}:`, eventName, data);
    
    // Send to Sentry
    Sentry.addBreadcrumb({
      category: 'user-action',
      message: eventName,
      data,
      level: 'info',
    });
  };

  const trackError = (error: Error, context?: Record<string, any>) => {
    console.error(`[Monitoring] Error in ${componentName}:`, error);
    
    if (enableErrorTracking) {
      Sentry.withScope(scope => {
        scope.setTag('component', componentName);
        if (context) {
          scope.setContext('additional', context);
        }
        Sentry.captureException(error);
      });
    }
  };

  return {
    trackEvent,
    trackError
  };
};