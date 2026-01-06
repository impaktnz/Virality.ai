
import React, { useEffect, useState } from 'react';

interface Props {
  onClose: () => void;
}

const SuccessModal: React.FC<Props> = ({ onClose }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          return 100;
        }
        return p + 3;
      });
    }, 40);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-dark/90 backdrop-blur-xl">
      <div className="bg-white dark:bg-dark-card w-full max-w-sm rounded-[40px] border border-gold/30 p-10 flex flex-col items-center text-center animate-in zoom-in duration-300 shadow-2xl">
        <div className="w-24 h-24 gold-gradient rounded-full border-4 border-white dark:border-dark flex items-center justify-center mb-8 shadow-2xl">
          {progress < 100 ? (
            <span className="font-display font-black text-2xl italic text-dark">{Math.min(100, progress)}%</span>
          ) : (
            <svg className="w-12 h-12 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        
        <h2 className="font-display text-3xl font-black mb-4 italic leading-tight uppercase dark:text-white">
          {progress < 100 ? 'Syncing...' : 'Complete ✅'}
        </h2>
        <p className="text-gray-500 font-bold mb-10 uppercase text-[10px] tracking-widest leading-relaxed">
          {progress < 100 
            ? 'Distributing content across optimized distribution nodes' 
            : 'All campaign variants are ready for distribution.'}
        </p>

        {progress >= 100 && (
          <button 
            onClick={onClose}
            className="w-full py-4 bg-dark dark:bg-gold text-white dark:text-dark rounded-xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-all shadow-lg active:scale-95"
          >
            Return to Studio
          </button>
        )}
      </div>
    </div>
  );
};

export default SuccessModal;
