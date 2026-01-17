import React, { useState, useEffect } from 'react';
import {
  AppState,
  UserInput,
  GeneratedResult,
  LandscapingStyle,
  User
} from './types';

import { InputForm } from './components/InputForm';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { LandingPage } from './components/LandingPage';
import { BillingDashboard } from './components/BillingDashboard';
import { AuthModal } from './components/AuthModal';
import { ApiKeyModal } from './components/ApiKeyModal';

import { generateLandscapeVisualization } from './services/geminiService';
import { createCheckoutSession } from './services/stripeService';

import {
  Sprout,
  RefreshCw,
  ArrowLeft,
  Download,
  AlertTriangle,
  LogOut,
  CreditCard
} from 'lucide-react';

const STYLES_MAP: Record<string, LandscapingStyle> = {
  modern: {
    id: 'modern',
    name: 'Modern Minimalist',
    description: '',
    promptModifier:
      'Modern minimalist garden, clean geometry, concrete pavers, structured planting, neutral tones'
  },
  tropical: {
    id: 'tropical',
    name: 'Tropical Resort',
    description: '',
    promptModifier:
      'Tropical resort garden, lush greenery, palms, timber decking, vibrant planting'
  },
  rustic: {
    id: 'rustic',
    name: 'Rustic Cottage',
    description: '',
    promptModifier:
      'Rustic cottage garden, natural stone, wildflowers, winding paths, cozy atmosphere'
  },
  entertainment: {
    id: 'entertainment',
    name: 'Entertainer',
    description: '',
    promptModifier:
      'Outdoor entertaining space, large patio, BBQ area, fire pit, seating zones'
  }
};

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApiKeyReady, setIsApiKeyReady] = useState(false);

  const [userInput, setUserInput] = useState<UserInput>({
    image: null,
    prompt: '',
    styleId: 'modern'
  });

  const [result, setResult] = useState<GeneratedResult | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('dreamscapers_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    if ((window as any).aistudio?.hasSelectedApiKey) {
      (window as any).aistudio.hasSelectedApiKey().then(setIsApiKeyReady);
    }
  }, []);

  const handleLaunchApp = () => {
    if (!user) {
      setShowAuthModal(true);
    } else if (user.subscriptionStatus === 'NONE') {
      handleStartTrial();
    } else {
      setAppState(AppState.INPUT);
    }
  };

  const handleAuthSuccess = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('dreamscapers_user', JSON.stringify(newUser));
    setShowAuthModal(false);
    handleStartTrial();
  };

  const handleStartTrial = async () => {
    if (!user) return;
    await createCheckoutSession(user.email);
    const updated = { ...user, subscriptionStatus: 'TRIALING' };
    setUser(updated);
    localStorage.setItem('dreamscapers_user', JSON.stringify(updated));
    setAppState(AppState.INPUT);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('dreamscapers_user');
    setAppState(AppState.LANDING);
    setShowUserMenu(false);
  };

  const handleSubmit = async () => {
    if (!userInput.image || !userInput.prompt) return;

    setAppState(AppState.PROCESSING);
    setError(null);

    try {
      const style = STYLES_MAP[userInput.styleId];
      const generatedImage = await generateLandscapeVisualization(
        userInput.image,
        userInput.prompt,
        style.promptModifier
      );

      setResult({
        originalImage: userInput.image,
        generatedImage,
        promptUsed: userInput.prompt
      });

      setAppState(AppState.RESULT);
    } catch (e: any) {
      setError(e.message || 'Failed to generate design.');
      setAppState(AppState.INPUT);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {!isApiKeyReady && appState !== AppState.LANDING && (
        <ApiKeyModal onKeySelected={() => setIsApiKeyReady(true)} />
      )}

      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto h-16 px-4 flex justify-between items-center">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setAppState(AppState.LANDING)}
          >
            <div className="bg-emerald-600 p-1.5 rounded text-white">
              <Sprout size={22} />
            </div>
            <span className="font-bold text-lg">DreamScapers</span>
          </div>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full"
              >
                <span className="text-xs font-bold uppercase">
                  {user.name.split(' ')[0]}
                </span>
                <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
                  {user.name[0]}
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                  <button
                    className="w-full px-4 py-2 text-sm flex gap-2 hover:bg-slate-50"
                    onClick={() => setAppState(AppState.BILLING)}
                  >
                    <CreditCard size={16} /> Billing
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm text-red-600 flex gap-2 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      <main className="flex-grow">
        {appState === AppState.LANDING && (
          <LandingPage onLaunchApp={handleLaunchApp} />
        )}

        {appState === AppState.INPUT && (
          <div className="max-w-4xl mx-auto p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded flex gap-2">
                <AlertTriangle size={20} /> {error}
              </div>
            )}
            <InputForm
              input={userInput}
              setInput={setUserInput}
              onSubmit={handleSubmit}
            />
          </div>
        )}

        {appState === AppState.PROCESSING && (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin border-4 border-emerald-500 border-t-transparent rounded-full w-16 h-16" />
          </div>
        )}

        {appState === AppState.RESULT && result && (
          <div className="max-w-6xl mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setAppState(AppState.INPUT)}
                className="flex gap-1 text-slate-600 hover:text-emerald-600"
              >
                <ArrowLeft size={16} /> Edit
              </button>

              <a
                href={result.generatedImage}
                download="dreamscape.png"
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex gap-2"
              >
                <Download size={16} /> Download
              </a>
            </div>

            <BeforeAfterSlider
              beforeImage={result.originalImage}
              afterImage={result.generatedImage}
            />
          </div>
        )}

        {appState === AppState.BILLING && user && (
          <BillingDashboard user={user} />
        )}
      </main>
    </div>
  );
}

export default App;
