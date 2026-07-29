import React from "react";
import { ExternalLink, Info, X } from "lucide-react";

interface Props {
  type: "leaderboard" | "rectangle" | "footer";
  onDismiss?: () => void;
}

export const AdBanner: React.FC<Props> = ({ type, onDismiss }) => {
  if (type === "leaderboard") {
    return (
      <div className="w-full max-w-5xl mx-auto my-3 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-xl p-3 border border-slate-700/60 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs relative overflow-hidden group">
        <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-blue-500/10 rounded-full blur-xl pointer-events-none"></div>

        <div className="flex items-center gap-3 z-10">
          <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
            Ad
          </span>
          <div>
            <p className="font-bold text-white text-sm">
              🚀 High Performance Cloud Hosting & Domain Registration
            </p>
            <p className="text-slate-300 text-xs hidden sm:block">
              Deploy your web app with 99.99% uptime SLA and free SSL certificates today.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 z-10 w-full sm:w-auto justify-end">
          <a
            href="https://cloud.google.com"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg text-xs shadow-xs transition flex items-center gap-1"
          >
            Claim $300 Credit <ExternalLink className="w-3 h-3" />
          </a>
          {onDismiss && (
            <button onClick={onDismiss} className="text-slate-400 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (type === "rectangle") {
    return (
      <div className="w-full bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 text-center space-y-2 relative overflow-hidden">
        <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
          <span>Sponsor Advertisement</span>
          <Info className="w-3 h-3" />
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-xl p-4 shadow-sm space-y-2 text-left">
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-semibold">
            PRO QR TOOLS
          </span>
          <h4 className="font-extrabold text-sm leading-snug">
            Need Dynamic Vector QR Codes for Print & Marketing?
          </h4>
          <p className="text-[11px] text-indigo-100">
            Generate printable vector PDFs, track real-time scan analytics, and edit URLs on the fly!
          </p>
          <button className="w-full py-2 bg-white text-indigo-700 rounded-lg text-xs font-bold shadow-xs hover:bg-indigo-50 transition text-center cursor-pointer">
            Explore Enterprise Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-3 text-center text-xs text-slate-500">
      <p>
        Supported by free banner advertisements. Scan and create unlimited high quality QR codes for free.
      </p>
    </div>
  );
};
