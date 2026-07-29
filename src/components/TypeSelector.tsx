import React from "react";
import { QRType } from "../types";
import {
  Globe,
  FileText,
  Wifi,
  Contact,
  Mail,
  MessageSquare,
  PhoneCall,
  MessageCircle,
  Coins,
  Calendar,
  Layers,
} from "lucide-react";

interface Props {
  selectedType: QRType;
  onSelectType: (type: QRType) => void;
}

const TYPES: { id: QRType; label: string; icon: React.ComponentType<any>; badge?: string }[] = [
  { id: "url", label: "URL / Web", icon: Globe },
  { id: "text", label: "Plain Text", icon: FileText },
  { id: "wifi", label: "Wi-Fi", icon: Wifi, badge: "Popular" },
  { id: "vcard", label: "vCard Contact", icon: Contact, badge: "Popular" },
  { id: "email", label: "Email", icon: Mail },
  { id: "sms", label: "SMS Text", icon: MessageSquare },
  { id: "call", label: "Phone Call", icon: PhoneCall },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle, badge: "Hot" },
  { id: "crypto", label: "Crypto Pay", icon: Coins },
  { id: "event", label: "Event / Calendar", icon: Calendar },
  { id: "multilink", label: "Multi-Link", icon: Layers },
];

export const TypeSelector: React.FC<Props> = ({ selectedType, onSelectType }) => {
  return (
    <div className="overflow-x-auto pb-2 scrollbar-none">
      <div className="flex sm:grid sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-1.5 min-w-max sm:min-w-0">
        {TYPES.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedType === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectType(item.id)}
              className={`relative flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition cursor-pointer select-none ${
                isSelected
                  ? "bg-blue-600 text-white border-blue-600 shadow-md scale-[1.02]"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              }`}
            >
              {item.badge && !isSelected && (
                <span className="absolute -top-1.5 right-1 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-emerald-500 text-white shadow-2xs">
                  {item.badge}
                </span>
              )}
              <Icon className={`w-5 h-5 mb-1 ${isSelected ? "text-white" : "text-blue-600 dark:text-blue-400"}`} />
              <span className="whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
