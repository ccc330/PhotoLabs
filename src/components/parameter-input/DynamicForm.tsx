import { StyleOption } from '@/types';
import { ParameterOption } from './ParameterOption';

interface DynamicFormProps {
  parsedVariables: StyleOption[];
  promptVariables: Record<string, string>;
  onVariableChange: (originalText: string, value: string) => void;
  compact?: boolean;
}

export function DynamicForm({ parsedVariables, promptVariables, onVariableChange, compact = false }: DynamicFormProps) {
  if (parsedVariables.length === 0) return null;

  return (
    <div className={compact ? "space-y-6" : "mt-6 bg-white rounded-3xl shadow-xl border border-gray-100 p-8"}>
      {compact && (
        <p className="text-sm text-zinc-500">
          请根据喜好调整以下画面细节：
        </p>
      )}
      {parsedVariables.map((v) => (
        <ParameterOption
          key={v.key}
          label={v.label}
          options={v.choices}
          selectedValue={promptVariables[v.originalText] || v.choices[0]}
          onSelect={(value) => onVariableChange(v.originalText, value)}
        />
      ))}
    </div>
  );
}
