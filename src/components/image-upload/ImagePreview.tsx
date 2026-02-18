import { PhotoIcon } from '@/components/ui';

interface ImagePreviewProps {
  uploadedImage: string | null;
  onReupload: () => void;
}

export function ImagePreview({ uploadedImage, onReupload }: ImagePreviewProps) {
  if (!uploadedImage) return null;

  return (
    <div className="mt-6 bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-zinc-900">已上传图片</h3>
        <button
          onClick={onReupload}
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
  );
}
