
import React, { useState } from 'react';
import { analyzeContent, generateViralVariants, generateScriptOnly } from './services/geminiService';
import { UploadedFile, ContentAnalysis, ViralResults, Platform, ToneType, ScriptType, ContentLength, ScriptResult } from './types';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import PlatformSelector from './components/PlatformSelector';
import PreviewSection from './components/PreviewSection';
import SuccessModal from './components/SuccessModal';
import ScriptGenerator from './components/ScriptGenerator';

type TabType = 'post' | 'script';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('post');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isTextOnly, setIsTextOnly] = useState(false);
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [postContext, setPostContext] = useState('');
  const [isUploadFinalized, setIsUploadFinalized] = useState(false);
  
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([
    Platform.TikTok,
    Platform.Instagram,
    Platform.YouTubeShorts
  ]);
  const [selectedTone, setSelectedTone] = useState<ToneType>('energetic');
  const [customTone, setCustomTone] = useState('');
  
  const [results, setResults] = useState<ViralResults | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [scriptResult, setScriptResult] = useState<ScriptResult | null>(null);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);

  const handleFileUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).slice(0, 4 - uploadedFiles.length);
    if (fileArray.length === 0) return;

    const processFiles = fileArray.map(file => {
      return new Promise<UploadedFile>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve({
            file,
            previewUrl: URL.createObjectURL(file),
            type: 'image',
            base64
          });
        };
        reader.readAsDataURL(file);
      });
    });

    const newResults = await Promise.all(processFiles);
    setUploadedFiles(prev => [...prev, ...newResults]);
    setIsTextOnly(false);
  };

  const removePhoto = (index: number) => {
    setUploadedFiles(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].previewUrl);
      updated.splice(index, 1);
      return updated;
    });
  };

  const finalizeUpload = async () => {
    setIsAnalyzing(true);
    try {
      const analysisData = await analyzeContent(uploadedFiles.map(r => ({
        base64: r.base64!,
        mimeType: r.file.type
      })), postContext);
      
      setAnalysis(analysisData);
      if (!postContext) setPostContext(analysisData.topic);
      setIsUploadFinalized(true);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateScript = async (formula: ScriptType, length: ContentLength, tone: ToneType, customInput: string, customDurationSeconds?: number, useBranding?: boolean) => {
    setIsGeneratingScript(true);
    try {
      const result = await generateScriptOnly(formula, length, tone, customInput, customDurationSeconds, false);
      setScriptResult(result);
    } catch (error) {
      console.error("Script generation failed", error);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleUseScriptForPost = (content: string) => {
    setPostContext(content);
    setIsTextOnly(true);
    setResults(null);
    setActiveTab('post');
  };

  const handleGenerateViral = async (useBranding: boolean) => {
    setIsGenerating(true);
    try {
      const viralData = await generateViralVariants(analysis, selectedTone, customTone, undefined, postContext, false);
      setResults(viralData);
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefine = async (request: string) => {
    setIsGenerating(true);
    try {
      const viralData = await generateViralVariants(analysis, selectedTone, customTone, request, postContext, false);
      setResults(viralData);
    } catch (error) {
      console.error("Refine failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetPostTab = () => {
    uploadedFiles.forEach(f => URL.revokeObjectURL(f.previewUrl));
    setUploadedFiles([]);
    setAnalysis(null);
    setPostContext('');
    setIsTextOnly(false);
    setResults(null);
    setIsUploadFinalized(false);
  };

  return (
    <div className="min-h-screen bg-dark safe-bottom flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 pt-6 pb-24">
        {activeTab === 'post' ? (
          <div className="animate-slide-up space-y-12">
            {!results ? (
              <>
                {!isUploadFinalized && !isTextOnly && (
                  <UploadSection 
                    uploadedFiles={uploadedFiles}
                    onUpload={handleFileUpload}
                    onRemove={removePhoto}
                    onTextOnly={() => setIsTextOnly(true)}
                    onFinalize={finalizeUpload}
                    isLoading={isAnalyzing} 
                  />
                )}
                {(isUploadFinalized || isTextOnly) && (
                  <div className="space-y-10">
                    <PlatformSelector 
                      selected={selectedPlatforms} 
                      onChange={setSelectedPlatforms} 
                      selectedTone={selectedTone}
                      onToneChange={setSelectedTone}
                      customTone={customTone}
                      onCustomToneChange={setCustomTone}
                      onGenerate={handleGenerateViral}
                      isGenerating={isGenerating}
                      uploadedFiles={uploadedFiles}
                      postContext={postContext}
                      onPostContextChange={setPostContext}
                    />
                    <button onClick={resetPostTab} className="w-full py-4 text-gray-500 font-black uppercase text-[10px] tracking-widest hover:text-red-500 transition-colors flex items-center justify-center gap-2"><span>✕</span> RESET SESSION</button>
                  </div>
                )}
              </>
            ) : (
              <PreviewSection 
                results={results} 
                selectedPlatforms={selectedPlatforms} 
                onRefine={handleRefine}
                onPost={() => setShowSuccess(true)}
                isGenerating={isGenerating}
                uploadedFiles={uploadedFiles}
                postContext={postContext}
              />
            )}
          </div>
        ) : (
          <div className="animate-slide-up space-y-8">
            <h2 className="font-display text-3xl font-black italic uppercase tracking-tighter dark:text-white leading-none">Content <span className="gold-text-gradient">Script</span></h2>
            <ScriptGenerator 
              onGenerate={handleGenerateScript} 
              isGenerating={isGeneratingScript} 
              result={scriptResult}
              uploadedFiles={uploadedFiles}
              onUpload={handleFileUpload}
              onRemovePhoto={removePhoto}
              onUseForPost={handleUseScriptForPost}
            />
          </div>
        )}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 glass-effect border-t border-dark-border safe-bottom z-[60]">
        <div className="max-w-4xl mx-auto flex justify-around p-2">
          <button onClick={() => setActiveTab('post')} className={`flex flex-col items-center gap-1 flex-1 py-3 ${activeTab === 'post' ? 'text-gold' : 'text-gray-500'}`}><span className="text-[10px] font-black uppercase tracking-widest">Post</span></button>
          <button onClick={() => setActiveTab('script')} className={`flex flex-col items-center gap-1 flex-1 py-3 ${activeTab === 'script' ? 'text-gold' : 'text-gray-500'}`}><span className="text-[10px] font-black uppercase tracking-widest">Script</span></button>
        </div>
      </nav>
      {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}
    </div>
  );
};

export default App;
