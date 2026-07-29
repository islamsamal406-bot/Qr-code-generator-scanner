import React, { useState } from "react";
import { Sparkles, X, Send, Check } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  targetType: string;
  onApplyData: (data: any) => void;
}

export const AiAssistantModal: React.FC<Props> = ({
  isOpen,
  onClose,
  targetType,
  onApplyData,
}) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    setResultData(null);

    try {
      const res = await fetch("/api/ai/format-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, type: targetType }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setResultData(json.data);
      } else {
        setError(json.error || "Failed to structure data.");
      }
    } catch (err: any) {
      setError("Network error connecting to Gemini AI.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (resultData) {
      onApplyData(resultData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-md w-full p-6 shadow-xl space-y-4 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-xl text-blue-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
              Gemini AI Smart Formatter
            </h3>
            <p className="text-xs text-slate-500 capitalize">
              Generate structured {targetType} QR data from plain language
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Describe your {targetType} details:
          </label>
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`e.g. ${
              targetType === "vcard"
                ? "Alex Morgan, CTO at NextGen Tech, phone 555-0199, email alex@nextgen.com, address 100 Tech Blvd"
                : targetType === "wifi"
                ? "Home wifi network named Starlink_Home, password SkyNet2026, WPA security"
                : "Enter any raw notes or text..."
            }`}
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

        {resultData && (
          <div className="p-3 bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-slate-700 rounded-xl text-xs space-y-1 font-mono">
            <p className="text-[10px] uppercase font-bold text-blue-700">Structured AI Preview:</p>
            <pre className="whitespace-pre-wrap text-[11px] text-slate-800 dark:text-slate-200">
              {JSON.stringify(resultData, null, 2)}
            </pre>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2">
          {!resultData ? (
            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              {isLoading ? "Formatting..." : "Generate with AI"}
            </button>
          ) : (
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Apply to QR Form
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
