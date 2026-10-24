import React, { useState, useEffect } from 'react';
import RitviAssistant from '@/components/ritvi/RitviAssistant';
import RitviAvatar from '@/components/ritvi/RitviAvatar';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import { AppProvider } from '@/lib/AppContext';

// Add page imports here
// Main Root Pages
import AppLayout from "@/components/layout/AppLayout";
import Home from "@/pages/Home";
import CycleTracker from "@/pages/CycleTracker";
import Journal from "@/pages/Journal";
import Learn from "@/pages/Learn";
import Privacy from "@/pages/Privacy";

// Pregnancy Specific Pages
import PregnancyDashboard from "@/pages/pregnancy/PregnancyDashboard";
import PregnancyGuide from "@/pages/pregnancy/PregnancyGuide";
import PregnancyCalendar from "@/pages/pregnancy/PregnancyCalendar";
import PregnancyJournal from "@/pages/pregnancy/PregnancyJournal";
import BirthPrep from "@/pages/pregnancy/BirthPrep";
import PregnancySettings from "@/pages/pregnancy/PregnancySettings";

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <AppProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cycle" element={<CycleTracker />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/pregnancy" element={<PregnancyDashboard />} />
          <Route path="/pregnancy/guide" element={<PregnancyGuide />} />
          <Route path="/pregnancy/calendar" element={<PregnancyCalendar />} />
          <Route path="/pregnancy/journal" element={<PregnancyJournal />} />
          <Route path="/pregnancy/birth" element={<BirthPrep />} />
          <Route path="/pregnancy/settings" element={<PregnancySettings />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AppProvider>
  );
};

function App() {
  const [isRitviOpen, setIsRitviOpen] = useState(false);

  // Global listener: Home page aur pure project ke kisi bhi "Ask Ritvi" button ko sync karega
  useEffect(() => {
    const handleOpenRitvi = () => {
      console.log("Global Ritvi event triggered!");
      setIsRitviOpen(true);
    };

    window.addEventListener('open-ritvi-chat', handleOpenRitvi);
    return () => window.removeEventListener('open-ritvi-chat', handleOpenRitvi);
  }, []);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />

          {/* Global Clickable Ask Ritvi Button */}
          <button
            type="button"
            onClick={() => {
              console.log("Ritvi Clicked!");
              setIsRitviOpen(true);
            }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-white/95 px-4 py-2.5 shadow-2xl border border-rose-200 backdrop-blur-md cursor-pointer hover:scale-105 active:scale-95 transition-all text-left"
          >
            <RitviAvatar size={34} />
            <div className="text-left pr-1">
              <p className="text-xs font-bold text-[#3A1D28]">Ask Ritvi</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-rose-500">Always Awake</p>
            </div>
          </button>

          {/* Assistant Modal */}
          <RitviAssistant
            isOpen={isRitviOpen}
            onClose={() => setIsRitviOpen(false)}
          />

        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;