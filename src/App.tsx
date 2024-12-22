import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Pipeline from "./pages/Pipeline";
import Prospects from "./pages/Prospects";
import AiChat from "./pages/AiChat";
import Calendar from "./pages/Calendar";
import Workflow from "./pages/Workflow";

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
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/prospects" element={<Prospects />} />
          <Route path="/ai-chat" element={<AiChat />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/workflow" element={<Workflow />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;