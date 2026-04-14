import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sounds from './pages/Sounds';
import Screens from './pages/Screens';
import Stage from './pages/Stage';
import Explorations from './pages/Explorations';
import CaseStudyTemplate from './pages/CaseStudyTemplate';
import Home from './pages/Home';
import IntroExperience from './components/IntroExperience';
import SmoothScroll from './components/SmoothScroll';
import ErrorBoundary from './components/ErrorBoundary';
import { LayoutDebuggerProvider } from './components/LayoutDebugger';
import { PasswordGateProvider } from './components/PasswordGate';
import { ConstructionGateProvider } from './components/ConstructionGate';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-brand-light text-brand-ink transition-colors duration-500 overflow-x-hidden">
      <Navbar show={true} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/sounds" element={<Sounds />} />
          <Route path="/screens" element={<Screens />} />
          <Route path="/stage" element={<Stage />} />
          <Route path="/explorations" element={<Explorations />} />
          <Route path="/work/:projectId" element={<CaseStudyTemplate />} />
          <Route path="/case-study-template" element={<CaseStudyTemplate />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  );
};

function App() {
  const [showIntro, setShowIntro] = React.useState(false); // Disabled per user request
  const [introSkipped, setIntroSkipped] = React.useState(true); // Treat as implicitly skipped

  return (
    <ErrorBoundary>
      <LayoutDebuggerProvider>
        <Router>
          <PasswordGateProvider>
            <ConstructionGateProvider>
            <SmoothScroll />
            {showIntro ? (
              <IntroExperience onComplete={(skipped) => {
                if (skipped) setIntroSkipped(true);
                setShowIntro(false);
              }} />
            ) : (
              <Layout introSkipped={introSkipped} />
            )}
            </ConstructionGateProvider>
          </PasswordGateProvider>
        </Router>
      </LayoutDebuggerProvider>
    </ErrorBoundary>
  );
}

export default App;