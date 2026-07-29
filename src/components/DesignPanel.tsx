import React, { useState } from "react";
import { QRDesignConfig, DotStyle, EyeOuterStyle, EyeInnerStyle, LogoPreset, FrameStyle, ErrorCorrectionLevel } from "../types";
import {
  Palette,
  LayoutGrid,
  Image as ImageIcon,
  Square,
  Sparkles,
  Sliders,
  ChevronDown,
  Upload,
  RotateCcw,
} from "lucide-react";

interface Props {
  config: QRDesignConfig;
  onChange: (config: QRDesignConfig) => void;
}

const DEFAULT_CONFIG: QRDesignConfig = {
  foregroundColor: "#000000",
  backgroundColor: "#ffffff",
  gradientEnable: false,
  gradientColor: "#2563eb",
  gradientType: "linear",
  dotStyle: "square",
  cornerOuterStyle: "square",
  cornerInnerStyle: "square",
  eyeColor: "#000000",
  logoType: "none",
  logoPreset: "wifi",
  customLogoUrl: "",
  logoText: "",
  logoBg: true,
  frameStyle: "none",
  frameText: "SCAN ME",
  frameColor: "#1e293b",
  frameTextColor: "#ffffff",
  size: 800,
  margin: 2,
  ecl: "M",
};

