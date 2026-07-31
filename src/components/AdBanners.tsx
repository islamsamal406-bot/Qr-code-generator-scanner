import React, { useState } from "react";
import { X, RefreshCw } from "lucide-react";

interface Props {
  type: "leaderboard" | "rectangle" | "footer";
  onDismiss?: () => void;
}

export const AdBanner: React.FC<Props> = ({ type, onDismiss }) => {
  const [reloadKey, setReloadKey] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Generate clean srcDoc for isolated iframe rendering to prevent DOM ID collisions
  // Ensures every ad instance on the page gets its own #container-ad68df1ee35043ceeaf4093299608f7d
  const getAdsterraSrcDoc = () => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <base target="_blank" />
  <style>
    * {
      box-sizing: border-box;
    }
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      min-height: 100%;
      background: transparent;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      overflow-x: hidden;
    }
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 8px;
    }
    #container-ad68df1ee35043ceeaf4093299608f7d {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
  </style>
</head>
<body>
  <div id="container-ad68df1ee35043ceeaf4093299608f7d"></div>
  <script async="async" data-cfasync="false" src="https://pl30617209.effectivecpmnetwork.com/ad68df1ee35043ceeaf4093299608f7d/invoke.js"></script>
</body>
</html>`;
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setReloadKey((prev) => prev + 1);
  };

  const getContainerStyles = () => {
    if (type === "leaderboard") {
      return "w-full max-w-6xl mx-auto my-3 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden";
    }
    if (type === "rectangle") {
      return "w-full bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden";
    }
    // footer
    return "w-full max-w-6xl mx-auto my-4 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden";
  };

  const getIframeHeight = () => {
    if (type === "leaderboard") return "min-h-[160px] sm:min-h-[180px]";
    if (type === "rectangle") return "min-h-[280px] sm:min-h-[320px]";
    return "min-h-[150px] sm:min-h-[170px]";
  };

  const getLabel = () => {
    if (type === "leaderboard") return "Top Sponsored Native Ad";
    if (type === "rectangle") return "Featured Sponsored Ad";
    return "Partner Sponsored Ad";
  };

  return (
    <div className={getContainerStyles()}>
      {/* Top Ad Banner Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/80 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 px-2 py-0.5 rounded-md font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Adsterra Native Ad
          </span>
          <span className="text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
            {getLabel()}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleRefresh}
            title="Refresh Ad"
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          {onDismiss && (
            <button
              onClick={onDismiss}
              title="Dismiss Ads"
              className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Iframe Ad Container */}
      <div className={`relative w-full ${getIframeHeight()} bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-center overflow-hidden`}>
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-500 bg-slate-50/40 dark:bg-slate-900/40 pointer-events-none z-10 transition-opacity">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[11px] font-medium">Loading Adsterra Native Banner...</span>
          </div>
        )}

        <iframe
          key={reloadKey}
          title={`Adsterra Native Banner - ${type}`}
          srcDoc={getAdsterraSrcDoc()}
          onLoad={() => setIsLoading(false)}
          className="w-full h-full border-0 min-h-[inherit] block bg-transparent"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
        />
      </div>
    </div>
  );
};

