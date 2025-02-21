
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IndexPage from './pages/Index';
import ExtractedContent from './pages/ExtractedContent';
import SavedContent from './pages/SavedContent';
import NotFound from './pages/NotFound';
import { Toaster } from '@/components/ui/toaster';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/extracted-content" element={<ExtractedContent />} />
        <Route path="/saved-content" element={<SavedContent />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
