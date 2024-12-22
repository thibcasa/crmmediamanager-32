import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Pipeline from "./pages/Pipeline";
import Prospects from "./pages/Prospects";
import AiChat from "./pages/AiChat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pipeline" element={<Pipeline />} />
        <Route path="/prospects" element={<Prospects />} />
        <Route path="/ai-chat" element={<AiChat />} />
      </Routes>
    </Router>
  );
}

export default App;