import React, { useState, useEffect } from "react";
import {
  QRType,
  QRDesignConfig,
  HistoryItem,
  UrlFormData,
  TextFormData,
  WifiFormData,
  VCardFormData,
  EmailFormData,
  SmsFormData,
  CallFormData,
  WhatsappFormData,
  CryptoFormData,
  EventFormData,
  MultiLinkFormData,
} from "./types";
import { generateRawQRContent } from "./utils/qrGenerator";
import { Header } from "./components/Header";
import { TypeSelector } from "./components/TypeSelector";
import { UrlForm } from "./components/forms/UrlForm";
import { TextForm } from "./components/forms/TextForm";
import { WifiForm } from "./components/forms/WifiForm";
import { VCardForm } from "./components/forms/VCardForm";
import { EmailForm } from "./components/forms/EmailForm";
import { SmsForm } from "./components/forms/SmsForm";
import { CallForm } from "./components/forms/CallForm";
import { WhatsappForm } from "./components/forms/WhatsappForm";
import { CryptoForm } from "./components/forms/CryptoForm";
import { EventForm } from "./components/forms/EventForm";
import { MultiLinkForm } from "./components/forms/MultiLinkForm";
import { DesignPanel } from "./components/DesignPanel";
import { PreviewCard } from "./components/PreviewCard";
import { ScannerPanel } from "./components/ScannerPanel";
import { BulkGenerator } from "./components/BulkGenerator";
import { HistoryPanel } from "./components/HistoryPanel";
import { AdBanner } from "./components/AdBanners";
import { AiAssistantModal } from "./components/AiAssistantModal";
import { Sparkles, QrCode } from "lucide-react";

