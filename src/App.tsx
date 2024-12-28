import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AppLayout } from "./components/layout/AppLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Pipeline from "./pages/Pipeline";
import Prospects from "./pages/Prospects";
import Workflow from "./pages/Workflow";
import AiChat from "./pages/AiChat";
import Calendar from "./pages/Calendar";
import Campaigns from "./pages/Campaigns";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Routes>
                  <Route index element={<Index />} />
                  <Route path="pipeline" element={<Pipeline />} />
                  <Route path="prospects" element={<Prospects />} />
                  <Route path="workflow" element={<Workflow />} />
                  <Route path="ai-chat" element={<AiChat />} />
                  <Route path="calendar" element={<Calendar />} />
                  <Route path="campaigns" element={<Campaigns />} />
                </Routes>
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;