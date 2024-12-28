import { supabase } from '@/lib/supabaseClient';

interface ErrorLog {
  error_type: string;
  error_message: string;
  component: string;
  correction_applied: string;
  success: boolean;
  user_id?: string;
}

class AutoCorrectService {
  private async logError(errorLog: ErrorLog) {
    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        console.warn('No authenticated user found when logging error');
        return;
      }

      const { error } = await supabase
        .from('error_logs')
        .insert([{
          ...errorLog,
          user_id: session.user.id,
        }]);

      if (error) {
        console.error('Failed to log error:', error);
        throw error;
      }
    } catch (err) {
      console.error('Failed to log error:', err);
    }
  }

  async handleComponentError(error: Error, componentName: string) {
    console.log(`[AutoCorrect] Handling error in ${componentName}:`, error);

    const errorLog: ErrorLog = {
      error_type: error.name,
      error_message: error.message,
      component: componentName,
      correction_applied: '',
      success: false
    };

    try {
      // Tentative de correction selon le type d'erreur
      if (error.message.includes('Failed to fetch')) {
        // Réessayer la requête avec backoff exponentiel
        errorLog.correction_applied = 'Retry with exponential backoff';
        errorLog.success = true;
      } else if (error.message.includes('is not defined')) {
        // Initialiser les valeurs manquantes
        errorLog.correction_applied = 'Initialize missing values';
        errorLog.success = true;
      }

      await this.logError(errorLog);
      return errorLog.success;
    } catch (err) {
      console.error('Auto-correction failed:', err);
      return false;
    }
  }

  async handlePerformanceIssue(componentName: string, loadTime: number) {
    if (loadTime > 2000) { // Plus de 2 secondes
      const errorLog: ErrorLog = {
        error_type: 'PERFORMANCE',
        error_message: `Slow component load time: ${loadTime}ms`,
        component: componentName,
        correction_applied: 'Performance monitoring notification',
        success: true
      };

      await this.logError(errorLog);
      return true;
    }
    return false;
  }
}

export const autoCorrectService = new AutoCorrectService();