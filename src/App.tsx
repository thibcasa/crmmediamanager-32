import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LinkedInCallback } from '@/components/linkedin/LinkedInCallback';
import { Toaster } from '@/components/ui/toaster';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Login from '@/pages/Login';
import AiChat from '@/pages/AiChat';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuthStatus } from '@/hooks/useAuthStatus';

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
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<LinkedInCallback />} />
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
      </Routes>
      <Toaster />
    </Router>
  );
}