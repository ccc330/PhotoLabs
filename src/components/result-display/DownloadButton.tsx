import { DownloadIcon } from '@/components/ui';

interface DownloadButtonProps {
  onDownload: () => void;
  imageResolution?: string;
}

export function DownloadButton({ onDownload, imageResolution = '2048 x 2048 px' }: DownloadButtonProps) {
  return (
    <div className="h-20 mt-6 bg-white border border-gray-200 shadow-lg rounded-2xl flex items-center justify-between px-8 animate-fade-in-up">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
        <span className="text-zinc-900 font-medium">生成完毕</span>
        <span className="text-zinc-300 mx-2">|</span>
        <span className="text-zinc-500 text-sm">{imageResolution}</span>
      </div>
      <button
        onClick={onDownload}
        className="flex items-center px-6 py-2.5 bg-zinc-900 text-white rounded-xl font-semibold hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-200"
      >
        <DownloadIcon />
        下载图片
      </button>
    </div>
  );
}
