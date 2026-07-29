import React, { useRef, useState, useEffect } from "react";
import { decodeQRFromFile, scanImageData } from "../utils/qrScanner";
import { Camera, Upload, Check, Copy, ExternalLink, Sparkles, AlertCircle, RefreshCw, Volume2 } from "lucide-react";

interface Props {
  onSaveScannedResult: (content: string) => void;
}

export const ScannerPanel: React.FC<Props> = ({ onSaveScannedResult }) => {
  const [activeTab, setActiveTab] = useState<"camera" | "upload">("camera");
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [aiAnalysis, setAiAnalysis] = useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Play audio beep when QR decoded
  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      // ignore
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        await videoRef.current.play();
        setIsCameraActive(true);
        requestAnimationFrame(tickScan);
      }
    } catch (err: any) {
      console.error("Camera access failed:", err);
      setCameraError("Camera access permission denied or unavailable on this device.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const tickScan = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current || document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = scanImageData(imageData);
        if (code && code.text) {
          playBeep();
          setScanResult(code.text);
          stopCamera();
          analyzeWithAi(code.text);
          return;
        }
      }
    }
    animFrameRef.current = requestAnimationFrame(tickScan);
  };

  useEffect(() => {
    if (activeTab === "camera") {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [activeTab]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const result = await decodeQRFromFile(file);
        if (result && result.text) {
          playBeep();
          setScanResult(result.text);
          analyzeWithAi(result.text);
        } else {
          alert("No valid QR code found in the selected image.");
        }
      } catch (err) {
        alert("Failed to read QR image file.");
      }
    }
  };

  const analyzeWithAi = async (qrText: string) => {
    setIsAnalyzing(true);
    setAiAnalysis(null);
    try {
      const res = await fetch("/api/ai/analyze-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrContent: qrText }),
      });
      const json = await res.json();
      if (json.success) {
        setAiAnalysis(json.data);
      }
    } catch (e) {
      console.warn("AI analysis failed", e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const isUrl = scanResult && /^https?:\/\//i.test(scanResult);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-600" />
            Scan QR Code
          </h2>
          <p className="text-xs text-slate-500">
            Use device webcam camera or upload image photo to read QR codes instantly.
          </p>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("camera")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "camera"
                ? "bg-blue-600 text-white shadow-2xs"
                : "text-slate-600 dark:text-slate-300"
            }`}
          >
            Camera
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "upload"
                ? "bg-blue-600 text-white shadow-2xs"
                : "text-slate-600 dark:text-slate-300"
            }`}
          >
            Upload Photo
          </button>
        </div>
      </div>

      {/* Camera Tab View */}
      {activeTab === "camera" && (
        <div className="space-y-4">
          <div className="relative aspect-video w-full max-w-lg mx-auto bg-slate-900 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center border border-slate-700">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />

            {isCameraActive && (
              <div className="absolute inset-0 border-2 border-dashed border-blue-400/70 rounded-2xl pointer-events-none flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-emerald-400 rounded-xl animate-pulse flex items-center justify-center">
                  <span className="text-[10px] text-emerald-300 bg-black/60 px-2 py-0.5 rounded font-mono">
                    Point camera at QR code
                  </span>
                </div>
              </div>
            )}

            {cameraError && (
              <div className="p-6 text-center text-red-400 space-y-2">
                <AlertCircle className="w-8 h-8 mx-auto text-red-400" />
                <p className="text-xs font-medium">{cameraError}</p>
                <button
                  onClick={startCamera}
                  className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg font-semibold inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retry Camera
                </button>
              </div>
            )}
          </div>

          {isCameraActive && (
            <div className="text-center">
              <button
                onClick={stopCamera}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline"
              >
                Pause Camera Stream
              </button>
            </div>
          )}
        </div>
      )}

      {/* Upload Photo Tab View */}
      {activeTab === "upload" && (
        <div className="space-y-4">
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
            <Upload className="w-10 h-10 text-blue-500 mb-2" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Drag & Drop QR Image or Browse File
            </span>
            <span className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP, SVG</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      )}

      {/* Scan Result Section */}
      {scanResult && (
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              Decoded Result
            </span>
            <button
              onClick={() => {
                setScanResult(null);
                setAiAnalysis(null);
                if (activeTab === "camera") startCamera();
              }}
              className="text-xs text-emerald-700 hover:underline font-semibold"
            >
              Scan Another
            </button>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/60 rounded-xl font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all">
            {scanResult}
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap gap-2 pt-1">
            {isUrl && (
              <a
                href={scanResult}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open Website URL
              </a>
            )}

            <button
              onClick={() => {
                navigator.clipboard.writeText(scanResult);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-100 transition"
            >
              <Copy className="w-3.5 h-3.5 text-blue-600" />
              {copied ? "Copied to Clipboard!" : "Copy Text"}
            </button>

            <button
              onClick={() => onSaveScannedResult(scanResult)}
              className="px-3.5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-700 transition"
            >
              Save to QR History
            </button>
          </div>

          {/* AI Analysis Display */}
          {isAnalyzing && (
            <div className="text-xs text-slate-500 flex items-center gap-2 pt-2">
              <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
              Analyzing content with Gemini AI...
            </div>
          )}

          {aiAnalysis && (
            <div className="mt-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Gemini AI Summary & Security Check
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    aiAnalysis.securityAssessment === "SAFE"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {aiAnalysis.securityAssessment || "CHECKED"}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">{aiAnalysis.summary}</p>
              {aiAnalysis.safetyNotes && (
                <p className="text-[11px] text-slate-500 italic">{aiAnalysis.safetyNotes}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