export const DesignPanel: React.FC<Props> = ({ config, onChange }) => {
  const [activeTab, setActiveTab] = useState<"colors" | "shapes" | "logo" | "frame" | "advanced">("colors");

  const resetDesign = () => {
    onChange({ ...DEFAULT_CONFIG });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onChange({
          ...config,
          logoType: "custom",
          customLogoUrl: ev.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
      {/* Design Tab Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("colors")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "colors"
                ? "bg-blue-600 text-white shadow-2xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            Colors
          </button>

          <button
            onClick={() => setActiveTab("shapes")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "shapes"
                ? "bg-blue-600 text-white shadow-2xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Patterns
          </button>

          <button
            onClick={() => setActiveTab("logo")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "logo"
                ? "bg-blue-600 text-white shadow-2xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Center Logo
          </button>

          <button
            onClick={() => setActiveTab("frame")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "frame"
                ? "bg-blue-600 text-white shadow-2xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <Square className="w-3.5 h-3.5" />
            Frame
          </button>

          <button
            onClick={() => setActiveTab("advanced")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "advanced"
                ? "bg-blue-600 text-white shadow-2xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Quality
          </button>
        </div>

        <button
          onClick={resetDesign}
          title="Reset Design"
          className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {/* Colors Tab */}
        {activeTab === "colors" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Foreground Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.foregroundColor}
                    onChange={(e) => onChange({ ...config, foregroundColor: e.target.value })}
                    className="w-9 h-9 p-0.5 rounded border border-slate-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.foregroundColor}
                    onChange={(e) => onChange({ ...config, foregroundColor: e.target.value })}
                    className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Background Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.backgroundColor}
                    onChange={(e) => onChange({ ...config, backgroundColor: e.target.value })}
                    className="w-9 h-9 p-0.5 rounded border border-slate-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.backgroundColor}
                    onChange={(e) => onChange({ ...config, backgroundColor: e.target.value })}
                    className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Eye Color */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Corner Eye Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.eyeColor || config.foregroundColor}
                  onChange={(e) => onChange({ ...config, eyeColor: e.target.value })}
                  className="w-9 h-9 p-0.5 rounded border border-slate-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={config.eyeColor || config.foregroundColor}
                  onChange={(e) => onChange({ ...config, eyeColor: e.target.value })}
                  className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-mono"
                />
              </div>
            </div>

            {/* Gradient Option */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Gradient Fill
                </span>
                <input
                  type="checkbox"
                  checked={config.gradientEnable}
                  onChange={(e) => onChange({ ...config, gradientEnable: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
              </div>

              {config.gradientEnable && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Secondary Gradient Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.gradientColor}
                        onChange={(e) => onChange({ ...config, gradientColor: e.target.value })}
                        className="w-8 h-8 p-0.5 rounded border border-slate-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.gradientColor}
                        onChange={(e) => onChange({ ...config, gradientColor: e.target.value })}
                        className="flex-1 px-2 py-1 bg-slate-50 border border-slate-300 rounded text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Gradient Type
                    </label>
                    <select
                      value={config.gradientType}
                      onChange={(e) =>
                        onChange({ ...config, gradientType: e.target.value as "linear" | "radial" })
                      }
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800"
                    >
                      <option value="linear">Linear Gradient</option>
                      <option value="radial">Radial Gradient</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Shapes & Patterns Tab */}
        {activeTab === "shapes" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                Data Module Style
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {(
                  [
                    { id: "square", label: "Square" },
                    { id: "rounded", label: "Rounded" },
                    { id: "dots", label: "Dots" },
                    { id: "classy", label: "Classy" },
                    { id: "star", label: "Stars" },
                    { id: "diamond", label: "Diamond" },
                    { id: "liquid", label: "Liquid" },
                  ] as { id: DotStyle; label: string }[]
                ).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onChange({ ...config, dotStyle: item.id })}
                    className={`py-2 px-1 rounded-lg border text-center text-xs transition ${
                      config.dotStyle === item.id
                        ? "bg-blue-600 text-white border-blue-600 font-semibold"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Outer Corner Frame
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { id: "square", label: "Square" },
                      { id: "rounded", label: "Rounded" },
                      { id: "extra-rounded", label: "Extra Smooth" },
                      { id: "circle", label: "Circle" },
                    ] as { id: EyeOuterStyle; label: string }[]
                  ).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onChange({ ...config, cornerOuterStyle: item.id })}
                      className={`py-1.5 px-2 rounded-lg border text-xs text-center transition ${
                        config.cornerOuterStyle === item.id
                          ? "bg-blue-600 text-white border-blue-600 font-semibold"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Inner Corner Eye Center
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { id: "square", label: "Square" },
                      { id: "rounded", label: "Rounded" },
                      { id: "circle", label: "Circle" },
                      { id: "dot", label: "Dot" },
                    ] as { id: EyeInnerStyle; label: string }[]
                  ).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onChange({ ...config, cornerInnerStyle: item.id })}
                      className={`py-1.5 px-2 rounded-lg border text-xs text-center transition ${
                        config.cornerInnerStyle === item.id
                          ? "bg-blue-600 text-white border-blue-600 font-semibold"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Center Logo Tab */}
        {activeTab === "logo" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                Center Overlay Type
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "none", label: "None" },
                  { id: "preset", label: "Preset Icon" },
                  { id: "custom", label: "Upload Custom" },
                  { id: "text", label: "Custom Text" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onChange({ ...config, logoType: item.id as any })}
                    className={`py-1.5 px-2 rounded-lg border text-xs font-medium text-center transition ${
                      config.logoType === item.id
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {config.logoType === "preset" && (
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Select Preset Icon
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {(
                    [
                      "wifi",
                      "whatsapp",
                      "email",
                      "phone",
                      "globe",
                      "heart",
                      "star",
                      "bitcoin",
                    ] as LogoPreset[]
                  ).map((preset) => (
                    <button
                      key={preset}
                      onClick={() => onChange({ ...config, logoPreset: preset })}
                      className={`py-2 px-1 rounded-lg border text-xs font-medium capitalize text-center transition ${
                        config.logoPreset === preset
                          ? "bg-blue-100 text-blue-700 border-blue-500 font-bold"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {config.logoType === "custom" && (
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Upload Image Logo (PNG/JPG/SVG)
                </label>
                <label className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 border border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-blue-500 hover:text-blue-600 cursor-pointer transition text-xs font-medium">
                  <Upload className="w-4 h-4" />
                  Choose Image File
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            )}

            {config.logoType === "text" && (
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Center Text / Initials (Max 5 chars)
                </label>
                <input
                  type="text"
                  maxLength={5}
                  value={config.logoText}
                  onChange={(e) => onChange({ ...config, logoText: e.target.value })}
                  placeholder="e.g. VIP or MYLOG"
                  className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm font-semibold"
                />
              </div>
            )}

            {config.logoType !== "none" && (
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <input
                  type="checkbox"
                  id="logoBgMask"
                  checked={config.logoBg !== false}
                  onChange={(e) => onChange({ ...config, logoBg: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <label htmlFor="logoBgMask" className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  White Mask Circle behind Logo (Prevents QR module overlap)
                </label>
              </div>
            )}
          </div>
        )}

        {/* Frame Tab */}
        {activeTab === "frame" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                Frame Banner Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(
                  [
                    { id: "none", label: "No Frame" },
                    { id: "badge-bottom", label: "Bottom Badge" },
                    { id: "badge-top", label: "Top Badge" },
                    { id: "card", label: "Card Outline" },
                  ] as { id: FrameStyle; label: string }[]
                ).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onChange({ ...config, frameStyle: item.id })}
                    className={`py-2 px-2 rounded-lg border text-xs font-medium text-center transition ${
                      config.frameStyle === item.id
                        ? "bg-blue-600 text-white border-blue-600 font-semibold"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {config.frameStyle !== "none" && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Frame Call to Action Text
                  </label>
                  <input
                    type="text"
                    value={config.frameText}
                    onChange={(e) => onChange({ ...config, frameText: e.target.value })}
                    placeholder="e.g. SCAN ME / JOIN WI-FI / PAY HERE"
                    className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Frame Background Color
                    </label>
                    <input
                      type="color"
                      value={config.frameColor}
                      onChange={(e) => onChange({ ...config, frameColor: e.target.value })}
                      className="w-full h-8 p-0.5 rounded border border-slate-300 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Frame Text Color
                    </label>
                    <input
                      type="color"
                      value={config.frameTextColor}
                      onChange={(e) => onChange({ ...config, frameTextColor: e.target.value })}
                      className="w-full h-8 p-0.5 rounded border border-slate-300 cursor-pointer"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Quality & Advanced Tab */}
        {activeTab === "advanced" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Error Correction Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "L", label: "L - 7% Recovery" },
                  { id: "M", label: "M - 15% Recovery" },
                  { id: "Q", label: "Q - 25% Recovery" },
                  { id: "H", label: "H - 30% High (Logo Friendly)" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onChange({ ...config, ecl: item.id as ErrorCorrectionLevel })}
                    className={`py-2 px-1 rounded-lg border text-xs text-center transition ${
                      config.ecl === item.id
                        ? "bg-blue-600 text-white border-blue-600 font-semibold"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Quiet Zone / Margin Size
                </label>
                <span className="text-xs text-slate-500 font-mono">{config.margin} modules</span>
              </div>
              <input
                type="range"
                min={0}
                max={6}
                value={config.margin}
                onChange={(e) => onChange({ ...config, margin: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
