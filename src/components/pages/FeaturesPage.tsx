import { ShieldCheckIcon, SparklesIcon, SwatchIcon, BoltIcon } from '@/components/ui';

export function FeaturesPage() {
  return (
    <div className="animate-fade-in py-10 max-w-5xl mx-auto">
      <div className="text-center mb-16 space-y-4">
        <span className="text-indigo-600 font-bold tracking-wider text-sm uppercase">为什么选择 PhotoLabs</span>
        <h1 className="text-4xl font-bold text-zinc-900">AI 驱动的艺术人像创作</h1>
        <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
          基于 Google Gemini 视觉模型，结合安全可靠的云端架构，为您带来专业级的艺术创作体验。
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
         {/* Feature 1 */}
         <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
              <SparklesIcon />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-3">Gemini 3 Pro 视觉模型</h3>
            <p className="text-zinc-500 leading-relaxed">
              采用 Google 最新一代视觉生成模型，精准理解人物特征并进行艺术化重构，生成 2K 高清艺术作品，细节层次丰富。
            </p>
         </div>

         {/* Feature 2 */}
         <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
              <SwatchIcon />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-3">精选艺术风格</h3>
            <p className="text-zinc-500 leading-relaxed">
              内置 6 款专业调校的艺术风格，涵盖电影叙事、赛博朋克、极简光影等流派。每款风格支持自定义参数，一键获得独特效果。
            </p>
         </div>

         {/* Feature 3 */}
         <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6">
              <ShieldCheckIcon />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-3">安全云端架构</h3>
            <p className="text-zinc-500 leading-relaxed">
              基于 Supabase 云端架构，AI 提示词与 API 密钥完全由服务端管理。您的照片在传输过程中加密，不会被持久存储。
            </p>
         </div>

         {/* Feature 4 */}
         <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
              <BoltIcon />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-3">简洁创作流程</h3>
            <p className="text-zinc-500 leading-relaxed">
              三步完成创作：选择风格 → 上传照片 → 调整参数。无需专业技能，实时预览生成效果，支持一键下载高清成品。
            </p>
         </div>
      </div>
    </div>
  );
}
