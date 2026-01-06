
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-4 border-b border-dark-border glass-effect sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
        <div 
          onClick={() => window.location.reload()} 
          className="flex items-center gap-4 group cursor-pointer"
        >
          <div className="relative">
            <div className="w-10 h-10 border-2 border-gold/30 rounded-full flex items-center justify-center transition-all duration-500 group-hover:border-gold group-hover:rotate-[360deg]">
              <div className="w-7 h-7 gold-gradient rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,215,0,0.4)]">
                <span className="font-display font-black text-dark text-lg italic mt-0.5">V</span>
              </div>
            </div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full animate-pulse shadow-[0_0_8px_#FFD700]"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="font-display text-2xl font-black tracking-[-0.05em] leading-none uppercase italic">
              <span className="gold-text-gradient">Virality</span>
            </h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[7px] font-black uppercase tracking-[0.3em] text-gray-500">Distribution AI</span>
              <span className="w-1 h-1 rounded-full bg-gold/30"></span>
              <span className="text-[7px] font-black uppercase tracking-[0.3em] text-gray-500">Engine 2025</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-dark-card rounded-full border border-dark-border shadow-inner">
             <div className="w-1 h-1 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
             <span className="text-[7px] font-black uppercase tracking-widest text-gray-500">AI Active ✅</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
