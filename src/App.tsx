import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AiChat from "./pages/AiChat";
import Calendar from "./pages/Calendar";
import Properties from "./pages/Properties";
import Prospects from "./pages/Prospects";
import ApiSettings from "./pages/ApiSettings";
import EmailMarketing from "./pages/EmailMarketing";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Index />} />
          <Route path="ai-chat" element={<AiChat />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="properties" element={<Properties />} />
          <Route path="prospects" element={<Prospects />} />
          <Route path="leads" element={<Prospects />} />
          <Route path="email" element={<EmailMarketing />} />
          <Route path="settings/api" element={<ApiSettings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;