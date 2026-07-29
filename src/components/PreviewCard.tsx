import React, { useEffect, useRef, useState } from "react";
import { QRDesignConfig, HistoryItem } from "../types";
import { renderQRToCanvas, generateQRSVG } from "../utils/qrGenerator";
import { Download, Copy, Printer, Share2, BookmarkPlus, Check, Sparkles, FileImage } from "lucide-react";
import confetti from "canvas-confetti";

interface Props {
  qrText: string;
  config: QRDesignConfig;
  title: string;
  type: string;
  onSaveToHistory: (item: HistoryItem) => void;
}

export const PreviewCard: React.FC<Props> = ({
  qrText,
  config,
  title,
  type,
  onSaveToHistory,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [downloadSize, setDownloadSize] = useState<number>(1000);
  const [copied, setCopied] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [isRendering, setIsRendering] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    if (canvasRef.current && qrText) {
      setIsRendering(true);
      renderQRToCanvas(canvasRef.current, qrText, config)
        .then(() => {
          if (active) setIsRendering(false);
        })
        .catch((err) => {
          console.error("Failed to render canvas:", err);
          if (active) setIsRendering(false);
        });
    }
    return () => {
      active = false;
    };
  }, [qrText, config]);

  const handleDownloadPNG = async () => {
    if (!qrText) return;
    const offscreenCanvas = document.createElement("canvas");
    await renderQRToCanvas(offscreenCanvas, qrText, { ...config, size: downloadSize });
    
    const link = document.createElement("a");
    link.download = `qrcode_${type}_${downloadSize}px.png`;
    link.href = offscreenCanvas.toDataURL("image/png");
    link.click();

    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    } catch (e) {
      // ignore
    }
  };

  const handleDownloadSVG = async () => {
    if (!qrText) return;
    const svgStr = await generateQRSVG(qrText, config);
    const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `qrcode_${type}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyClipboard = async () => {
    if (!qrText || !canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      });
    } catch (err) {
      // Fallback text copy
      await navigator.clipboard.writeText(qrText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL("image/png");
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Print QR Code</title></head>
          <body style="display:flex; flex-direction:column; align-items:center; justify-center; min-height:100vh; margin:0; font-family:sans-serif;">
            <h2>${title || "QR Code"}</h2>
            <img src="${dataUrl}" style="max-width:350px; height:auto; margin: 20px 0;" />
            <p style="color:#64748b; font-size:14px;">Scan with any mobile camera or QR reader</p>
            <script>window.onload = function() { window.print(); window.close(); }</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleSave = () => {
    if (!qrText || !canvasRef.current) return;
    const item: HistoryItem = {
      id: Date.now().toString(),
      title: title || `${type.toUpperCase()} QR Code`,
      type: type as any,
      content: qrText,
      rawText: qrText,
      createdAt: new Date().toLocaleDateString(),
      config: { ...config },
    };
    onSaveToHistory(item);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-lg flex flex-col items-center sticky top-20">
      <div className="w-full flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-700 pb-3">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          Live QR Preview
        </h3>
        <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-700">
          Ready
        </span>
      </div>

      {/* Canvas Wrapper */}
      <div className="relative w-full aspect-square max-w-[320px] bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-inner my-2">
        {!qrText ? (
          <div className="text-center p-6 text-slate-400">
            <p className="text-xs">Fill in form fields to build live QR code preview</p>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain drop-shadow-md rounded"
          />
        )}
      </div>

      {/* Action Buttons */}
      {qrText && (
        <div className="w-full space-y-3 mt-3">
          {/* HD PNG Download with Resolution selector */}
          <div className="flex items-center gap-2">
            <select
              value={downloadSize}
              onChange={(e) => setDownloadSize(parseInt(e.target.value))}
              className="px-2.5 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden"
            >
              <option value={350}>350px (Web)</option>
              <option value={500}>500px (Medium)</option>
              <option value={1000}>1000px (HD)</option>
              <option value={2000}>2000px (Ultra HD)</option>
              <option value={4000}>4000px (Print HD)</option>
            </select>

            <button
              onClick={handleDownloadPNG}
              className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download PNG
            </button>
          </div>

          {/* Secondary Action row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDownloadSVG}
              className="py-2 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition"
            >
              <FileImage className="w-3.5 h-3.5 text-blue-600" />
              Download SVG
            </button>

            <button
              onClick={handleCopyClipboard}
              className="py-2 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-blue-600" />}
              {copied ? "Copied!" : "Copy Image"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handlePrint}
              className="py-2 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
              Print Code
            </button>

            <button
              onClick={handleSave}
              className="py-2 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition"
            >
              {saved ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <BookmarkPlus className="w-3.5 h-3.5 text-amber-500" />}
              {saved ? "Saved!" : "Save Code"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
