
import React, { useState, useRef } from 'react';
import { UploadedFile } from '../types';

interface Props {
  uploadedFiles: UploadedFile[];
  onUpload: (files: FileList) => void;
  onRemove: (index: number) => void;
  onTextOnly: () => void;
  onFinalize: () => void;
  isLoading: boolean;
}

const UploadSection: React.FC<Props> = ({ uploadedFiles, onUpload, onRemove, onTextOnly, onFinalize, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (uploadedFiles.length < 4) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files);
    }
  };

  return (
    <div className="w-full space-y-10 animate-slide-up">
      {/* Upload Zone */}
      <div className="space-y-4">
        <div 
          className={`relative w-full aspect-[4/5] sm:aspect-[16/7] rounded-[40px] border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-8 text-center card-shadow overflow-hidden ${
            uploadedFiles.length >= 4 
              ? 'border-dark-border bg-dark-card/30 cursor-not-allowed opacity-50' 
              : isDragging 
                ? 'border-gold bg-gold/10 scale-[1.02]' 
                : 'border-dark-border bg-dark-card hover:border-gold hover:bg-gold/5 cursor-pointer'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => uploadedFiles.length < 4 && fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange}
            accept="image/png, image/jpeg"
            multiple
          />
          
          {isLoading ? (
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl">✨</span>
                </div>
              </div>
              <div>
                <h2 className="font-display font-black text-2xl tracking-tight uppercase italic">Analyzing Aesthetic Core</h2>
                <p className="text-gray-500 font-bold text-[10px] tracking-widest uppercase mt-2">Gemini Visual Intelligence...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 gold-gradient rounded-full flex items-center justify-center mb-6 shadow-xl ring-8 ring-gold/5">
                <svg className="w-8 h-8 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight leading-none uppercase mb-2">
                Upload <span className="gold-text-gradient">Photos</span>
              </h2>
              <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-6">
                PNG/JPG Only • {uploadedFiles.length}/4 Slots Used
              </p>
              
              <div className="flex gap-2 opacity-30 flex-wrap justify-center pointer-events-none">
                {['TikTok', 'Instagram', 'Shorts', 'FB'].map(p => (
                  <span key={p} className="px-2 py-1 bg-dark-border rounded text-[8px] font-black tracking-widest uppercase">{p}</span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Live Previews Grid */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between px-2">
             <h3 className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">Photo Queue ({uploadedFiles.length}/4)</h3>
             {uploadedFiles.length < 4 && (
               <button 
                 onClick={() => fileInputRef.current?.click()}
                 className="text-[10px] font-black text-gray-500 hover:text-white transition-colors flex items-center gap-1"
               >
                 <span>+</span> ADD MORE
               </button>
             )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="relative group aspect-square">
                {uploadedFiles[i] ? (
                  <div className="w-full h-full rounded-[24px] overflow-hidden border-2 border-dark-border shadow-xl group-hover:border-gold transition-all group-hover:scale-[1.05] bg-dark-card">
                    <img 
                      src={uploadedFiles[i].previewUrl} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      alt={`Upload ${i}`} 
                    />
                    {/* Hover Full Size Indicator */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                       <span className="text-white font-black text-[9px] uppercase tracking-widest">Enlarging...</span>
                    </div>
                    {/* Remove Button */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); onRemove(i); }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-all opacity-0 group-hover:opacity-100 active:scale-90"
                    >
                      <span className="font-black text-lg">✕</span>
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-full rounded-[24px] border-2 border-dashed border-dark-border bg-dark-card/20 flex items-center justify-center text-gray-700 hover:border-gold/30 hover:bg-gold/5 transition-all cursor-pointer group"
                  >
                    <span className="text-4xl group-hover:scale-125 transition-transform">+</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-4 pt-4">
        {uploadedFiles.length > 0 && !isLoading && (
          <button 
            onClick={onFinalize}
            className="w-full py-6 rounded-[32px] gold-gradient text-dark font-display font-black text-xl tracking-tight uppercase italic shadow-2xl hover:opacity-90 transform active:scale-[0.98] transition-all ring-12 ring-gold/5 flex items-center justify-center gap-4 animate-in zoom-in-95 duration-300"
          >
            <span>✨</span> USE PHOTOS FOR POST IDEAS
          </button>
        )}

        {!isLoading && (
          <button 
            onClick={onTextOnly}
            className={`w-full py-5 rounded-[24px] border border-dark-border text-gray-400 font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${uploadedFiles.length > 0 ? 'bg-transparent' : 'bg-dark-card hover:text-gold hover:border-gold/30'}`}
          >
            <span>✍️</span> {uploadedFiles.length > 0 ? 'OR START FROM TEXT ONLY' : 'START WITH TEXT ONLY'}
          </button>
        )}
      </div>
    </div>
  );
};

export default UploadSection;
