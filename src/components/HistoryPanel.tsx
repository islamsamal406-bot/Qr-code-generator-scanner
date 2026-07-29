import React, { useState } from "react";
import { HistoryItem } from "../types";
import { History, Search, Trash2, Copy, Download, ExternalLink, Check, BookmarkCheck } from "lucide-react";

interface Props {
  history: HistoryItem[];
  onSelectHistoryItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
  onDeleteHistoryItem: (id: string) => void;
}

export const HistoryPanel: React.FC<Props> = ({
  history,
  onSelectHistoryItem,
  onClearHistory,
  onDeleteHistoryItem,
}) => {
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = history.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.content.toLowerCase().includes(search.toLowerCase()) ||
      item.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm max-w-3xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            My Saved QR Codes ({history.length})
          </h2>
          <p className="text-xs text-slate-500">
            Access your previously generated and saved QR codes offline at any time.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="py-12 text-center text-slate-400 space-y-2">
          <BookmarkCheck className="w-10 h-10 mx-auto text-slate-300" />
          <p className="text-xs font-medium">No saved QR codes yet.</p>
          <p className="text-[11px] text-slate-400">
            Create a QR code and click "Save Code" in the live preview to keep it here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search history by title, type, or URL..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 transition space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                      {item.type}
                    </span>
                    <span className="text-[10px] text-slate-400">{item.createdAt}</span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] font-mono text-slate-500 truncate mt-0.5">
                    {item.content}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => onSelectHistoryItem(item)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                  >
                    Edit & Export <ExternalLink className="w-3 h-3" />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(item.content);
                        setCopiedId(item.id);
                        setTimeout(() => setCopiedId(null), 2000);
                      }}
                      className="p-1.5 text-slate-500 hover:text-slate-800 transition"
                      title="Copy Content"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => onDeleteHistoryItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition"
                      title="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
