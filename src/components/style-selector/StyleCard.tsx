import { PublicPortraitStyle } from '@/types';

interface StyleCardProps {
  style: PublicPortraitStyle;
  isSelected: boolean;
  onSelect: (style: PublicPortraitStyle) => void;
}

// 需要微调图片位置的风格列表
const STYLES_WITH_CUSTOM_POSITION = ['手绘拼贴艺术', '胶片慢门抓拍'];

export function StyleCard({ style, isSelected, onSelect }: StyleCardProps) {
  // 判断是否需要自定义图片位置
  const needsCustomPosition = STYLES_WITH_CUSTOM_POSITION.includes(style.label);

  return (
    <div
      key={style.id}
      onClick={() => onSelect(style)}
      className={`group cursor-pointer flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-2 ${
        isSelected
          ? 'border-indigo-600 ring-4 ring-indigo-50 translate-y-[-4px]'
          : 'border-transparent hover:-translate-y-1'
      }`}
    >
      {/* Style Preview Area - Image or Gradient */}
      <div className="h-48 w-full relative overflow-hidden">
        {style.coverImage ? (
          <img
            src={style.coverImage}
            alt={style.label}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            style={needsCustomPosition ? { objectPosition: 'center 20%' } : undefined}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${style.gradient}`}>
            <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors"></div>
          </div>
        )}
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
             isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'
           }`}>
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
             </svg>
           </div>
        </div>
      </div>
    </div>
  );
}
