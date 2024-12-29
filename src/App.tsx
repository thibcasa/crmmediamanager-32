import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AiChat from "@/pages/AiChat";
import Calendar from "@/pages/Calendar";
import Prospects from "@/pages/Prospects";
import ApiSettings from "@/pages/ApiSettings";
import Login from "@/pages/Login";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Erreur de vérification de session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/ai-chat" replace />} />
        <Route element={isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />}>
          <Route path="/ai-chat" element={<AiChat />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/prospects" element={<Prospects />} />
          <Route path="/api-settings" element={<ApiSettings />} />
          <Route path="*" element={<Navigate to="/ai-chat" replace />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;