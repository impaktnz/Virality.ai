
import React, { useState, useEffect } from 'react';
import { ViralResults, Platform, PlatformVariant, UploadedFile, TikTokSEO } from '../types';
import { generateTikTokKeywords } from '../services/geminiService';

interface Props {
  results: ViralResults;
  selectedPlatforms: Platform[];
  onRefine: (request: string) => void;
  onPost: () => void;
  isGenerating: boolean;
  uploadedFiles: UploadedFile[];
  postContext: string;
}

const PreviewSection: React.FC<Props> = ({ results, selectedPlatforms, onRefine, onPost, isGenerating, uploadedFiles, postContext }) => {
  const [activeTab, setActiveTab] = useState<Platform>(selectedPlatforms[0]);
  const [variantIndex, setVariantIndex] = useState<number>(0);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  
  // SEO Pack State
  const [tiktokSEO, setTiktokSEO] = useState<TikTokSEO | null>(null);
  const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);

  const formulas = [
    { label: 'Hook Bombs', icon: '🚀', desc: 'Stop Scroll' },
    { label: 'Value Bombs', icon: '💎', desc: 'Expert Tips' },
    { label: 'Growth Stories', icon: '📈', desc: '0→10K Secret' },
    { label: 'Relatable AF', icon: '😂', desc: 'POV Humor' },
    { label: 'Trend Jacking', icon: '🔥', desc: 'Viral Audio' },
    { label: 'DM Magnets', icon: '⚡', desc: 'High Conversion' },
    { label: 'Shock Facts', icon: '😱', desc: 'Provocative' },
    { label: 'Story Arc', icon: '🎭', desc: 'The Big Twist' }
  ];

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(id);
      setTimeout(() => setCopyStatus(null), 2000);
    } catch (err) {}
  };

  const handleGenerateSEO = async () => {
    setIsGeneratingSEO(true);
    try {
      const seo = await generateTikTokKeywords(uploadedFiles.map(f => ({
        base64: f.base64!,
        mimeType: f.file.type
      })), postContext || "Trending Topic");
      setTiktokSEO(seo);
    } catch (error) {
      console.error("SEO generation failed", error);
    } finally {
      setIsGeneratingSEO(false);
    }
  };

  useEffect(() => {
    if (activeTab === Platform.TikTok) {
      if (!tiktokSEO && !isGeneratingSEO) handleGenerateSEO();
    }
  }, [activeTab]);

  const copySEOPack = async () => {
    if (!tiktokSEO) return;
    const text = (tiktokSEO.keywords || []).map((item, i) => `${i + 1}. ${item}`).join('\n');
    handleCopy('seo_copy_btn', text);
  };

  const copyAll = async () => {
    const allText = selectedPlatforms.map(p => {
      const data = results[p as keyof ViralResults];
      if (!data) return '';
      const variant = data.formula_variants[variantIndex] || data.formula_variants[0];
      const tags = variant.hashtags.map(t => t.startsWith('#') ? t : `#${t}`).join(' ');
      let content = variant.caption;
      if (p === Platform.YouTubeLong) {
        content = `TITLE: ${data.title}\n\nDESCRIPTION: ${data.description}\n\n${variant.caption}`;
      }
      return `--- ${p.toUpperCase()} (${formulas[variantIndex].label}) ---\n${content}\n\n${tags}`;
    }).filter(Boolean).join('\n\n');
    
    handleCopy('copy_all_btn', allText);
  };

  const renderPlatformCard = (p: Platform) => {
    const data = results[p as keyof ViralResults];
    if (!data) return null;

    const variant: PlatformVariant = data.formula_variants[variantIndex] || data.formula_variants[0];
    const tags = variant.hashtags.map(t => t.startsWith('#') ? t : `#${t}`).join(' ');
    
    let mainText = variant.caption;
    if (p === Platform.YouTubeLong) {
      mainText = `TITLE: ${data.title}\n\nDESCRIPTION: ${data.description}\n\n${variant.caption}`;
    }

    const fullPost = `${mainText}\n\n${tags}`;
    const coverText = data.cover_text || "VIRAL HOOK HERE";

    return (
      <div className="space-y-10 animate-fade-in-up">
        {/* TikTok Specific Features */}
        {p === Platform.TikTok && (
          <div className="space-y-8">
            {/* 🔥 COMPACT TIKTOK SEARCH KEYWORDS */}
            <div className="bg-dark-card border border-gold/20 rounded-[40px] p-8 space-y-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                <span className="font-display font-black text-8xl italic text-gold leading-none">SEO</span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                <div className="flex flex-col">
                  <h3 className="font-display text-lg font-black uppercase italic gold-text-gradient leading-none">
                    50 TikTok Search Keywords
                  </h3>
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-1">Hashtag-Free Algorithm Pack</p>
                </div>
                
                {tiktokSEO && (
                  <button 
                    onClick={copySEOPack}
                    className="px-4 py-2 bg-white text-dark rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-gold transition-all shadow-xl flex items-center gap-2"
                  >
                    <span>{copyStatus === 'seo_copy_btn' ? '✅' : '📋'}</span>
                    {copyStatus === 'seo_copy_btn' ? 'COPIED' : 'COPY ALL'}
                  </button>
                )}
              </div>

              {isGeneratingSEO ? (
                <div className="flex flex-col items-center justify-center py-10 gap-4">
                  <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[9px] font-black text-gold/60 uppercase tracking-widest animate-pulse">Calculating Algorithm Nodes...</span>
                </div>
              ) : tiktokSEO && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 relative z-10 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                  {(tiktokSEO.keywords || []).map((phrase, i) => (
                    <div key={i} className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-bold text-gray-400 hover:text-white hover:border-gold/30 transition-all cursor-default truncate">
                      <span className="text-gold/40 mr-1.5">{i + 1}.</span> {phrase}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Optimized Cover Text Hook */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Optimized Cover Text</label>
            <button 
              onClick={() => handleCopy(`${p}_cover`, coverText)}
              className="px-5 py-2.5 bg-gold text-dark rounded-xl font-black text-[10px] uppercase transition-all flex items-center gap-2 shadow-lg active:scale-95"
            >
              {copyStatus === `${p}_cover` ? '✅ COPIED' : '📋 COPY HOOK'}
            </button>
          </div>
          <div className="p-10 bg-gray-50 dark:bg-dark-border/40 rounded-[32px] border border-gray-200 dark:border-dark-border font-display font-black text-3xl leading-tight dark:text-white text-center italic tracking-tight uppercase shadow-inner">
            "{coverText}"
          </div>
        </div>

        {/* Main Post Content */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Main Post + Smart Tags</label>
            <button 
              onClick={() => handleCopy(`${p}_main`, fullPost)}
              className="px-5 py-2.5 bg-dark dark:bg-white text-white dark:text-dark rounded-xl font-black text-[10px] uppercase transition-all flex items-center gap-2 shadow-md active:scale-95 border border-gray-200 dark:border-zinc-700"
            >
              {copyStatus === `${p}_main` ? '✅ COPIED' : '📋 COPY POST'}
            </button>
          </div>
          <div className="p-8 bg-white dark:bg-dark-border/20 rounded-[32px] border border-gray-200 dark:border-dark-border whitespace-pre-wrap font-medium text-sm leading-relaxed dark:text-gray-200 shadow-inner max-h-96 overflow-y-auto custom-scrollbar">
            {fullPost}
          </div>
        </div>

        {/* 8 Viral Formula Variants */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">8 Viral Formula Variants</label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-100 dark:bg-dark-border rounded-[32px] p-3 border border-gray-200 dark:border-zinc-800 shadow-inner">
            {formulas.map((f, idx) => (
              <button 
                key={idx}
                onClick={() => setVariantIndex(idx)}
                className={`flex flex-col items-center justify-center py-4 px-2 rounded-[24px] transition-all gap-1 border-2 ${
                  variantIndex === idx 
                    ? 'bg-gold text-dark border-gold shadow-xl scale-[1.02]' 
                    : 'bg-white dark:bg-dark-card/50 text-gray-500 border-transparent hover:border-gold/30 dark:hover:text-gray-300'
                }`}
              >
                <span className="text-xl">{f.icon}</span>
                <span className="text-[10px] font-black uppercase tracking-tight">{f.label}</span>
                <span className="text-[7px] font-bold uppercase opacity-60 leading-none">{f.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex overflow-x-auto gap-4 pb-6 no-scrollbar">
        {selectedPlatforms.map((p) => (
          <button
            key={p}
            onClick={() => { setActiveTab(p); setVariantIndex(0); }}
            className={`px-10 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all border-2 ${
              activeTab === p 
                ? 'bg-dark dark:bg-gold text-white dark:text-dark border-dark dark:border-gold shadow-2xl ring-4 ring-gold/10 scale-[1.05]' 
                : 'bg-white dark:bg-dark-card text-gray-400 border-gray-200 dark:border-dark-border hover:border-gold/30 shadow-md'
            }`}
          >
            {p.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="p-10 md:p-14 bg-white dark:bg-dark-card rounded-[56px] border border-gray-200 dark:border-dark-border card-shadow shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
           <span className="font-display text-[10rem] font-black italic text-gray-400 uppercase">{activeTab.charAt(0)}</span>
        </div>
        <div className="relative z-10">
          {renderPlatformCard(activeTab)}
        </div>
      </div>

      <div className="pt-6">
        <button 
          onClick={copyAll}
          className="w-full py-7 rounded-[40px] bg-dark dark:bg-white text-gold dark:text-dark font-display font-black text-3xl uppercase italic tracking-tighter shadow-2xl transform active:scale-[0.98] transition-all flex items-center justify-center gap-5 hover:opacity-90 ring-12 ring-gold/5"
        >
          {copyStatus === 'copy_all_btn' ? '✅ ALL COPIED TO CLIPBOARD' : `📋 COPY ALL POSTS (${formulas[variantIndex].label})`}
        </button>
      </div>
    </div>
  );
};

export default PreviewSection;
