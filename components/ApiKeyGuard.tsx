import React, { useState, useEffect } from 'react';

interface Props {
  children: React.ReactNode;
}

const ApiKeyGuard: React.FC<Props> = ({ children }) => {
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        // @ts-ignore
        const result = await window.aistudio.hasSelectedApiKey();
        setHasKey(result);
      } else {
        // If not in an environment that supports this, assume true to not block development
        setHasKey(true);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    // @ts-ignore
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      // Per instructions: assume success after triggering
      setHasKey(true);
    }
  };

  if (hasKey === null) return null;

  if (!hasKey) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-dark-card border border-dark-border rounded-[48px] shadow-2xl animate-slide-up">
        <div className="w-20 h-20 gold-gradient rounded-3xl flex items-center justify-center mb-8 shadow-xl">
          <svg className="w-10 h-10 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h2 className="font-display text-3xl font-black uppercase italic gold-text-gradient mb-4 tracking-tighter">Paid API Key Required</h2>
        <p className="text-gray-400 font-medium mb-8 max-w-sm leading-relaxed text-sm">
          To use <span className="text-gold">gemini-3-pro-image-preview</span> for high-quality, face-consistent thumbnails, you must select an API key from a paid GCP project.
        </p>
        
        <button 
          onClick={handleSelectKey}
          className="gold-gradient text-dark px-8 py-4 rounded-2xl font-display font-black uppercase italic tracking-widest shadow-xl active:scale-95 transition-all mb-6"
        >
          Select API Key
        </button>

        <a 
          href="https://ai.google.dev/gemini-api/docs/billing" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gold transition-colors underline"
        >
          View Billing Documentation
        </a>
      </div>
    );
  }

  return <>{children}</>;
};

export default ApiKeyGuard;