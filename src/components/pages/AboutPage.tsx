import { PhotoIcon } from '@/components/ui';

export function AboutPage() {
  return (
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
              <h2 className="text-xl font-bold text-zinc-900 mb-4">项目愿景</h2>
              <p className="text-zinc-500 leading-loose">
                PhotoLabs 致力于让艺术创作变得触手可及。我们相信，每个人都值得拥有一张独特的艺术人像。通过结合 Google Gemini 的生成能力与直观的交互设计，我们希望帮助每一位用户释放创造力。
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-zinc-900 mb-4">技术架构</h2>
              <p className="text-zinc-500 leading-loose">
                前端采用 React 19 + Vite 构建，使用 Tailwind CSS 实现响应式设计。后端基于 Supabase 云平台，通过 Edge Functions 调用 Gemini 3 Pro 视觉模型。AI 提示词模板与 API 密钥完全由服务端管理，确保敏感信息不会暴露到客户端。
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <h3 className="font-bold text-zinc-800 mb-2">使用声明</h3>
              <p className="text-sm text-zinc-500">
                生成图片仅供个人娱乐与非商业用途。AI 生成内容可能存在不可预测性，请勿上传涉及隐私、暴力或版权争议的照片。使用本服务即表示您同意遵守 Google Generative AI 使用条款。
              </p>
            </div>
         </div>
      </div>
    </div>
  );
}
