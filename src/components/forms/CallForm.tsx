import React from "react";
import { CallFormData } from "../../types";

interface Props {
  data: CallFormData;
  onChange: (data: CallFormData) => void;
}

export const CallForm: React.FC<Props> = ({ data, onChange }) => {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
          Phone Number to Dial
        </label>
        <input
          type="tel"
          value={data.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          placeholder="+1 (800) 555-0199"
          className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <p className="mt-1 text-xs text-slate-500">
          Scanning this QR code will prompt the device to dial this number directly.
        </p>
      </div>
    </div>
  );
};
