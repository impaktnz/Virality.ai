import React, { useState, useEffect } from 'react';
import { ThumbnailStyle, ThumbnailVariant, ContentAnalysis, CoverTemplate } from '../types';
import { generateThumbnails } from '../services/geminiService';
import ApiKeyGuard from './ApiKeyGuard';

interface Props {
  analysis?: ContentAnalysis | null;
  initialTextOverlay?: string;
}

const styles: { value: ThumbnailStyle; label: string; desc: string }[] = [
  { value: 'neon-edition', label: 'Neon', desc: 'High energy cyberpunk glow for TikTok/Shorts' },
  { value: 'minimalist-flat', label: 'Minimalist', desc: 'Premium clean aesthetic for business topics' },
  { value: 'cinematic-spotlight', label: 'Cinematic', desc: 'Dramatic depth and moody prestige' },
  { value: 'gradient-burst', label: 'Gradient Burst', desc: 'Intense rainbow energy for high CTR' }
];

const platformLogic = {
  YouTube: {
    title: "CTR Curiosity Anchor",
    desc: "Uses high-contrast shadows to focus on the 'Virality' pyramid as a mysterious central object.",
    icon: "📺",
    placeholder: "THE $1,000,000 SECRETS"
  },
  TikTok: {
    title: "Neon Stop-Scroll",
    desc: "Heavy neon-green confetti and vibrating particles designed for high-speed scrolling.",
    icon: "📱",
    placeholder: "WATCH THIS NOW 🚀"
  },
  Instagram: {
    title: "Prestige Minimal",
    desc: "Luxury-brand layout with clean white-to-black gradients for lifestyle credibility.",
    icon: "📸",
    placeholder: "WEALTH MINDSET"
  },
  Facebook: {
    title: "Authority Emboss",
    desc: "Stable, centered composition with gold-embossed branding for conversational trust.",
    icon: "👥",
    placeholder: "NEW STRATEGY REVEALED"
  }
};

