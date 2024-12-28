import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LinkedInCallback } from '@/components/linkedin/LinkedInCallback';
import { Toaster } from '@/components/ui/toaster';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RealtimeUpdates } from '@/components/system/RealtimeUpdates';
import Login from '@/pages/Login';
import AiChat from '@/pages/AiChat';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuthStatus } from '@/hooks/useAuthStatus';
import Prospects from '@/pages/Prospects';
import Pipeline from '@/pages/Pipeline';
import Calendar from '@/pages/Calendar';
import Workflow from '@/pages/Workflow';
import { SocialApiSettings } from '@/components/settings/SocialApiSettings';

// Create Properties page component
const Properties = () => (
  <AppLayout>
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Propriétés</h1>
        <p className="text-muted-foreground mt-2">
          Gérez votre portefeuille de biens immobiliers.
        </p>
      </div>
      {/* TODO: Implement properties management interface */}
      <div className="text-center py-12 text-muted-foreground">
        Module en cours de développement
      </div>
    </div>
  </AppLayout>
);

// Create Analytics page component
const Analytics = () => (
  <AppLayout>
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Analyses</h1>
        <p className="text-muted-foreground mt-2">
          Visualisez vos performances et métriques clés.
        </p>
      </div>
      {/* TODO: Implement analytics dashboard */}
      <div className="text-center py-12 text-muted-foreground">
        Module en cours de développement
      </div>
    </div>
  </AppLayout>
);

export default function App() {
  const { isAuthenticated, isLoading } = useAuthStatus();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-sage-500" />
      </div>
    );
  }

  return (
    <Router>
      {isAuthenticated && <RealtimeUpdates />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<LinkedInCallback />} />
        
        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <ProtectedRoute>
                <AppLayout>
                  <AiChat />
                </AppLayout>
              </ProtectedRoute>
            ) : (
              <Login />
            )
          } 
        />
        
        <Route 
          path="/prospects" 
          element={
            isAuthenticated ? (
              <ProtectedRoute>
                <Prospects />
              </ProtectedRoute>
            ) : (
              <Login />
            )
          } 
        />
        
        <Route 
          path="/pipeline" 
          element={
            isAuthenticated ? (
              <ProtectedRoute>
                <Pipeline />
              </ProtectedRoute>
            ) : (
              <Login />
            )
          } 
        />
        
        <Route 
          path="/properties" 
          element={
            isAuthenticated ? (
              <ProtectedRoute>
                <Properties />
              </ProtectedRoute>
            ) : (
              <Login />
            )
          } 
        />
        
        <Route 
          path="/ai-chat" 
          element={
            isAuthenticated ? (
              <ProtectedRoute>
                <AppLayout>
                  <AiChat />
                </AppLayout>
              </ProtectedRoute>
            ) : (
              <Login />
            )
          } 
        />
        
        <Route 
          path="/calendar" 
          element={
            isAuthenticated ? (
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            ) : (
              <Login />
            )
          } 
        />
        
        <Route 
          path="/workflow" 
          element={
            isAuthenticated ? (
              <ProtectedRoute>
                <Workflow />
              </ProtectedRoute>
            ) : (
              <Login />
            )
          } 
        />
        
        <Route 
          path="/api-settings" 
          element={
            isAuthenticated ? (
              <ProtectedRoute>
                <AppLayout>
                  <SocialApiSettings />
                </AppLayout>
              </ProtectedRoute>
            ) : (
              <Login />
            )
          } 
        />
        
        <Route 
          path="/analytics" 
          element={
            isAuthenticated ? (
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            ) : (
              <Login />
            )
          } 
        />
      </Routes>
      <Toaster />
    </Router>
  );
}
