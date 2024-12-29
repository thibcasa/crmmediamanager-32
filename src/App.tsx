import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { MonitoringProvider } from "./monitoring/MonitoringProvider";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Prospects from "./pages/Prospects";
import Properties from "./pages/Properties";
import AiChat from "./pages/AiChat";
import Calendar from "./pages/Calendar";
import ApiSettings from "./pages/ApiSettings";
import Meetings from "./pages/Meetings";
import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MonitoringProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Index />} />
              <Route path="prospects" element={<Prospects />} />
              <Route path="properties" element={<Properties />} />
              <Route path="ai-chat" element={<AiChat />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="api-settings" element={<ApiSettings />} />
              <Route path="meetings" element={<Meetings />} />
            </Route>
          </Routes>
          <Toaster />
        </BrowserRouter>
      </MonitoringProvider>
    </QueryClientProvider>
  );
}

export default App;