const INITIAL_DESIGN: QRDesignConfig = {
  foregroundColor: "#0f172a",
  backgroundColor: "#ffffff",
  gradientEnable: false,
  gradientColor: "#2563eb",
  gradientType: "linear",
  dotStyle: "square",
  cornerOuterStyle: "square",
  cornerInnerStyle: "square",
  eyeColor: "#0f172a",
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

export default function App() {
  const [activeNavTab, setActiveNavTab] = useState<"create" | "scan" | "bulk" | "history">("create");
  const [selectedType, setSelectedType] = useState<QRType>("url");
  const [designConfig, setDesignConfig] = useState<QRDesignConfig>(INITIAL_DESIGN);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [showAds, setShowAds] = useState<boolean>(true);
  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false);

  // Individual Form States
  const [urlData, setUrlData] = useState<UrlFormData>({ url: "https://www.example.com", shorten: false });
  const [textData, setTextData] = useState<TextFormData>({ text: "Hello, world!" });
  const [wifiData, setWifiData] = useState<WifiFormData>({
    ssid: "MyHomeWifi",
    password: "Password123",
    encryption: "WPA",
    hidden: false,
  });
  const [vcardData, setVcardData] = useState<VCardFormData>({
    firstName: "John",
    lastName: "Doe",
    organization: "Acme Corp",
    title: "Product Designer",
    phone: "+1 555-0199",
    mobile: "+1 555-0123",
    email: "john.doe@example.com",
    address: "100 Market St, San Francisco, CA",
    website: "https://example.com",
    note: "Scan to save contact",
  });
  const [emailData, setEmailData] = useState<EmailFormData>({
    email: "hello@company.com",
    subject: "Inquiry from QR Code",
    body: "Hi team, I would like to learn more.",
  });
  const [smsData, setSmsData] = useState<SmsFormData>({
    phone: "+1 555-0199",
    message: "Hi! I scanned your QR code.",
  });
  const [callData, setCallData] = useState<CallFormData>({ phone: "+1 800-555-0199" });
  const [whatsappData, setWhatsappData] = useState<WhatsappFormData>({
    countryCode: "+1",
    phone: "5550199",
    message: "Hi! Reaching out via your QR code.",
  });
  const [cryptoData, setCryptoData] = useState<CryptoFormData>({
    currency: "BTC",
    address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    amount: "0.005",
    label: "Coffee Payment",
  });
  const [eventData, setEventData] = useState<EventFormData>({
    title: "Annual Summit 2026",
    startDate: "2026-09-15T09:00",
    endDate: "2026-09-15T17:00",
    location: "Tech Convention Center",
    description: "Keynote talks, workshops and networking.",
  });
  const [multiLinkData, setMultiLinkData] = useState<MultiLinkFormData>({
    title: "Connect with Me",
    links: [
      { label: "Portfolio Website", url: "https://example.com" },
      { label: "LinkedIn Profile", url: "https://linkedin.com" },
    ],
  });

  // History State
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem("qr_history_v1");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("qr_history_v1", JSON.stringify(history));
    } catch (e) {
      // ignore
    }
  }, [history]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Compute raw QR string based on active type
  const getCurrentFormData = () => {
    switch (selectedType) {
      case "url":
        return urlData;
      case "text":
        return textData;
      case "wifi":
        return wifiData;
      case "vcard":
        return vcardData;
      case "email":
        return emailData;
      case "sms":
        return smsData;
      case "call":
        return callData;
      case "whatsapp":
        return whatsappData;
      case "crypto":
        return cryptoData;
      case "event":
        return eventData;
      case "multilink":
        return multiLinkData;
      default:
        return urlData;
    }
  };

  const currentRawContent = generateRawQRContent(selectedType, getCurrentFormData());

  const handleSaveToHistory = (item: HistoryItem) => {
    setHistory((prev) => [item, ...prev]);
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setSelectedType(item.type);
    if (item.config) {
      setDesignConfig(item.config);
    }
    if (item.type === "url") setUrlData({ url: item.content });
    if (item.type === "text") setTextData({ text: item.content });
    setActiveNavTab("create");
  };

  const handleApplyAiData = (data: any) => {
    if (selectedType === "vcard") {
      setVcardData((prev) => ({ ...prev, ...data }));
    } else if (selectedType === "wifi") {
      setWifiData((prev) => ({ ...prev, ...data }));
    } else if (selectedType === "event") {
      setEventData((prev) => ({ ...prev, ...data }));
    } else if (data.formattedText) {
      setTextData({ text: data.formattedText });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Header Bar */}
      <Header
        activeTab={activeNavTab}
        onTabChange={setActiveNavTab}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        showAds={showAds}
        onToggleAds={() => setShowAds(!showAds)}
      />

      {/* Top Banner Advertisement */}
      {showAds && <AdBanner type="leaderboard" onDismiss={() => setShowAds(false)} />}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeNavTab === "create" && (
          <div className="space-y-6">
            {/* Title & Introduction */}
            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Free QR Code Generator
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
                Create custom high-resolution QR codes for websites, Wi-Fi, contacts, WhatsApp, crypto payments and vector print files.
              </p>
            </div>

            {/* Type Selector Tabs */}
            <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <TypeSelector selectedType={selectedType} onSelectType={setSelectedType} />
            </div>

            {/* Grid Layout: Left Forms & Customizers, Right Sticky Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Input Form + Customizer Panel */}
              <div className="lg:col-span-7 space-y-6">
                {/* Form Card */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">
                    <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                      Enter {selectedType.toUpperCase()} Details
                    </h2>
                    <button
                      onClick={() => setAiModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-semibold hover:bg-blue-100 transition border border-blue-200 dark:border-blue-800"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      AI Assist
                    </button>
                  </div>

                  {selectedType === "url" && (
                    <UrlForm data={urlData} onChange={setUrlData} onAiAssist={() => setAiModalOpen(true)} />
                  )}
                  {selectedType === "text" && (
                    <TextForm data={textData} onChange={setTextData} onAiAssist={() => setAiModalOpen(true)} />
                  )}
                  {selectedType === "wifi" && (
                    <WifiForm data={wifiData} onChange={setWifiData} onAiAssist={() => setAiModalOpen(true)} />
                  )}
                  {selectedType === "vcard" && (
                    <VCardForm data={vcardData} onChange={setVcardData} onAiAssist={() => setAiModalOpen(true)} />
                  )}
                  {selectedType === "email" && <EmailForm data={emailData} onChange={setEmailData} />}
                  {selectedType === "sms" && <SmsForm data={smsData} onChange={setSmsData} />}
                  {selectedType === "call" && <CallForm data={callData} onChange={setCallData} />}
                  {selectedType === "whatsapp" && <WhatsappForm data={whatsappData} onChange={setWhatsappData} />}
                  {selectedType === "crypto" && <CryptoForm data={cryptoData} onChange={setCryptoData} />}
                  {selectedType === "event" && <EventForm data={eventData} onChange={setEventData} />}
                  {selectedType === "multilink" && (
                    <MultiLinkForm data={multiLinkData} onChange={setMultiLinkData} />
                  )}
                </div>

                {/* Design Customizer Panel */}
                <DesignPanel config={designConfig} onChange={setDesignConfig} />
              </div>

              {/* Right Column: Sticky Preview Card + Sidebar Rectangle Ad */}
              <div className="lg:col-span-5 space-y-6">
                <PreviewCard
                  qrText={currentRawContent}
                  config={designConfig}
                  title={`${selectedType.toUpperCase()} QR Code`}
                  type={selectedType}
                  onSaveToHistory={handleSaveToHistory}
                />

                {showAds && <AdBanner type="rectangle" />}
              </div>
            </div>
          </div>
        )}

        {/* Scanner View */}
        {activeNavTab === "scan" && (
          <ScannerPanel
            onSaveScannedResult={(text) => {
              const item: HistoryItem = {
                id: Date.now().toString(),
                title: "Scanned QR Code",
                type: "text",
                content: text,
                rawText: text,
                createdAt: new Date().toLocaleDateString(),
                config: INITIAL_DESIGN,
              };
              handleSaveToHistory(item);
            }}
          />
        )}

        {/* Bulk Generator View */}
        {activeNavTab === "bulk" && <BulkGenerator config={designConfig} />}

        {/* Saved QR Codes History View */}
        {activeNavTab === "history" && (
          <HistoryPanel
            history={history}
            onSelectHistoryItem={handleSelectHistoryItem}
            onClearHistory={() => setHistory([])}
            onDeleteHistoryItem={(id) => setHistory((prev) => prev.filter((i) => i.id !== id))}
          />
        )}
      </main>

      {/* AI Assistant Modal */}
      <AiAssistantModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        targetType={selectedType}
        onApplyData={handleApplyAiData}
      />

      {/* Footer Ad notice */}
      {showAds && <AdBanner type="footer" />}

      {/* Footer Info */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 space-y-2">
        <p className="font-semibold text-slate-700 dark:text-slate-300">
          The QR Code Generator — Free Online QR Code Creator & Scanner
        </p>
        <p>Supports URL, Text, Wi-Fi, vCard, Email, SMS, Phone, WhatsApp, Crypto & Vector SVG export.</p>
      </footer>
    </div>
  );
}
