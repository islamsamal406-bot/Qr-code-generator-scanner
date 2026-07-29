import React from "react";
import { TextFormData } from "../../types";
import { FileText, Sparkles } from "lucide-react";

interface Props {
  data: TextFormData;
  onChange: (data: TextFormData) => void;
  onAiAssist?: () => void;
}

export const TextForm: React.FC<Props> = ({ data, onChange, onAiAssist }) => {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Plain Text Content
          </label>
          <span className="text-xs text-slate-400">
            {data.text.length} characters
          </span>
        </div>
        <div className="relative">
          <textarea
            rows={4}
            value={data.text}
            onChange={(e) => onChange({ text: e.target.value })}
            placeholder="Enter plain text, notes, coupon code, password, or instructions..."
            className="block w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition"
          />
          {onAiAssist && (
            <button
              type="button"
              onClick={onAiAssist}
              className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Format
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
