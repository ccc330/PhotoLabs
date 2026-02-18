import { GenerationStatus } from '@/types';

interface GenerateButtonProps {
  status: GenerationStatus;
  onGenerate: () => void;
  errorMsg: string | null;
}

export function GenerateButton({ status, onGenerate, errorMsg }: GenerateButtonProps) {
  return (
    <div className="mt-6 pt-6 border-t border-gray-100">
      {errorMsg && (
        <div className="bg-red-50 text-red-600 border border-red-100 px-4 py-3 rounded-xl text-sm mb-4">
          {errorMsg}
        </div>
      )}

      <button
        onClick={onGenerate}
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
  );
}
