import React, { useState } from "react";
import { WifiFormData } from "../../types";
import { Wifi, Eye, EyeOff, Lock, Sparkles } from "lucide-react";

interface Props {
  data: WifiFormData;
  onChange: (data: WifiFormData) => void;
  onAiAssist?: () => void;
}

export const WifiForm: React.FC<Props> = ({ data, onChange, onAiAssist }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Wifi className="w-4 h-4 text-blue-600" />
          Wi-Fi Network Credentials
        </h4>
        {onAiAssist && (
          <button
            type="button"
            onClick={onAiAssist}
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Wi-Fi Setup
          </button>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
          Network Name (SSID)
        </label>
        <input
          type="text"
          value={data.ssid}
          onChange={(e) => onChange({ ...data, ssid: e.target.value })}
          placeholder="e.g. MyHomeNetwork_5G"
          className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Encryption Type
          </label>
          <select
            value={data.encryption}
            onChange={(e) =>
              onChange({ ...data, encryption: e.target.value as "WPA" | "WEP" | "nopass" })
            }
            className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="WPA">WPA / WPA2 / WPA3 (Recommended)</option>
            <option value="WEP">WEP (Legacy)</option>
            <option value="nopass">None (Open Network)</option>
          </select>
        </div>

        {data.encryption !== "nopass" && (
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={data.password}
                onChange={(e) => onChange({ ...data, password: e.target.value })}
                placeholder="Wi-Fi Password"
                className="block w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pt-1">
        <input
          type="checkbox"
          id="hiddenSsid"
          checked={data.hidden}
          onChange={(e) => onChange({ ...data, hidden: e.target.checked })}
          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
        />
        <label htmlFor="hiddenSsid" className="text-xs text-slate-700 dark:text-slate-300 font-medium">
          Hidden Network SSID
        </label>
      </div>
    </div>
  );
};
