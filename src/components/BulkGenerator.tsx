import React, { useState } from "react";
import JSZip from "jszip";
import { QRDesignConfig, BulkQRItem } from "../types";
import { renderQRToCanvas } from "../utils/qrGenerator";
import { Layers, Download, Upload, CheckCircle2, AlertCircle, FileSpreadsheet, Sparkles } from "lucide-react";

interface Props {
  config: QRDesignConfig;
}

export const BulkGenerator: React.FC<Props> = ({ config }) => {
  const [textInput, setTextInput] = useState<string>("");
  const [items, setItems] = useState<BulkQRItem[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const handleParseInput = (inputStr: string) => {
    const lines = inputStr
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const parsed: BulkQRItem[] = lines.map((line, idx) => {
      // If line contains CSV comma e.g. "Filename, URL"
      const parts = line.split(",");
      if (parts.length >= 2) {
        return {
          id: `bulk_${idx}_${Date.now()}`,
          filename: parts[0].trim().replace(/[^a-zA-Z0-9_-]/g, "_"),
          content: parts.slice(1).join(",").trim(),
          status: "pending",
        };
      }
      return {
        id: `bulk_${idx}_${Date.now()}`,
        filename: `qrcode_${idx + 1}`,
        content: line,
        status: "pending",
      };
    });

    setItems(parsed);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        setTextInput(text);
        handleParseInput(text);
      };
      reader.readAsText(file);
    }
  };

  const processBulkGeneration = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    setProgress(0);

    const updatedItems = [...items];

    for (let i = 0; i < updatedItems.length; i++) {
      const item = updatedItems[i];
      try {
        const canvas = document.createElement("canvas");
        await renderQRToCanvas(canvas, item.content, { ...config, size: 800 });
        item.dataUrl = canvas.toDataURL("image/png");
        item.status = "done";
      } catch (err: any) {
        item.status = "error";
        item.errorMessage = err.message || "Failed";
      }
      setProgress(Math.round(((i + 1) / updatedItems.length) * 100));
      setItems([...updatedItems]);
    }

    setIsProcessing(false);
  };

  const downloadZipArchive = async () => {
    const completed = items.filter((item) => item.status === "done" && item.dataUrl);
    if (completed.length === 0) return;

    const zip = new JSZip();
    const folder = zip.folder("qr_codes");

    completed.forEach((item) => {
      if (item.dataUrl) {
        const base64Data = item.dataUrl.replace(/^data:image\/png;base64,/, "");
        folder?.file(`${item.filename || item.id}.png`, base64Data, { base64: true });
      }
    });

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bulk_qrcodes_${Date.now()}.zip`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            Batch / Bulk QR Code Generator
          </h2>
          <p className="text-xs text-slate-500">
            Generate multiple QR codes at once from text lines or CSV files and export as a ZIP package.
          </p>
        </div>

        <label className="px-3.5 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition">
          <Upload className="w-4 h-4 text-blue-600" />
          Upload CSV / TXT
          <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {/* Text Area Input */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Paste Multi-Line Content or "Filename, Content" CSV
        </label>
        <textarea
          rows={5}
          value={textInput}
          onChange={(e) => {
            setTextInput(e.target.value);
            handleParseInput(e.target.value);
          }}
          placeholder={`e.g.
https://google.com
https://github.com
my_wifi, WIFI:S:OfficeWifi;T:WPA;P:Secret123;;
https://linkedin.com`}
          className="block w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-1 text-[11px] text-slate-400">
          Format: 1 item per line. Optional custom filename by using "Filename, Content".
        </p>
      </div>

      {/* Parse Result Summary */}
      {items.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Ready to generate <strong className="text-blue-600">{items.length}</strong> QR codes
            </span>

            <div className="flex gap-2">
              <button
                onClick={processBulkGeneration}
                disabled={isProcessing}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isProcessing ? `Processing (${progress}%)` : "Generate All"}
              </button>

              {items.some((i) => i.status === "done") && (
                <button
                  onClick={downloadZipArchive}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download ZIP
                </button>
              )}
            </div>
          </div>

          {/* Table / List Preview */}
          <div className="max-h-60 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((item, idx) => (
              <div key={item.id} className="p-3 text-xs flex items-center justify-between bg-white dark:bg-slate-800">
                <div className="flex items-center gap-3 overflow-hidden pr-2">
                  <span className="font-mono text-slate-400 w-6">#{idx + 1}</span>
                  <div className="truncate">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {item.filename}.png
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono truncate">{item.content}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {item.status === "done" && (
                    <span className="inline-flex items-center gap-1 text-emerald-600 text-[11px] font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Ready
                    </span>
                  )}
                  {item.status === "error" && (
                    <span className="inline-flex items-center gap-1 text-red-600 text-[11px] font-semibold bg-red-50 px-2 py-0.5 rounded-full">
                      <AlertCircle className="w-3 h-3" /> Error
                    </span>
                  )}
                  {item.status === "pending" && (
                    <span className="text-[11px] text-slate-400 font-medium">Pending</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
