import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download as DownloadIcon, CheckCircle2, Store, Globe, Smartphone } from 'lucide-react';

const Download = () => {
  const [isReadyForInstall, setIsReadyForInstall] = useState(false);
  const [installStatus, setInstallStatus] = useState('idle'); // 'idle', 'downloading', 'installed'
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      navigate('/');
    }

    // 2. Check for trapped event
    if (window.deferredPrompt) {
      setIsReadyForInstall(true);
    }

    // 3. Listen for event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      window.deferredPrompt = e;
      setIsReadyForInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [navigate]);

  const startFakeDownload = () => {
    setInstallStatus('downloading');
    let currentProgress = 0;

    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 10) + 5; 

      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setInstallStatus('installed');
        
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
      setProgress(currentProgress);
    }, 200);
  };

  const handleDownloadClick = async () => {
    const promptEvent = window.deferredPrompt;
    if (!promptEvent) {
      alert("Installation handled by browser menu or not supported on this device.");
      return;
    }

    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      window.deferredPrompt = null;
      startFakeDownload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-sm rounded-4xl shadow-2xl p-8 text-center border border-gray-100 relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-blue-500 to-purple-600"></div>

        <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 bg-linear-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/30 transform hover:scale-105 transition-transform duration-300">
                <Store size={40} className="text-white" />
            </div>
        </div>

        <h1 className="text-2xl font-black text-gray-900 mb-1">Billing Habit</h1>
        <p className="text-sm font-medium text-gray-400 mb-8 uppercase tracking-wide">Version 1.0.0 • Retail Edition</p>

        {installStatus === 'idle' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Install the app for the best experience. Access your inventory offline and generate bills faster.
            </p>
            
            {isReadyForInstall ? (
              <button onClick={handleDownloadClick} className="w-full py-4 bg-primaryColor text-white font-bold rounded-xl shadow-lg shadow-green-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-green-700">
                <DownloadIcon size={20} /> Install App (1.2 MB)
              </button>
            ) : (
               <button onClick={() => navigate('/')} className="w-full py-4 bg-white border-2 border-gray-100 text-gray-700 font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-gray-50">
                <Globe size={20} /> Open Web Version
              </button>
            )}
            
            {!isReadyForInstall && (
                <p className="text-[10px] text-gray-400 mt-2">*If install doesn't appear, use your browser menu to "Add to Home Screen".</p>
            )}
          </div>
        )}

        {installStatus === 'downloading' && (
          <div className="mt-8 animate-in fade-in duration-300">
            <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                <span>Downloading assets...</span><span>{progress}%</span>
            </div>
            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-200 ease-out" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="mt-8 flex justify-center"><Smartphone className="text-gray-300 animate-pulse" size={48} /></div>
          </div>
        )}

        {installStatus === 'installed' && (
          <div className="mt-4 animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle2 size={32} /></div>
            <h2 className="text-xl font-bold text-gray-800">Installed!</h2>
            <p className="text-gray-500 text-sm mt-1">Launching application...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Download;