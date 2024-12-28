import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Pipeline from "./pages/Pipeline";
import Prospects from "./pages/Prospects";
import Workflow from "./pages/Workflow";
import AiChat from "./pages/AiChat";
import Calendar from "./pages/Calendar";
import Campaigns from "./pages/Campaigns";
import ApiSettings from "./pages/ApiSettings";
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
            <Route path="pipeline" element={<Pipeline />} />
            <Route path="prospects" element={<Prospects />} />
            <Route path="workflow" element={<Workflow />} />
            <Route path="ai-chat" element={<AiChat />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="campaigns" element={<Campaigns />} />
            <Route path="api-settings" element={<ApiSettings />} />
          </Route>
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;