import React from "react";
import { SmsFormData } from "../../types";

interface Props {
  data: SmsFormData;
  onChange: (data: SmsFormData) => void;
}

export const SmsForm: React.FC<Props> = ({ data, onChange }) => {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          value={data.phone}
          onChange={(e) => onChange({ ...data, phone: e.target.value })}
          placeholder="+1 555-0199"
          className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
          SMS Message Content
        </label>
        <textarea
          rows={3}
          value={data.message}
          onChange={(e) => onChange({ ...data, message: e.target.value })}
          placeholder="I would like more information..."
          className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>
    </div>
  );
};
