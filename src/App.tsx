import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import AiChat from '@/pages/AiChat';
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/ai-chat" element={<AiChat />} />
        </Routes>
      </AppLayout>
      <Toaster />
    </Router>
  );
}

export default App;
