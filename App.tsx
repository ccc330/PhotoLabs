import React, { useState, useMemo, useEffect } from 'react';
import { PORTRAIT_STYLES } from './constants';
import { PortraitStyle, GenerationStatus } from './types';
import { generatePortraitImage } from './services/geminiService';
import { ComparisonSlider } from './components/ComparisonSlider';

// UI Icons
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mb-3 text-indigo-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);

const PhotoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
    <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 12.75l-3-3m0 0l-3 3m3-3v12" transform="rotate(180 12 12)" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v13.5m0 0l-3.75-3.75M12 16.5l3.75-3.75" />
  </svg>
);

const GithubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

const BoltIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
);

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
);

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const SwatchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
    </svg>
);

type View = 'home' | 'features' | 'about' | 'upload' | 'workspace';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [apiKeyReady, setApiKeyReady] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<PortraitStyle | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [promptVariables, setPromptVariables] = useState<Record<string, string>>({});

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setApiKeyReady(hasKey);
      } else {
        setApiKeyReady(true);
      }
    };
    checkKey();
  }, []);

  const handleConnectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setApiKeyReady(true);
      setErrorMsg(null);
    }
  };

  useEffect(() => {
    setPromptVariables({});
    setGeneratedImage(null);
    setStatus('idle');
  }, [selectedStyle]);

  const handleStyleSelect = (style: PortraitStyle) => {
    setSelectedStyle(style);
    setCurrentView('upload');
  };

  const parsedVariables = useMemo(() => {
    if (!selectedStyle) return [];
    const regex = /\[(.*?)\]/g;
    const matches = [...selectedStyle.promptTemplate.matchAll(regex)];
    return matches.map((match, index) => {
      const options = match[1].split('/').map(s => s.trim());
      return {
        id: `var_${index}`,
        originalText: match[0],
        options: options
      };
    });
  }, [selectedStyle]);

  useEffect(() => {
    if (parsedVariables.length > 0 && Object.keys(promptVariables).length === 0) {
      const defaults: Record<string, string> = {};
      parsedVariables.forEach(v => {
        defaults[v.originalText] = v.options[0];
      });
      setPromptVariables(defaults);
    }
  }, [parsedVariables, promptVariables]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("图片大小不能超过 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setGeneratedImage(null);
        setStatus('idle');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVariableChange = (originalText: string, value: string) => {
    setPromptVariables(prev => ({
      ...prev,
      [originalText]: value
    }));
  };

  const handleGenerate = async () => {
    if (!uploadedImage || !selectedStyle) return;
    setStatus('processing');
    setErrorMsg(null);

    try {
      let finalPrompt = selectedStyle.promptTemplate;
      Object.entries(promptVariables).forEach(([key, value]) => {
        const escapedKey = key.replace(/\[/g, '\\[').replace(/\]/g, '\\]');
        finalPrompt = finalPrompt.replace(new RegExp(escapedKey, 'g'), value);
      });

      const result = await generatePortraitImage(uploadedImage, finalPrompt);
      setGeneratedImage(result);
      setStatus('completed');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      const message = err.message || "";
      if (
        message.includes('403') || 
        message.includes('permission') || 
        message.includes('Requested entity was not found')
      ) {
        setApiKeyReady(false);
        setErrorMsg("API Key 验证失败，请重新选择有效的付费 Key。");
        return;
      }
      setErrorMsg(message || "生成失败，请重试。");
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `photolabs-art-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetAll = () => {
    setUploadedImage(null);
    setGeneratedImage(null);
    setStatus('idle');
    setSelectedStyle(null);
    setCurrentView('home');
  };

  const NavItem = ({ view, label }: { view: View, label: string }) => (
      <span 
        onClick={() => setCurrentView(view)}
        className={`cursor-pointer transition-colors ${currentView === view ? 'text-zinc-900 font-semibold' : 'hover:text-zinc-900'}`}
      >
        {label}
      </span>
  );

  // -------------------------------------------------------------------------
  // Render: API Gate (Light Mode)
  // -------------------------------------------------------------------------
  if (!apiKeyReady) {
    return (
      <div className="min-h-screen bg-gray-50 text-zinc-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-md w-full bg-white border border-gray-100 p-10 rounded-3xl shadow-xl text-center z-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
               <PhotoIcon />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-3 text-zinc-900">
            PhotoLabs AI
          </h1>
          <p className="text-zinc-500 mb-8 leading-relaxed text-sm">
            高质量 2K 人像生成需要付费 API Key 支持。<br/>请连接您的 Google Cloud Key 以继续。
          </p>

          <button 
            onClick={handleConnectKey}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-200 mb-6 flex items-center justify-center gap-2"
          >
            连接 API Key
          </button>
          
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-xs text-indigo-500 hover:underline">
             了解 API 计费说明
          </a>
          
          {errorMsg && (
            <div className="mt-6 p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-500">
              {errorMsg}
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Render: Main App (Light Mode)
  // -------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-indigo-100 selection:text-indigo-900 pb-20">
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={resetAll}>
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <PhotoIcon />
            </div>
            <span className="text-lg font-bold tracking-tight text-zinc-900">PhotoLabs</span>
          </div>
          
          {/* Nav Links (Visual) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500">
            <NavItem view="home" label="首页" />
            <NavItem view="features" label="功能" />
            <NavItem view="about" label="关于" />
          </nav>

          <div className="flex items-center gap-4">
            <a href="#" className="text-zinc-400 hover:text-zinc-900 transition-colors">
              <GithubIcon />
            </a>
            {window.aistudio && (
               <button 
                onClick={() => window.aistudio?.openSelectKey().then(() => setApiKeyReady(true))}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-zinc-600 px-3 py-1.5 rounded-full border border-gray-200 transition-colors"
               >
                 更换 Key
               </button>
            )}
          </div>
        </div>
      </header>

      <main className="pt-32 max-w-7xl mx-auto px-4 md:px-8">
        
        {/* VIEW: HOME */}
        {currentView === 'home' && (
          <>
            {/* Step 1: Style Selection (Home) */}
            <div className="animate-fade-in pb-20">
              <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight">
                  AI 人像生成工具
                </h1>
                <p className="text-lg text-zinc-500">
                  上传你的照片，选择喜欢的艺术风格，让 AI 为你创作独特的艺术人像
                </p>
              </div>

              <div className="mb-12 text-center">
                <h2 className="text-2xl font-bold text-zinc-800">选择你的艺术风格</h2>
                <p className="text-zinc-500 mt-2">我们为你准备了 6 种独特的艺术风格，每种风格都能带来不同的视觉体验</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {PORTRAIT_STYLES.map((style) => (
                  <div
                    key={style.id}
                    onClick={() => handleStyleSelect(style)}
                    className={`group cursor-pointer flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-2 ${
                      selectedStyle?.id === style.id
                        ? 'border-indigo-600 ring-4 ring-indigo-50 translate-y-[-4px]'
                        : 'border-transparent hover:-translate-y-1'
                    }`}
                  >
                    {/* Style Preview Area (Gradient) */}
                    <div className={`h-48 w-full bg-gradient-to-br ${style.gradient} relative overflow-hidden`}>
                       <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors"></div>
                       <div className="absolute bottom-4 left-4">
                          <span className="bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full shadow-sm text-zinc-900">
                            2K Resolution
                          </span>
                       </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-zinc-900 mb-2">{style.label}</h3>
                      <p className="text-sm text-zinc-500 leading-relaxed mb-4">
                        {style.description}
                      </p>
                      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                         <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                           建议: {style.userInstruction.substring(0, 10)}...
                         </span>
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                           selectedStyle?.id === style.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                         }`}>
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                           </svg>
                         </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* VIEW: UPLOAD */}
        {currentView === 'upload' && selectedStyle && (
          <div className="animate-fade-in max-w-3xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 mb-6 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
              </svg>
              返回首页
            </button>

            {/* Style Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-zinc-900 mb-2">{selectedStyle.label}</h1>
              <p className="text-zinc-500">{selectedStyle.description}</p>
            </div>

            {/* Upload Area */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
              <h3 className="text-center text-xl font-bold mb-6">上传你的照片</h3>
              <label className="block w-full aspect-[21/9] rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-400 transition-all cursor-pointer flex flex-col items-center justify-center text-center p-8 group">
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UploadIcon />
                </div>
                <span className="text-base font-semibold text-zinc-700 mb-1">点击上传参考图片</span>
                <p className="text-sm text-zinc-400">支持 JPEG 或 PNG，最大 5MB</p>
              </label>
              <p className="text-center text-xs text-zinc-400 mt-4">
                当前风格要求: {selectedStyle.userInstruction}
              </p>
            </div>

            {/* Uploaded Image Preview */}
            {uploadedImage && (
              <div className="mt-6 bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-zinc-900">已上传图片</h3>
                  <button
                    onClick={() => setUploadedImage(null)}
                    className="text-xs text-red-500 hover:text-red-700 font-medium px-3 py-1 bg-red-50 rounded-full"
                  >
                    重新上传
                  </button>
                </div>
                <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100">
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* Parameters */}
            {parsedVariables.length > 0 && (
              <div className="mt-6 bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                <h3 className="text-lg font-bold text-zinc-900 mb-6">调整画面细节</h3>
                <div className="space-y-6">
                  {parsedVariables.map((v) => (
                    <div key={v.id}>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                        选项 {v.id.split('_')[1]}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {v.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleVariableChange(v.originalText, opt)}
                            className={`px-3 py-2.5 text-sm rounded-xl font-medium transition-all text-left border ${
                              promptVariables[v.originalText] === opt
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200'
                                : 'bg-white border-gray-200 text-zinc-600 hover:border-indigo-300 hover:bg-indigo-50'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enter Workspace Button */}
            {uploadedImage && (
              <div className="mt-6">
                <button
                  onClick={() => setCurrentView('workspace')}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-indigo-200 transition-all"
                >
                  进入工作区
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW: FEATURES */}
        {currentView === 'features' && (
           <div className="animate-fade-in py-10 max-w-5xl mx-auto">
             <div className="text-center mb-16 space-y-4">
               <span className="text-indigo-600 font-bold tracking-wider text-sm uppercase">为什么选择 PhotoLabs</span>
               <h1 className="text-4xl font-bold text-zinc-900">下一代 AI 艺术创作体验</h1>
               <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
                 结合顶尖的生成式 AI 模型与极致的前端交互设计，为您带来前所未有的创作自由。
               </p>
             </div>

             <div className="grid md:grid-cols-2 gap-8">
                {/* Feature 1 */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow">
                   <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                     <EyeIcon />
                   </div>
                   <h3 className="text-xl font-bold text-zinc-900 mb-3">超高清 2K 分辨率</h3>
                   <p className="text-zinc-500 leading-relaxed">
                     不同于普通的 AI 生成工具，我们专注于高保真输出。直接生成 2048x2048 分辨率的艺术作品，发丝级细节清晰可见，满足打印级需求。
                   </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow">
                   <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                     <SparklesIcon />
                   </div>
                   <h3 className="text-xl font-bold text-zinc-900 mb-3">Google Gemini 3 Pro 驱动</h3>
                   <p className="text-zinc-500 leading-relaxed">
                     采用 Google 最新一代 Gemini 3 Pro 视觉模型，具备卓越的图像理解与生成能力，能够精准捕捉人物神态并进行艺术化重构。
                   </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow">
                   <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
                     <SwatchIcon />
                   </div>
                   <h3 className="text-xl font-bold text-zinc-900 mb-3">大师级艺术风格</h3>
                   <p className="text-zinc-500 leading-relaxed">
                     内置 6 款经过数百次调试的 Prompt 模板，涵盖胶片摄影、赛博朋克、极简光影等多种流派，一键即可获得专业艺术家的创作效果。
                   </p>
                </div>

                {/* Feature 4 */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow">
                   <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                     <BoltIcon />
                   </div>
                   <h3 className="text-xl font-bold text-zinc-900 mb-3">极速创作流程</h3>
                   <p className="text-zinc-500 leading-relaxed">
                     简化的用户界面，无需复杂的参数调试。从上传照片到获取成品仅需三步，支持自定义核心参数，让创作既简单又自由。
                   </p>
                </div>
             </div>
           </div>
        )}

        {/* VIEW: WORKSPACE */}
        {currentView === 'workspace' && uploadedImage && selectedStyle && (
          <div className="animate-fade-in grid lg:grid-cols-12 gap-8 h-[calc(100vh-10rem)] min-h-[600px]">

            {/* Left Column: Controls */}
            <div className="lg:col-span-4 flex flex-col h-full">
              <div className="bg-white border border-gray-100 shadow-xl rounded-3xl p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                  <div>
                    <h2 className="text-lg font-bold text-zinc-900">{selectedStyle.label}</h2>
                    <p className="text-xs text-zinc-500">Gemini 3 Pro • 2K Mode</p>
                  </div>
                  <button onClick={() => setCurrentView('upload')} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-3 py-1 bg-indigo-50 rounded-full">
                    返回上传
                  </button>
                </div>

                {/* Parameters */}
                {parsedVariables.length > 0 ? (
                  <div className="space-y-6 overflow-y-auto pr-2 flex-1 custom-scrollbar">
                     <p className="text-sm text-zinc-500">
                       请根据喜好调整以下画面细节：
                     </p>
                     {parsedVariables.map((v) => (
                       <div key={v.id}>
                         <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                            选项 {v.id.split('_')[1]}
                         </label>
                         <div className="grid grid-cols-2 gap-2">
                           {v.options.map((opt) => (
                             <button
                               key={opt}
                               onClick={() => handleVariableChange(v.originalText, opt)}
                               className={`px-3 py-2.5 text-sm rounded-xl font-medium transition-all text-left border ${
                                 promptVariables[v.originalText] === opt
                                   ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200'
                                   : 'bg-white border-gray-200 text-zinc-600 hover:border-indigo-300 hover:bg-indigo-50'
                               }`}
                             >
                               {opt}
                             </button>
                           ))}
                         </div>
                       </div>
                     ))}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-zinc-400 text-sm text-center px-4 bg-gray-50 rounded-xl my-4">
                    此风格为全自动生成，无需额外设置。
                  </div>
                )}

                {/* Generate Button */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  {errorMsg && (
                    <div className="bg-red-50 text-red-600 border border-red-100 px-4 py-3 rounded-xl text-sm mb-4">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    onClick={handleGenerate}
                    disabled={status === 'processing'}
                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
                      status === 'processing'
                        ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed shadow-none'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                    }`}
                  >
                    {status === 'processing' ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        AI 正在绘制中...
                      </>
                    ) : (
                      '开始绘制'
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Preview */}
            <div className="lg:col-span-8 h-full flex flex-col">
              <div className="relative flex-1 bg-gray-100 rounded-3xl border border-gray-200 overflow-hidden flex items-center justify-center shadow-inner">

                {status === 'processing' && (
                   <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center">
                      <div className="w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden mb-6">
                        <div className="h-full bg-indigo-600 animate-progress"></div>
                      </div>
                      <h3 className="text-xl font-bold text-zinc-900 mb-2">正在生成艺术人像</h3>
                      <p className="text-zinc-500 text-sm">Gemini 3 Pro 正在进行 2K 渲染，请稍候...</p>
                   </div>
                )}

                {generatedImage ? (
                  <ComparisonSlider beforeImage={uploadedImage} afterImage={generatedImage} />
                ) : (
                  <div className="relative w-full h-full p-12 flex items-center justify-center">
                    <img
                      src={uploadedImage}
                      alt="Preview"
                      className="max-h-full max-w-full object-contain rounded-lg shadow-2xl opacity-90 transition-all duration-500"
                    />
                    <div className="absolute top-6 left-6">
                       <span className="bg-black/50 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-medium">原始图片预览</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              {generatedImage && status === 'completed' && (
                <div className="h-20 mt-6 bg-white border border-gray-200 shadow-lg rounded-2xl flex items-center justify-between px-8 animate-fade-in-up">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-zinc-900 font-medium">生成完毕</span>
                    <span className="text-zinc-300 mx-2">|</span>
                    <span className="text-zinc-500 text-sm">2048 x 2048 px</span>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="flex items-center px-6 py-2.5 bg-zinc-900 text-white rounded-xl font-semibold hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-200"
                  >
                    <DownloadIcon />
                    下载图片
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW: ABOUT */}
        {currentView === 'about' && (
           <div className="animate-fade-in py-10 max-w-3xl mx-auto">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                 <div className="h-48 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                        <PhotoIcon />
                      </div>
                      <h1 className="text-3xl font-bold">关于 PhotoLabs</h1>
                    </div>
                 </div>
                 <div className="p-10 space-y-8">
                    <div>
                      <h2 className="text-xl font-bold text-zinc-900 mb-4">我们的愿景</h2>
                      <p className="text-zinc-500 leading-loose">
                        PhotoLabs 是一个致力于降低艺术创作门槛的 AI 实验项目。我们相信，每个人都应该拥有将平凡照片转化为非凡艺术作品的能力。通过结合 Google Gemini 强大的生成式 AI 技术与直观的 Web 交互设计，我们希望激发每一位用户的创造力。
                      </p>
                    </div>
                    
                    <div>
                      <h2 className="text-xl font-bold text-zinc-900 mb-4">技术架构</h2>
                      <p className="text-zinc-500 leading-loose">
                        本应用构建于 React 19 框架之上，利用 Tailwind CSS 实现现代化的响应式设计。核心 AI 能力由 Google Cloud Vertex AI 的 Gemini 3 Pro 模型提供支持，通过精心设计的 Prompt Engineering 管道，确保每一次生成都既符合艺术美学，又忠实于原图的人物特征。
                      </p>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                      <h3 className="font-bold text-zinc-800 mb-2">免责声明</h3>
                      <p className="text-sm text-zinc-500">
                        本工具生成的图片仅供个人娱乐与非商业用途。生成的图像由 AI 模型即时演算，可能包含不可预测的内容。请勿上传涉及隐私、暴力或版权争议的图片。使用本服务即代表您同意 Google Generative AI 的使用条款。
                      </p>
                    </div>
                 </div>
              </div>
           </div>
        )}
      </main>

      <style>{`
        @keyframes progress {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 50%; }
          100% { width: 100%; transform: translateX(0); }
        }
        .animate-progress {
          animation: progress 8s ease-out forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e4e4e7;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}