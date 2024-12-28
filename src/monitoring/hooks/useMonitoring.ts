import { useEffect } from 'react';
import * as Sentry from "@sentry/react";
import { autoCorrectService } from '../services/AutoCorrectService';

interface MonitoringOptions {
  componentName: string;
  enablePerformance?: boolean;
  enableErrorTracking?: boolean;
  enableAutoCorrect?: boolean;
}

export const useMonitoring = ({ 
  componentName, 
  enablePerformance = true, 
  enableErrorTracking = true,
  enableAutoCorrect = true
}: MonitoringOptions) => {
  useEffect(() => {
    const startTime = performance.now();
    console.log(`[Monitoring] ${componentName} mounted`);

    return () => {
      const duration = performance.now() - startTime;
      console.log(`[Monitoring] ${componentName} unmounted after ${Math.round(duration)}ms`);
      
      if (enablePerformance && enableAutoCorrect) {
        autoCorrectService.handlePerformanceIssue(componentName, duration);
      }
    };
  }, [componentName, enablePerformance, enableAutoCorrect]);

  const trackEvent = (eventName: string, data?: Record<string, any>) => {
    console.log(`[Monitoring] Event in ${componentName}:`, eventName, data);
    
    Sentry.addBreadcrumb({
      category: 'user-action',
      message: eventName,
      data,
      level: 'info',
    });
  };

  const trackError = async (error: Error, context?: Record<string, any>) => {
    console.error(`[Monitoring] Error in ${componentName}:`, error);
    
    if (enableErrorTracking) {
      Sentry.withScope(scope => {
        scope.setTag('component', componentName);
        if (context) {
          scope.setContext('additional', context);
        }
        Sentry.captureException(error);
      });

      if (enableAutoCorrect) {
        const corrected = await autoCorrectService.handleComponentError(error, componentName);
        if (!corrected) {
          // Si la correction automatique échoue, on notifie Sentry
          Sentry.captureMessage(`Auto-correction failed for ${componentName}`, 'error');
        }
      }
    }
  };

  return {
    trackEvent,
    trackError
  };
};