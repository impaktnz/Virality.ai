
import React, { useState, useEffect, useRef } from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  label: string;
  subLabel?: string;
}

const SpeechInput: React.FC<Props> = ({ value, onChange, placeholder, label, subLabel }) => {
  const [mode, setMode] = useState<'type' | 'speak'>('type');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        onChange(value + (value.length > 0 ? ' ' : '') + finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [value, onChange]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error("Failed to start recognition", e);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 gold-gradient rounded-full"></div>
          <h2 className="font-display text-xl font-bold uppercase tracking-tight dark:text-white italic">{label}</h2>
        </div>
        
        {isSupported && (
          <div className="flex bg-dark-border/40 p-1 rounded-2xl border border-white/5">
            <button 
              onClick={() => setMode('type')}
              className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${mode === 'type' ? 'bg-white text-dark shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
            >
              ⌨️ Type
            </button>
            <button 
              onClick={() => setMode('speak')}
              className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${mode === 'speak' ? 'bg-white text-dark shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
            >
              🎤 Speak
            </button>
          </div>
        )}
      </div>

      <div className="relative group">
        <textarea 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={mode === 'speak' ? "Tap the mic and describe your viral vision..." : placeholder}
          className={`w-full p-8 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-[40px] text-sm md:text-base font-semibold leading-relaxed dark:text-white outline-none focus:ring-4 focus:ring-gold/10 focus:border-gold transition-all shadow-inner h-48 resize-none ${mode === 'speak' ? 'pr-24' : ''}`}
        />
        
        {mode === 'speak' && isSupported && (
          <div className="absolute right-6 bottom-6 flex flex-col items-center gap-2">
            {isListening && (
              <span className="text-[8px] font-black text-red-500 uppercase tracking-widest animate-pulse">Syncing...</span>
            )}
            <button 
              onClick={toggleListening}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-2xl relative ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gold text-dark'}`}
            >
              {isListening ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
              )}
              {isListening && (
                <div className="absolute inset-0 rounded-full border-4 border-red-500/50 animate-ping"></div>
              )}
            </button>
          </div>
        )}
        
        {!isSupported && mode === 'speak' && (
          <div className="absolute inset-0 bg-dark/80 backdrop-blur-sm rounded-[40px] flex items-center justify-center p-8 text-center">
            <p className="text-[10px] font-black text-gold uppercase tracking-[0.2em]">Voice Sync Not Supported in this Browser. <br/> Please use Type Mode.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeechInput;
