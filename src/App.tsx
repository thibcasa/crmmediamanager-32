import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LinkedInCallback } from '@/components/linkedin/LinkedInCallback';
import { Toaster } from '@/components/ui/toaster';
import Login from '@/pages/Login';
import AiChat from '@/pages/AiChat';
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
        <Route path="/" element={isAuthenticated ? <AiChat /> : <Login />} />
        <Route path="/ai-chat" element={isAuthenticated ? <AiChat /> : <Login />} />
      </Routes>
      <Toaster />
    </Router>
  );
}