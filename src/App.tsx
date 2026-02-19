import React, { useState, useEffect, useMemo } from 'react';
import { apiService } from '@/services';
import { downloadImage, compressImage, formatBytes } from '@/utils';
import { Header } from '@/components/layout';
import { StyleGrid } from '@/components/style-selector';
import { UploadZone } from '@/components/image-upload';
import { DynamicForm } from '@/components/parameter-input';
import { GenerateButton, GenerationProgress } from '@/components/generation';
import { ImageComparison, DownloadButton } from '@/components/result-display';
import { FeaturesPage, AboutPage } from '@/components/pages';
import { View, PublicPortraitStyle, GenerationStatus } from '@/types';

// 风格变量标签映射：风格名称 -> 变量索引 -> 标签
const VARIABLE_LABEL_MAP: Record<string, string[]> = {
  '手绘拼贴艺术': ['背景颜色', '手绘图案', '图案颜色'],
};

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [loadingStyles, setLoadingStyles] = useState(true);
  const [styles, setStyles] = useState<PublicPortraitStyle[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<PublicPortraitStyle | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [promptVariables, setPromptVariables] = useState<Record<string, string>>({});
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    // 加载风格列表
    apiService.fetchStylesWithVariables()
      .then(data => {
        setStyles(data);
      })
      .catch(err => {
        console.error('Failed to load styles:', err);
        setErrorMsg('加载风格列表失败');
      })
      .finally(() => {
        setLoadingStyles(false);
      });
  }, []);

  useEffect(() => {
    setPromptVariables({});
    setGeneratedImage(null);
    setStatus('idle');
  }, [selectedStyle]);

  const handleStyleSelect = (style: PublicPortraitStyle) => {
    setSelectedStyle(style);
    setCurrentView('upload');
  };

  const parsedVariables = useMemo(() => {
    if (!selectedStyle) return [];

    // 获取当前风格的标签映射
    const labelMap = VARIABLE_LABEL_MAP[selectedStyle.label] || [];

    // 直接使用前端接收的 variables（由 Edge Function 解析）
    return selectedStyle.variables.map((v, index) => ({
      ...v,
      // 如果有映射标签则使用，否则使用原始标签
      label: labelMap[index] || v.label,
      originalText: v.key  // 用于匹配后端变量
    }));
  }, [selectedStyle?.variables, selectedStyle?.label]);

  useEffect(() => {
    if (parsedVariables.length > 0 && Object.keys(promptVariables).length === 0) {
      const defaults: Record<string, string> = {};
      parsedVariables.forEach(v => {
        defaults[v.originalText] = v.choices[0];
      });
      setPromptVariables(defaults);
    }
  }, [parsedVariables, promptVariables]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      setIsCompressing(true);

      try {
        const result = await compressImage(file);

        // 可选：在控制台输出压缩信息
        if (result.wasCompressed) {
          console.log(`图片已压缩: ${formatBytes(result.originalSize)} → ${formatBytes(result.compressedSize)}`);
        }

        setUploadedImage(result.base64);
        setGeneratedImage(null);
        setStatus('idle');
      } catch (error) {
        console.error('图片压缩失败:', error);
        alert('图片处理失败，请重试');
      } finally {
        setIsCompressing(false);
      }
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
      const result = await apiService.generateImage({
        styleId: selectedStyle.id,
        imageBase64: uploadedImage,
        variables: promptVariables
      });
      setGeneratedImage(result);
      setStatus('completed');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err.message || '生成失败，请重试。');
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      downloadImage(generatedImage, `photolabs-art-${Date.now()}.png`);
    }
  };

  const resetAll = () => {
    setUploadedImage(null);
    setGeneratedImage(null);
    setStatus('idle');
    setSelectedStyle(null);
    setCurrentView('home');
  };

  // Main App
  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-indigo-100 selection:text-indigo-900 pb-20">
      <Header currentView={currentView} setCurrentView={setCurrentView} resetAll={resetAll} />

      <main className="pt-32 max-w-7xl mx-auto px-4 md:px-8">
        {/* VIEW: HOME */}
        {currentView === 'home' && (
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

            {loadingStyles ? (
              <div className="text-center py-20 text-zinc-500">加载风格列表...</div>
            ) : (
              <StyleGrid
                styles={styles}
                selectedStyle={selectedStyle}
                onStyleSelect={handleStyleSelect}
              />
            )}
          </div>
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
                <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08l-4.158 3.96H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
              </svg>
              返回首页
            </button>

            {/* Style Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-zinc-900 mb-2">{selectedStyle.label}</h1>
              <p className="text-zinc-500">{selectedStyle.description}</p>
            </div>

            {/* Upload Area */}
            <UploadZone
              selectedStyle={selectedStyle}
              uploadedImage={uploadedImage}
              isCompressing={isCompressing}
              onFileUpload={handleFileUpload}
              onReupload={() => setUploadedImage(null)}
            />

            {/* Parameters */}
            {parsedVariables.length > 0 && (
              <DynamicForm
                parsedVariables={parsedVariables}
                promptVariables={promptVariables}
                onVariableChange={handleVariableChange}
              />
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
        {currentView === 'features' && <FeaturesPage />}

        {/* VIEW: ABOUT */}
        {currentView === 'about' && <AboutPage />}

        {/* VIEW: WORKSPACE */}
        {currentView === 'workspace' && uploadedImage && selectedStyle && (
          <div className="animate-fade-in grid lg:grid-cols-12 gap-4 lg:gap-8 lg:h-[calc(100vh-10rem)] lg:min-h-[600px]">
            {/* Preview Column - 移动端显示在上方 */}
            <div className="lg:col-span-8 h-[50vh] lg:h-full flex flex-col order-1 lg:order-2">
              <div className="relative flex-1 bg-gray-100 rounded-3xl border border-gray-200 overflow-hidden flex items-center justify-center shadow-inner">
                {status === 'processing' && <GenerationProgress />}

                {generatedImage ? (
                  <ImageComparison beforeImage={uploadedImage} afterImage={generatedImage} />
                ) : (
                  <div className="relative w-full h-full p-4 md:p-12 flex items-center justify-center">
                    <img
                      src={uploadedImage}
                      alt="Preview"
                      className="max-h-full max-w-full object-contain rounded-lg shadow-2xl opacity-90 transition-all duration-500"
                    />
                    <div className="absolute top-4 left-4 md:top-6 md:left-6">
                       <span className="bg-black/50 backdrop-blur text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium">原始图片预览</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              {generatedImage && status === 'completed' && <DownloadButton onDownload={handleDownload} />}
            </div>

            {/* Controls Column - 移动端显示在下方 */}
            <div className="lg:col-span-4 flex flex-col order-2 lg:order-1 max-h-[40vh] lg:max-h-none overflow-y-auto">
              <div className="bg-white border border-gray-100 shadow-xl rounded-3xl p-4 md:p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4 md:mb-6 pb-3 md:pb-4 border-b border-gray-100">
                  <div>
                    <h2 className="text-base md:text-lg font-bold text-zinc-900">{selectedStyle.label}</h2>
                    <p className="text-xs text-zinc-500">Gemini 3 Pro • 2K Mode</p>
                  </div>
                  <button onClick={() => setCurrentView('upload')} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 md:px-3 bg-indigo-50 rounded-full">
                    返回上传
                  </button>
                </div>

                {/* Parameters */}
                {parsedVariables.length > 0 ? (
                  <div className="space-y-4 md:space-y-6 overflow-y-auto pr-2 flex-1 custom-scrollbar">
                     <p className="text-sm text-zinc-500">
                       请根据喜好调整以下画面细节：
                     </p>
                     <DynamicForm
                       parsedVariables={parsedVariables}
                       promptVariables={promptVariables}
                       onVariableChange={handleVariableChange}
                       compact={true}
                     />
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-zinc-400 text-sm text-center px-4 bg-gray-50 rounded-xl my-2 md:my-4">
                    此风格为全自动生成，无需额外设置。
                  </div>
                )}

                {/* Generate Button */}
                <GenerateButton status={status} onGenerate={handleGenerate} errorMsg={errorMsg} />
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
