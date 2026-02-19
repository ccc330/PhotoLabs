import React from 'react';
import { PublicPortraitStyle } from '@/types';
import { UploadIcon } from '@/components/ui';

interface UploadZoneProps {
  selectedStyle: PublicPortraitStyle;
  uploadedImage: string | null;
  isCompressing?: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReupload: () => void;
}

export function UploadZone({
  selectedStyle,
  uploadedImage,
  isCompressing = false,
  onFileUpload,
  onReupload
}: UploadZoneProps) {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-4 md:p-8">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h3 className="text-center text-lg md:text-xl font-bold w-full">上传你的照片</h3>
      </div>

      {/* 压缩中状态 */}
      {isCompressing ? (
        <div className="aspect-square sm:aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] rounded-2xl bg-gray-50 flex flex-col items-center justify-center">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full mb-4" />
          <span className="text-zinc-600 font-medium">正在优化图片...</span>
          <span className="text-zinc-400 text-sm mt-1">大图将自动压缩</span>
        </div>
      ) : uploadedImage ? (
        // 已上传图片 - 显示在框内
        <div className="relative">
          <div className="aspect-square sm:aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] rounded-2xl overflow-hidden bg-gray-100">
            <img
              src={uploadedImage}
              alt="Uploaded"
              className="w-full h-full object-contain"
            />
          </div>
          <button
            onClick={onReupload}
            className="absolute top-3 right-3 text-xs text-white bg-black/50 hover:bg-black/70 backdrop-blur font-medium px-3 py-1.5 rounded-full transition-colors min-h-[36px]"
          >
            重新上传
          </button>
        </div>
      ) : (
        // 未上传 - 显示上传区域
        <label className="block w-full aspect-square sm:aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-400 transition-all cursor-pointer flex flex-col items-center justify-center text-center p-4 md:p-8 group">
          <input type="file" className="hidden" accept="image/*" onChange={onFileUpload} />
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white shadow-md flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform">
            <UploadIcon className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <span className="text-base md:text-lg font-semibold text-zinc-700 mb-1">点击上传参考图片</span>
          <p className="text-sm text-zinc-400">支持 JPEG 或 PNG，大图将自动压缩</p>
        </label>
      )}

      <p className="text-center text-xs text-zinc-400 mt-3 md:mt-4">
        当前风格要求: {selectedStyle.userInstruction}
      </p>
    </div>
  );
}
