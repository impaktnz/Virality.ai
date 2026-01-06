
import React, { useState, useEffect } from 'react';
import { ScriptType, ContentLength, ToneType, ScriptResult, UploadedFile } from '../types';

interface Props {
  onGenerate: (formula: ScriptType, length: ContentLength, tone: ToneType, customInput: string, customDurationSeconds?: number, useBranding?: boolean) => void;
  isGenerating: boolean;
  result: ScriptResult | null;
  uploadedFiles: UploadedFile[];
  onUpload: (files: FileList | File[]) => void;
  onRemovePhoto: (index: number) => void;
  onUseForPost?: (content: string) => void;
}

const STORAGE_KEY = 'virality_script_templates';
const LAST_KEY = 'virality_script_last';

const ScriptGenerator: React.FC<Props> = ({ onGenerate, isGenerating, result, uploadedFiles, onUpload, onRemovePhoto, onUseForPost }) => {
  const [formula, setFormula] = useState<ScriptType>('viral-hook');
  const [length, setLength] = useState<ContentLength>('15s');
  const [customDuration, setCustomDuration] = useState<number>(0);
  const [tone, setTone] = useState<ToneType>('energetic');
  const [customInput, setCustomInput] = useState('');
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) JSON.parse(saved);
  }, []);

  const handleGenerateClick = () => {
    localStorage.setItem(LAST_KEY, JSON.stringify({ formula, length, autoLength: false }));
    onGenerate(formula, length, tone, customInput, length === 'custom' ? customDuration : undefined, false);
  };

  const handleCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopyStatus(id);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const toneOptions: { value: ToneType; label: string }[] = [
    { value: 'energetic', label: 'Energetic' },
    { value: 'calm-authority', label: 'Calm Authority' },
    { value: 'excited-storyteller', label: 'Storyteller' },
    { value: 'sarcastic-humor', label: 'Sarcastic Humor' },
    { value: 'motivational-coach', label: 'Motivational Coach' },
    { value: 'mysterious-tease', label: 'Mysterious Tease' },
    { value: 'urgent-cta', label: 'Urgent CTA' },
    { value: 'relatable-friend', label: 'Relatable Friend' },
    { value: 'funny', label: 'Funny / Viral' },
    { value: 'professional', label: 'Professional' },
    { value: 'educational', label: 'Educational' },
    { value: 'relatable', label: 'Relatable AF' },
  ];

  return (
    <div className="space-y-10 pb-12">
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <div className="w-1 h-4 gold-gradient rounded-full"></div>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Step 1: Visual Context (Max 4)</h3>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl border-2 border-dark-border bg-dark-card overflow-hidden relative group">
              {uploadedFiles[i] ? (
                <>
                  <img src={uploadedFiles[i].previewUrl} className="w-full h-full object-cover" alt="Upload" />
                  <button onClick={() => onRemovePhoto(i)} className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                </>
              ) : (
                <label className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-gold/5 transition-colors">
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && onUpload(e.target.files)} />
                  <span className="text-2xl text-gray-700">+</span>
                </label>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <div className="w-1 h-4 gold-gradient rounded-full"></div>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Step 2: Script Goal / Title</h3>
        </div>
        <textarea value={customInput} onChange={(e) => setCustomInput(e.target.value)} placeholder="Describe your goal, story, or target audience..." className="w-full p-6 bg-dark-card border border-dark-border rounded-[32px] text-sm font-semibold outline-none focus:border-gold transition-all h-32 resize-none" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1"><div className="w-1 h-4 gold-gradient rounded-full"></div><h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Step 3: Content Formula</h3></div>
          <select value={formula} onChange={(e) => setFormula(e.target.value as ScriptType)} className="w-full p-5 rounded-2xl bg-dark-card border border-dark-border font-bold text-sm outline-none cursor-pointer text-white appearance-none">
            <option value="viral-hook">Viral Hook</option>
            <option value="value-stack">Value Stack</option>
            <option value="story-arc">Story Arc</option>
            <option value="deep-authority">Deep Authority</option>
            <option value="tutorial-flow">Tutorial Flow</option>
            <option value="epic-journey">Epic Journey</option>
          </select>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1"><div className="w-1 h-4 gold-gradient rounded-full"></div><h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Step 4: Target Tone</h3></div>
          <select value={tone} onChange={(e) => setTone(e.target.value as ToneType)} className="w-full p-5 rounded-2xl bg-dark-card border border-dark-border font-bold text-sm outline-none cursor-pointer text-white appearance-none">
            {toneOptions.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1"><div className="w-1 h-4 gold-gradient rounded-full"></div><h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Step 5: Duration</h3></div>
        <div className="flex gap-4">
          <select value={length} onChange={(e) => setLength(e.target.value as ContentLength)} className="flex-1 p-5 rounded-2xl bg-dark-card border border-dark-border font-bold text-sm outline-none cursor-pointer text-white appearance-none">
            <option value="15s">15s</option><option value="30s">30s</option><option value="60s">60s</option><option value="90s">90s</option><option value="3min">3min</option><option value="5min+">5min+</option><option value="custom">Custom</option>
          </select>
          {length === 'custom' && <input type="number" value={customDuration || ''} onChange={(e) => setCustomDuration(Number(e.target.value))} placeholder="Secs" className="w-24 p-5 rounded-2xl bg-dark-card border border-dark-border font-bold text-sm outline-none" />}
        </div>
      </div>

      <button onClick={handleGenerateClick} disabled={isGenerating || !customInput} className={`w-full py-6 rounded-[32px] font-display font-black text-2xl tracking-tight uppercase italic transition-all active:scale-[0.98] shadow-2xl ${isGenerating || !customInput ? 'bg-dark-border text-gray-500' : 'gold-gradient text-dark'}`}>
        {isGenerating ? 'GENERATING SCRIPT...' : 'GENERATE SCRIPT'}
      </button>

      {result && (
        <div className="mt-12 space-y-8 animate-slide-up">
          <div className="bg-dark-card border border-dark-border rounded-[40px] p-8 space-y-6 shadow-xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h3 className="font-display text-xl font-black uppercase italic gold-text-gradient">Clean Script Output</h3>
              <div className="flex gap-2">
                <button onClick={() => handleCopy('main_script', result.content)} className="text-[10px] font-black uppercase text-gold px-3 py-1 bg-gold/5 rounded-lg border border-gold/10 hover:bg-gold/10 transition-all">{copyStatus === 'main_script' ? '✅ COPIED' : '📋 COPY'}</button>
                {onUseForPost && (
                  <button onClick={() => onUseForPost(result.content)} className="text-[10px] font-black uppercase text-dark px-3 py-1 bg-gold rounded-lg hover:bg-gold-light transition-all">✨ USE FOR POST</button>
                )}
              </div>
            </div>
            <div className="text-sm md:text-base leading-relaxed font-medium text-gray-200 whitespace-pre-wrap">{result.content}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScriptGenerator;
