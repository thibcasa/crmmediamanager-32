import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Prospects from "./pages/Prospects";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/prospects" element={<Prospects />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;