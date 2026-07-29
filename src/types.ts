export type QRType =
  | "url"
  | "text"
  | "wifi"
  | "vcard"
  | "email"
  | "sms"
  | "call"
  | "whatsapp"
  | "crypto"
  | "event"
  | "multilink";

export type DotStyle =
  | "square"
  | "rounded"
  | "dots"
  | "classy"
  | "star"
  | "diamond"
  | "liquid";

export type EyeOuterStyle = "square" | "rounded" | "circle" | "extra-rounded";
export type EyeInnerStyle = "square" | "rounded" | "circle" | "dot";

export type LogoType = "none" | "preset" | "custom" | "text";

export type LogoPreset =
  | "wifi"
  | "whatsapp"
  | "instagram"
  | "twitter"
  | "youtube"
  | "google"
  | "linkedin"
  | "email"
  | "phone"
  | "globe"
  | "heart"
  | "star"
  | "bitcoin";

export type FrameStyle = "none" | "badge-bottom" | "badge-top" | "card" | "phone" | "banner";

export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export interface UrlFormData {
  url: string;
  shorten?: boolean;
}

export interface TextFormData {
  text: string;
}

export interface WifiFormData {
  ssid: string;
  password: string;
  encryption: "WPA" | "WEP" | "nopass";
  hidden: boolean;
}

export interface VCardFormData {
  firstName: string;
  lastName: string;
  organization: string;
  title: string;
  phone: string;
  mobile: string;
  email: string;
  address: string;
  website: string;
  note: string;
}

export interface EmailFormData {
  email: string;
  subject: string;
  body: string;
}

export interface SmsFormData {
  phone: string;
  message: string;
}

export interface CallFormData {
  phone: string;
}

export interface WhatsappFormData {
  countryCode: string;
  phone: string;
  message: string;
}

export interface CryptoFormData {
  currency: "BTC" | "ETH" | "SOL" | "USDT";
  address: string;
  amount: string;
  label: string;
}

export interface EventFormData {
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
}

export interface MultiLinkFormData {
  title: string;
  links: { label: string; url: string }[];
}

export interface QRDesignConfig {
  foregroundColor: string;
  backgroundColor: string;
  gradientEnable: boolean;
  gradientColor: string;
  gradientType: "linear" | "radial";
  dotStyle: DotStyle;
  cornerOuterStyle: EyeOuterStyle;
  cornerInnerStyle: EyeInnerStyle;
  eyeColor: string;
  logoType: LogoType;
  logoPreset: LogoPreset;
  customLogoUrl: string;
  logoText: string;
  logoBg: boolean;
  frameStyle: FrameStyle;
  frameText: string;
  frameColor: string;
  frameTextColor: string;
  size: number; // e.g. 1000 for export
  margin: number; // Quiet zone modules (e.g. 2)
  ecl: ErrorCorrectionLevel;
}

export interface HistoryItem {
  id: string;
  title: string;
  type: QRType;
  content: string;
  rawText: string;
  createdAt: string;
  config: QRDesignConfig;
}

export interface BulkQRItem {
  id: string;
  filename: string;
  content: string;
  status: "pending" | "processing" | "done" | "error";
  dataUrl?: string;
  errorMessage?: string;
}

export interface AdSettings {
  showAds: boolean;
  adFrequency: "normal" | "compact" | "none";
}