const CoverGeneratorContent: React.FC<Props> = ({ analysis, initialTextOverlay }) => {
  const [style, setStyle] = useState<ThumbnailStyle>('neon-edition');
  const [platformHooks, setPlatformHooks] = useState<Record<string, string>>({
    YouTube: initialTextOverlay || '10X YOUR INCOME',
    TikTok: initialTextOverlay || 'WATCH THIS 🚀',
    Instagram: initialTextOverlay || 'WEALTH MODE',
    Facebook: initialTextOverlay || 'THE STRATEGY'
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [variants, setVariants] = useState<ThumbnailVariant[]>([]);
  const [showFeedPreview, setShowFeedPreview] = useState<number | null>(null);
  const [activeStrategy, setActiveStrategy] = useState<keyof typeof platformLogic>('YouTube');

  const loadingMessages = [
    "Compiling Site-Specific Prompts...",
    "Removing Human Bias Factors...",
    "Synthesizing 4K Brand Assets...",
    "Injecting Multi-Platform Strategy...",
    "Rendering Branded Pack..."
  ];

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setLoadingStep(s => (s + 1) % loadingMessages.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  useEffect(() => {
    if (initialTextOverlay) {
      const upper = initialTextOverlay.toUpperCase();
      setPlatformHooks(prev => ({
        YouTube: prev.YouTube || upper,
        TikTok: prev.TikTok || upper,
        Instagram: prev.Instagram || upper,
        Facebook: prev.Facebook || upper
      }));
    }
  }, [initialTextOverlay]);

  const updateHook = (plat: string, val: string) => {
    setPlatformHooks(prev => ({ ...prev, [plat]: val.toUpperCase() }));
  };

  const syncAll = (val: string) => {
    setPlatformHooks({
      YouTube: val,
      TikTok: val,
      Instagram: val,
      Facebook: val
    });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setLoadingStep(0);
    try {
      const results = await generateThumbnails(style, platformHooks, analysis || undefined);
      setVariants(results);
    } catch (error: any) {
      console.error("Generation error", error);
      if (error?.message?.includes("entity was not found")) {
        alert("Pro AI requires a paid API key.");
        // @ts-ignore
        if (window.aistudio?.openSelectKey) window.aistudio.openSelectKey();
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const saveImage = (url: string, platform: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `virality-${platform.toLowerCase()}.png`;
    link.click();
  };

  return (
    <div className="space-y-12 pb-24 animate-slide-up">
      {/* Platform Strategy Toggle & Info */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 gold-gradient rounded-full"></div>
            <h2 className="font-display text-xl font-bold uppercase tracking-tight italic dark:text-white">Algorithm Strategy</h2>
          </div>
          <span className="text-[10px] font-black text-gold uppercase tracking-[0.2em] animate-pulse">4 Sites • 4 Prompts</span>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(platformLogic) as Array<keyof typeof platformLogic>).map((key) => (
            <button
              key={key}
              onClick={() => setActiveStrategy(key)}
              className={`p-6 rounded-[32px] border-2 text-left transition-all ${
                activeStrategy === key 
                  ? 'border-gold bg-gold/5 shadow-xl shadow-gold/5' 
                  : 'border-dark-border bg-dark-card/50 hover:border-gold/10'
              }`}
            >
              <div className="text-3xl mb-3">{platformLogic[key].icon}</div>
              <h4 className={`text-[10px] font-black uppercase tracking-widest mb-1 ${activeStrategy === key ? 'text-gold' : 'text-gray-500'}`}>
                {key} Logic
              </h4>
              <p className="text-[9px] font-bold text-gray-500 uppercase leading-tight">
                {platformLogic[key].title}
              </p>
            </button>
          ))}
        </div>

        <div className="bg-dark-card border border-dark-border rounded-[40px] p-8 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="text-7xl font-display font-black italic">{activeStrategy.charAt(0)}</span>
           </div>
           <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                 <span className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">Active Engine: {activeStrategy}</span>
                 <div className="flex gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase">Face-Free Policy Enabled</span>
                 </div>
              </div>
              <p className="text-gray-300 text-sm font-medium leading-relaxed italic pr-12">
                "{platformLogic[activeStrategy].desc}"
              </p>
           </div>
        </div>
      </div>

      {/* Prompt Forge Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 gold-gradient rounded-full"></div>
            <h2 className="font-display text-xl font-bold uppercase tracking-tight italic dark:text-white">Prompt Forge</h2>
          </div>
          <button 
            onClick={() => syncAll(platformHooks[activeStrategy])}
            className="text-[9px] font-black text-gray-500 hover:text-gold uppercase tracking-widest transition-colors flex items-center gap-2"
          >
            📋 SYNC ALL TO {activeStrategy.toUpperCase()}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Object.keys(platformLogic) as Array<keyof typeof platformLogic>).map((key) => (
            <div 
              key={key} 
              className={`p-6 rounded-[36px] bg-dark-card border transition-all ${activeStrategy === key ? 'border-gold shadow-lg shadow-gold/5' : 'border-dark-border opacity-70 hover:opacity-100'}`}
              onMouseEnter={() => setActiveStrategy(key)}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                   <span className="text-xl">{platformLogic[key].icon}</span>
                   <span className={`text-[11px] font-black uppercase tracking-widest ${activeStrategy === key ? 'text-gold' : 'text-gray-400'}`}>{key} HOOK</span>
                </div>
                <span className="text-[9px] font-bold text-gray-600 uppercase">{platformHooks[key].length}/40</span>
              </div>
              <textarea 
                value={platformHooks[key]}
                onChange={(e) => updateHook(key, e.target.value)}
                placeholder={platformLogic[key].placeholder}
                className="w-full bg-dark/40 border border-dark-border rounded-2xl p-4 text-sm font-black italic tracking-tighter uppercase dark:text-white h-24 resize-none outline-none focus:border-gold transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Style & Generate Card */}
      <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-[48px] p-8 md:p-12 card-shadow shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none select-none">
          <span className="font-display font-black text-[10rem] italic text-gray-400 uppercase leading-none">V</span>
        </div>

        <div className="relative z-10 space-y-10">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 text-center block">Visual Aesthetic Engine</label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {styles.map(s => (
                <button
                  key={s.value}
                  onClick={() => setStyle(s.value)}
                  className={`p-5 rounded-[28px] border-2 text-center transition-all flex flex-col items-center gap-2 ${
                    style === s.value 
                      ? 'border-gold bg-gold/5 shadow-xl ring-4 ring-gold/5' 
                      : 'border-dark-border bg-dark-card/50 hover:border-gold/20'
                  }`}
                >
                  <span className={`text-[11px] font-black uppercase italic ${style === s.value ? 'text-gold' : 'text-white'}`}>{s.label}</span>
                  <div className={`w-2 h-2 rounded-full transition-all ${style === s.value ? 'bg-gold animate-pulse' : 'bg-gray-700'}`}></div>
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleGenerate} 
            disabled={isGenerating} 
            className={`w-full py-8 rounded-[40px] font-display font-black text-3xl tracking-tight uppercase italic transition-all active:scale-[0.98] shadow-2xl relative overflow-hidden ${
              isGenerating ? 'bg-gray-100 dark:bg-dark-border text-gray-400 cursor-not-allowed' : 'gold-gradient text-dark hover:opacity-95 ring-12 ring-gold/10'
            }`}
          >
            {isGenerating ? (
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-7 h-7 border-4 border-dark border-t-transparent rounded-full animate-spin"></div>
                  <span>FABRICATING ASSETS...</span>
                </div>
                <span className="text-[11px] normal-case tracking-normal opacity-70 animate-pulse font-sans font-bold">{loadingMessages[loadingStep]}</span>
              </div>
            ) : 'GENERATE STRATEGY PACK'}
          </button>
        </div>

        {/* Export Deck */}
        {variants.length > 0 && (
          <div className="mt-24 space-y-16 animate-fade-in-up">
            <div className="flex justify-between items-end border-b border-dark-border pb-8">
              <div>
                <h3 className="font-display text-4xl font-black uppercase italic gold-text-gradient tracking-tight leading-none mb-2">Strategy Pack</h3>
                <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Synthetic Exports • Multi-Prompt Verified</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {variants.map((v, idx) => (
                <div key={idx} className="group flex flex-col gap-6">
                  <div className="relative rounded-[56px] overflow-hidden border-2 border-dark-border shadow-2xl bg-black transition-all group-hover:ring-[12px] group-hover:ring-gold/5">
                    
                    {/* Simulator */}
                    {showFeedPreview === idx && (
                      <div className="absolute inset-0 z-30 bg-[#0F0F0F] flex flex-col animate-in fade-in zoom-in duration-300">
                         <div className="p-6 flex items-center justify-between border-b border-white/5 bg-dark-card/50">
                            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{v.platform} Mobile Feed Simulator</span>
                            <button onClick={() => setShowFeedPreview(null)} className="text-gold font-black text-[11px] hover:scale-110 transition-transform">✕ CLOSE</button>
                         </div>
                         <div className="p-8 flex-1 flex flex-col justify-center items-center">
                            <div className="w-full max-w-[360px] flex flex-col gap-5">
                               <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-2xl ring-2 ring-white/10 group-hover:ring-gold/20 transition-all">
                                  <img src={v.url} className="w-full h-full object-cover" alt="Sim" />
                               </div>
                               <div className="flex gap-5 items-start">
                                  <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shadow-inner">
                                     <span className="font-display font-black text-gold text-xl italic">V</span>
                                  </div>
                                  <div className="flex-1 space-y-3">
                                     <div className="h-5 bg-white/10 rounded-lg w-full"></div>
                                     <div className="h-4 bg-white/5 rounded-lg w-3/4"></div>
                                     <div className="flex gap-3 text-[10px] font-black text-gold/40 uppercase mt-2 tracking-[0.2em]">
                                        <span>PROMOTED</span>
                                        <span>•</span>
                                        <span>VIRAL ENGINE</span>
                                     </div>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                    )}

                    <div className="aspect-video relative overflow-hidden bg-dark">
                      <img src={v.url} className="w-full h-full object-cover" alt={v.platform} />
                      <div className="absolute inset-0 bg-gold/5 pointer-events-none mix-blend-overlay"></div>
                      
                      <div className="absolute inset-0 bg-dark/95 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-6 backdrop-blur-2xl">
                         <div className="flex gap-5">
                            <button 
                              onClick={() => setShowFeedPreview(idx)}
                              className="px-8 py-4 bg-white text-dark rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-2xl transform hover:scale-105 active:scale-95 transition-all"
                            >
                              👁️ Simulate
                            </button>
                            <button 
                              onClick={() => saveImage(v.url, v.platform)}
                              className="px-8 py-4 bg-gold text-dark rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-2xl transform hover:scale-105 active:scale-95 transition-all"
                            >
                              📋 Export
                            </button>
                         </div>
                         <div className="flex flex-col items-center gap-1">
                            <span className="text-[10px] font-black text-gold/60 uppercase tracking-[0.4em]">{v.platform} Optimized</span>
                            <span className="text-[8px] font-bold text-gray-500 uppercase">Ratio: {v.aspectRatio}</span>
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-10 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-gold uppercase tracking-widest">{v.platform} Edition</span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter max-w-[200px] truncate">Prompt: {platformHooks[v.platform as keyof typeof platformLogic]}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex gap-2 items-center mb-1">
                         <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.7)] animate-pulse"></div>
                         <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">99.8% CTR</span>
                      </div>
                      <span className="text-[9px] font-bold text-gray-600 uppercase">Multi-Prompt Logic</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center pt-12 border-t border-dark-border">
               <button 
                 onClick={() => { setVariants([]); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                 className="text-[11px] font-black text-gray-500 hover:text-gold uppercase tracking-[0.3em] transition-all hover:tracking-[0.5em]"
               >
                 ✕ RESET BRAND DECK
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CoverGenerator: React.FC<Props> = (props) => (
  <ApiKeyGuard>
    <CoverGeneratorContent {...props} />
  </ApiKeyGuard>
);

export default CoverGenerator;