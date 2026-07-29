import React from "react";
import { UrlFormData } from "../../types";
import { Link2, Sparkles } from "lucide-react";

interface Props {
  data: UrlFormData;
  onChange: (data: UrlFormData) => void;
  onAiAssist?: () => void;
}

export const UrlForm: React.FC<Props> = ({ data, onChange, onAiAssist }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Website URL
        </label>
        <div className="relative rounded-lg shadow-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Link2 className="w-5 h-5" />
          </div>
          <input
            type="url"
            value={data.url}
            onChange={(e) => onChange({ ...data, url: e.target.value })}
            placeholder="https://www.example.com"
            className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition"
          />
          {onAiAssist && (
            <button
              type="button"
              onClick={onAiAssist}
              title="AI Format & Polish URL"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-600 hover:text-blue-700 transition"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="mt-1.5 text-xs text-slate-500">
          Enter any valid web link (e.g., https://yourdomain.com, landing page, social profile).
        </p>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <input
          type="checkbox"
          id="shortenUrl"
          checked={data.shorten || false}
          onChange={(e) => onChange({ ...data, shorten: e.target.checked })}
          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
        />
        <label htmlFor="shortenUrl" className="text-sm text-slate-700 dark:text-slate-300 font-medium">
          Optimize URL for denser QR encoding
        </label>
      </div>
    </div>
  );
};
