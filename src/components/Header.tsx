import React from "react";
import { QrCode, Camera, Layers, History, Sparkles, Moon, Sun, ShieldCheck } from "lucide-react";

interface Props {
  activeTab: "create" | "scan" | "bulk" | "history";
  onTabChange: (tab: "create" | "scan" | "bulk" | "history") => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  showAds: boolean;
  onToggleAds: () => void;
}

export const Header: React.FC<Props> = ({
  activeTab,
  onTabChange,
  darkMode,
  onToggleDarkMode,
  showAds,
  onToggleAds,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange("create")}>
          <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl shadow-md">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg tracking-tight">
              The QR Code Generator
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              FREE ONLINE TOOL
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => onTabChange("create")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "create"
                ? "bg-blue-600 text-white shadow-2xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <QrCode className="w-4 h-4" />
            Create
          </button>

          <button
            onClick={() => onTabChange("scan")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "scan"
                ? "bg-blue-600 text-white shadow-2xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Camera className="w-4 h-4" />
            Scan QR
          </button>

          <button
            onClick={() => onTabChange("bulk")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "bulk"
                ? "bg-blue-600 text-white shadow-2xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            Batch Generator
          </button>

          <button
            onClick={() => onTabChange("history")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "history"
                ? "bg-blue-600 text-white shadow-2xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <History className="w-4 h-4" />
            My QR Codes
          </button>
        </nav>

        {/* Right Tools */}
        <div className="flex items-center gap-2">
          {/* Ad Mode Toggle (Allow users to toggle realistic ads on/off as requested) */}
          <button
            onClick={onToggleAds}
            title={showAds ? "Hide Banner Ads (Ad-Free Mode)" : "Show Banner Ads Layout"}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1 cursor-pointer ${
              showAds
                ? "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                : "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{showAds ? "Ads Enabled" : "Ad-Free Mode"}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            title="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation */}
      <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-2 py-1.5 flex justify-around">
        <button
          onClick={() => onTabChange("create")}
          className={`flex flex-col items-center py-1 px-3 text-[11px] font-medium rounded-lg ${
            activeTab === "create" ? "text-blue-600 font-bold" : "text-slate-500"
          }`}
        >
          <QrCode className="w-4 h-4 mb-0.5" />
          Create
        </button>
        <button
          onClick={() => onTabChange("scan")}
          className={`flex flex-col items-center py-1 px-3 text-[11px] font-medium rounded-lg ${
            activeTab === "scan" ? "text-blue-600 font-bold" : "text-slate-500"
          }`}
        >
          <Camera className="w-4 h-4 mb-0.5" />
          Scan
        </button>
        <button
          onClick={() => onTabChange("bulk")}
          className={`flex flex-col items-center py-1 px-3 text-[11px] font-medium rounded-lg ${
            activeTab === "bulk" ? "text-blue-600 font-bold" : "text-slate-500"
          }`}
        >
          <Layers className="w-4 h-4 mb-0.5" />
          Batch
        </button>
        <button
          onClick={() => onTabChange("history")}
          className={`flex flex-col items-center py-1 px-3 text-[11px] font-medium rounded-lg ${
            activeTab === "history" ? "text-blue-600 font-bold" : "text-slate-500"
          }`}
        >
          <History className="w-4 h-4 mb-0.5" />
          Saved
        </button>
      </div>
    </header>
  );
};
