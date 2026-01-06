

import React, { useState, useEffect } from 'react';
import { Platform, ToneType, PostTemplate, UploadedFile } from './types';

interface Props {
  selected: Platform[];
  onChange: (platforms: Platform[]) => void;
  selectedTone: ToneType;
  onToneChange: (tone: ToneType) => void;
  customTone: string;
  onCustomToneChange: (val: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  uploadedFiles: UploadedFile[];
  postContext: string;
  onPostContextChange: (val: string) => void;
}

const STORAGE_KEY = 'virality_post_templates';
const LAST_KEY = 'virality_post_last';

const PlatformSelector: React.FC<Props> = ({ 
  selected, 
  onChange, 
  selectedTone, 
  onToneChange, 
  customTone, 
  onCustomToneChange, 
  onGenerate, 
  isGenerating,
  uploadedFiles,
  postContext,
  onPostContextChange
}) => {
  const [templates, setTemplates] = useState<PostTemplate[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setTemplates(JSON.parse(saved));
  }, []);

  const saveTemplate = () => {
    const name = prompt("Enter template name (e.g., 'Aesthetic Lifestyle'):");
    if (!name) return;
    const newTemplate: PostTemplate = {
      id: Date.now().toString(),
      name,
      tone: selectedTone,
      customTone,
      platforms: selected
    };
    const updated = [...templates, newTemplate];
    setTemplates(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const loadTemplate = (id: string) => {
    const t = templates.find(x => x.id === id);
    if (!t) return;
    onToneChange(t.tone);
    onCustomToneChange(t.customTone);
    onChange(t.platforms);
  };

  const loadLast = () => {
    const last = localStorage.getItem(LAST_KEY);
    if (last) {
      const t = JSON.parse(last);
      onToneChange(t.tone);
      onCustomToneChange(t.customTone);
      onChange(t.platforms);
    }
  };

  const handleGenerateClick = () => {
    localStorage.setItem(LAST_KEY, JSON.stringify({
      tone: selectedTone,
      customTone,
      platforms: selected
    }));
    onGenerate();
  };

  const toggle = (p: Platform) => {
    if (selected.includes(p)) {
      onChange(selected.filter(x => x !== p));
    } else {
      onChange([...selected, p]);
    }
  };

  const platformsList = [
    { id: Platform.TikTok, label: 'TikTok', sub: 'Engagement Hooks' },
    { id: Platform.Instagram, label: 'IG Feed', sub: 'Visual Story' },
    { id: Platform.Facebook, label: 'Facebook', sub: 'Community' },
    { id: Platform.YouTubeShorts, label: 'YT Shorts', sub: 'SEO Titles' },
    { id: Platform.YouTubeLong, label: 'YT Content', sub: 'Rich Descriptions' },
  ];

  const toneOptions: { value: ToneType; label: string; icon: string }[] = [
    { value: 'funny', label: 'Funny / Viral', icon: '😂' },
    { value: 'professional', label: 'Professional', icon: '💼' },
    // Fix: Changed 'storytelling' to 'excited-storyteller' to match ToneType definition in types.ts
    { value: 'excited-storyteller', label: 'Storytelling', icon: '📖' },
    { value: 'educational', label: 'Educational', icon: '🎓' },
    { value: 'relatable', label: 'Relatable', icon: '🤝' },
    { value: 'custom', label: 'Custom', icon: '🎨' },
  ];

  const vibes = [
    { id: 'hook-bombs', label: 'Hook Bombs', icon: '🚀', value: 'funny' },
    { id: 'value-bombs', label: 'Value Bombs', icon: '💎', value: 'educational' },
    // Fix: Changed 'storytelling' to 'excited-storyteller'
    { id: 'growth-stories', label: 'Growth Stories', icon: '📈', value: 'excited-storyteller' },
    { id: 'relatable-af', label: 'Relatable AF', icon: '😂', value: 'relatable' },
    { id: 'trend-jacking', label: 'Trend Jacking', icon: '🔥', value: 'funny' },
    { id: 'dm-magnets', label: 'DM Magnets', icon: '⚡', value: 'professional' },
    { id: 'shock-facts', label: 'Shock Facts', icon: '😱', value: 'funny' },
    // Fix: Changed 'storytelling' to 'excited-storyteller'
    { id: 'story-arc', label: 'Story Arc', icon: '🎭', value: 'excited-storyteller' },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 dark:bg-dark-border/20 p-4 rounded-3xl border border-gray-200 dark:border-dark-border">
        <div className="flex items-center gap-2">
           <button 
             onClick={saveTemplate}
             className="flex items-center gap-2 px-3 py-2 bg-dark dark:bg-white text-white dark:text-dark rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md transition-all active:scale-95"
           >
             💾 SAVE TEMPLATE
           </button>
           <button 
             onClick={loadLast}
             className="flex items-center gap-2 px-3 py-2 bg-gold text-dark rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md transition-all active:scale-95 border border-gold/50"
           >
             ⚡ USE LAST
           </button>
        </div>
        
        <div className="relative group min-w-[180px]">
          <select 
            onChange={(e) => loadTemplate(e.target.value)}
            className="w-full pl-3 pr-10 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-[10px] font-bold uppercase tracking-widest dark:text-gray-300 appearance-none outline-none cursor-pointer"
            defaultValue=""
          >
            <option value="" disabled>📂 LOAD TEMPLATES</option>
            {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="p-6 bg-white dark:bg-dark-card rounded-[32px] border border-gray-200 dark:border-dark-border shadow-xl">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-gold uppercase tracking-widest">Aesthetic Deck ({uploadedFiles.length}/4)</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {uploadedFiles.map((file, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden border-2 border-gold/20 shadow-lg relative group">
                  <img src={file.previewUrl} className="w-full h-full object-cover" alt={`Preview ${i}`} />
                  <div className="absolute inset-0 bg-dark/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-6 gold-gradient rounded-full"></div>
            <h2 className="font-display text-xl font-bold uppercase tracking-tight dark:text-white italic">Content Focus</h2>
          </div>
          <span className="text-[9px] font-black text-gold/60 uppercase tracking-widest">Aesthetic Intent Engine</span>
        </div>
        <textarea 
          value={postContext}
          onChange={(e) => onPostContextChange(e.target.value)}
          placeholder="What is this post about? Viral storytelling works best with key details..."
          className="w-full p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-[32px] text-sm md:text-base font-semibold leading-relaxed dark:text-white outline-none focus:ring-4 focus:ring-gold/10 focus:border-gold transition-all shadow-inner h-44 resize-none"
        />
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-2 px-2">
          <div className="w-1.5 h-6 gold-gradient rounded-full"></div>
          <h2 className="font-display text-xl font-bold uppercase tracking-tight dark:text-white italic">8 Viral Vibes</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 dark:bg-dark-border/20 p-4 rounded-[40px] border border-gray-200 dark:border-dark-border">
          {vibes.map((v) => (
            <button
              key={v.id}
              onClick={() => onToneChange(v.value as ToneType)}
              className={`flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all gap-2 ${
                selectedTone === v.value 
                  ? 'border-gold bg-gold/5 shadow-lg scale-[1.05]' 
                  : 'border-transparent bg-white dark:bg-dark-card/50 text-gray-500 hover:border-gold/30'
              }`}
            >
              <span className="text-2xl">{v.icon}</span>
              <span className={`text-[10px] font-black uppercase text-center leading-tight ${selectedTone === v.value ? 'text-gold' : ''}`}>{v.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <div className="w-1.5 h-6 gold-gradient rounded-full"></div>
          <h2 className="font-display text-xl font-bold uppercase tracking-tight dark:text-white italic">Target Distribution</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {platformsList.map((p) => (
            <button
              key={p.id}
              onClick={() => toggle(p.id)}
              className={`flex-1 min-w-[120px] p-3 rounded-xl border-2 transition-all text-left ${
                selected.includes(p.id) 
                  ? 'border-gold bg-gold/5 dark:bg-gold/10' 
                  : 'border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card'
              }`}
            >
              <p className="font-bold text-[11px] leading-tight dark:text-white truncate uppercase">{p.label}</p>
              <p className="text-[8px] font-medium text-gray-500 uppercase truncate">{p.sub}</p>
            </button>
          ))}
        </div>
      </div>

      <button 
        disabled={isGenerating || selected.length === 0 || (!postContext && uploadedFiles.length === 0)}
        onClick={handleGenerateClick}
        className={`w-full py-6 rounded-[32px] font-display font-black text-xl tracking-tight flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-2xl ${
          isGenerating || selected.length === 0 || (!postContext && uploadedFiles.length === 0)
            ? 'bg-gray-200 dark:bg-dark-border text-gray-400 cursor-not-allowed' 
            : 'gold-gradient text-dark hover:opacity-90 ring-8 ring-gold/5 uppercase italic'
        }`}
      >
        {isGenerating ? (
          <>
            <div className="w-6 h-6 border-4 border-dark border-t-transparent rounded-full animate-spin"></div>
            DISTILLING AESTHETIC CAPTIONS...
          </>
        ) : (
          'FABRICATE VIRAL CONTENT'
        )}
      </button>
    </div>
  );
};

export default PlatformSelector;