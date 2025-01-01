import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Prospects from './pages/Prospects';
import AiChat from './pages/AiChat';
import Settings from './pages/Settings';
import SubjectModule from './pages/modules/SubjectModule';
import TitleModule from './pages/modules/TitleModule';
import ContentModule from './pages/modules/ContentModule';
import CreativeModule from './pages/modules/CreativeModule';
import WorkflowModule from './pages/modules/WorkflowModule';
import PipelineModule from './pages/modules/PipelineModule';
import PredictiveModule from './pages/modules/PredictiveModule';
import CorrectionModule from './pages/modules/CorrectionModule';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/prospects" element={<Prospects />} />
          <Route path="/ai-chat" element={<AiChat />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/modules/subject" element={<SubjectModule />} />
          <Route path="/modules/title" element={<TitleModule />} />
          <Route path="/modules/content" element={<ContentModule />} />
          <Route path="/modules/creative" element={<CreativeModule />} />
          <Route path="/modules/workflow" element={<WorkflowModule />} />
          <Route path="/modules/pipeline" element={<PipelineModule />} />
          <Route path="/modules/predictive" element={<PredictiveModule />} />
          <Route path="/modules/correction" element={<CorrectionModule />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;