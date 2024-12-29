import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Toaster } from "@/components/ui/toaster";
import AiChat from "@/pages/AiChat";
import Calendar from "@/pages/Calendar";
import Prospects from "@/pages/Prospects";
import ApiSettings from "@/pages/ApiSettings";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/ai-chat" element={<AiChat />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/prospects" element={<Prospects />} />
          <Route path="/api-settings" element={<ApiSettings />} />
          <Route path="*" element={<AiChat />} /> {/* Redirect to AI Chat by default */}
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;