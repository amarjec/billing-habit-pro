import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download as DownloadIcon,
  CheckCircle2,
  Store,
  Zap,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext.jsx';

const LandingPage = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isReadyForInstall, setIsReadyForInstall] = useState(false);
  const [installStatus, setInstallStatus] = useState('idle');
  const [progress, setProgress] = useState(0);

  /* ------------------- Install Prompt Listener ------------------- */
  useEffect(() => {
    // Check if already in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
       navigate(user ? '/home' : '/login', { replace: true });
       return;
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsReadyForInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () =>
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
  }, [user, navigate]);

  /* ------------------- Fake Install Progress ------------------- */
  const startFakeInstall = () => {
    setInstallStatus('downloading');
    let currentProgress = 0;

    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 10) + 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setInstallStatus('installed');

        setTimeout(() => {
          navigate(user ? '/home' : '/login', { replace: true });
        }, 1500);
      }
      setProgress(currentProgress);
    }, 200);
  };

  /* ------------------- Install Button Click ------------------- */
  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      setInstallStatus('alert-no-support'); 
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      startFakeInstall();
    }
  };

  /* ------------------- UI ------------------- */
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-0 w-full h-64 bg-linear-to-b from-blue-50 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-indigo-100 rounded-full blur-[80px] pointer-events-none opacity-60"></div>

      <div className="w-full max-w-sm text-center relative z-10">
        
        {/* --- BRANDING / LOGO --- */}
        <div className="mb-10 flex flex-col items-center animate-in fade-in zoom-in duration-700">
          <div className="relative group">
            {/* Glow Effect behind Logo */}
            <div className="absolute inset-0 bg-blue-600 rounded-4xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
            
            {/* Logo Container - Using the New Premium Gradient */}
            <div className="w-28 h-28 bg-linear-to-br from-blue-900 via-indigo-900 to-slate-900 rounded-4xl flex items-center justify-center shadow-2xl shadow-indigo-900/20 border border-white/10 relative z-10 transform transition-transform duration-300 group-hover:scale-105">
                <Store size={48} className="text-white drop-shadow-md" />
            </div>
          </div>

          <h1 className="text-4xl font-black text-slate-900 mt-6 tracking-tight">
            Billing Habit
          </h1>
          <div className="mt-2 px-4 py-1.5 bg-white border border-gray-200 rounded-full shadow-sm">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Pro Retail Edition
            </p>
          </div>
        </div>

        {/* --- IDLE STATE --- */}
        {installStatus === 'idle' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500 delay-100">
            <p className="text-gray-600 text-base leading-relaxed px-2">
              Install the app for the best experience. Access your inventory offline and generate bills instantly.
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
                <button
                  onClick={handleInstallClick}
                  className="w-full py-4 bg-blue-900 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 hover:bg-blue-800 hover:shadow-blue-600/40"
                >
                  <DownloadIcon size={20} strokeWidth={2.5} />
                  <span>Install App</span>
                </button>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-4 font-bold text-slate-600 bg-white border border-gray-200 rounded-2xl shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:bg-gray-50 hover:text-slate-900"
              >
                <Zap size={20} />
                Open in Browser
              </button>
            </div>

            {/* Footer Badges */}
            <div className="flex items-center justify-center gap-6 pt-6 opacity-60">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck size={18} className="text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">Secure</span>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="flex flex-col items-center gap-1">
                <Zap size={18} className="text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">Fast</span>
              </div>
            </div>
          </div>
        )}

        {/* --- DOWNLOADING STATE --- */}
        {installStatus === 'downloading' && (
          <div className="mt-8 bg-white p-6 rounded-3xl shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-end mb-3">
                <span className="text-sm font-bold text-slate-800">Installing...</span>
                <span className="text-xs font-mono font-medium text-blue-600">{progress}%</span>
            </div>
            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-200 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-6 flex justify-center">
                <Loader2 className="animate-spin text-slate-300" size={32} />
            </div>
          </div>
        )}

        {/* --- INSTALLED STATE --- */}
        {installStatus === 'installed' && (
          <div className="mt-8 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-100">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-900">All Set!</h2>
            <p className="text-slate-500 font-medium mt-1">
              Launching Billing Habit...
            </p>
          </div>
        )}
      </div>

      {/* --- ALERT MODAL (No Support) --- */}
      {installStatus === 'alert-no-support' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xs p-6 text-center">
            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-600 rotate-3">
              <Zap size={32} fill="currentColor" className="opacity-20 absolute" />
              <Zap size={32} className="relative z-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Install Manually</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Your browser doesn't support automatic install. Tap the menu icon (⋮ or Share) and select <br/>
              <span className="font-bold text-slate-800">"Add to Home Screen"</span>.
            </p>
            <button 
                onClick={() => setInstallStatus('idle')} 
                className="w-full py-3.5 bg-slate-900 rounded-xl font-bold text-white shadow-lg hover:bg-slate-800 active:scale-95 transition-all"
            >
                Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;