import { StyleOption } from '@/types';

interface ParameterOptionProps {
  label: string;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

export function ParameterOption({ label, options, selectedValue, onSelect }: ParameterOptionProps) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
        {label}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={`px-3 py-3 sm:py-2.5 text-sm rounded-xl font-medium transition-all text-left border min-h-[44px] active:scale-[0.98] ${
              selectedValue === opt
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'bg-white border-gray-200 text-zinc-600 hover:border-indigo-300 hover:bg-indigo-50 active:bg-indigo-100'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
