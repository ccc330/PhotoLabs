export function GenerationProgress() {
  return (
    <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center">
       <div className="w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden mb-6">
         <div className="h-full bg-indigo-600 animate-progress"></div>
       </div>
       <h3 className="text-xl font-bold text-zinc-900 mb-2">正在生成艺术人像</h3>
       <p className="text-zinc-500 text-sm">Gemini 3 Pro 正在进行 2K 渲染，请稍候...</p>
    </div>
  );
}
