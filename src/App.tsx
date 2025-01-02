import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import Login from './pages/Login';
import AiChat from './pages/AiChat';
import Dashboard from './pages/Dashboard';
import Prospects from './pages/Prospects';
import Settings from './pages/Settings';
import SubjectModule from './pages/modules/SubjectModule';
import TitleModule from './pages/modules/TitleModule';
import ContentModule from './pages/modules/ContentModule';
import CreativeModule from './pages/modules/CreativeModule';
import WorkflowModule from './pages/modules/WorkflowModule';
import PipelineModule from './pages/modules/PipelineModule';
import PredictiveModule from './pages/modules/PredictiveModule';
import CorrectionModule from './pages/modules/CorrectionModule';
import { useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  useEffect(() => {
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user?.email);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes wrapped in AppLayout */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/prospects" element={<Prospects />} />
          <Route path="/ai-chat" element={<AiChat />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* Module routes */}
          <Route path="/modules/subject" element={<SubjectModule />} />
          <Route path="/modules/title" element={<TitleModule />} />
          <Route path="/modules/content" element={<ContentModule />} />
          <Route path="/modules/creative" element={<CreativeModule />} />
          <Route path="/modules/workflow" element={<WorkflowModule />} />
          <Route path="/modules/pipeline" element={<PipelineModule />} />
          <Route path="/modules/predictive" element={<PredictiveModule />} />
          <Route path="/modules/correction" element={<CorrectionModule />} />
        </Route>

        {/* Redirect to login if not authenticated */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;