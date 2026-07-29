import React from "react";
import { CryptoFormData } from "../../types";

interface Props {
  data: CryptoFormData;
  onChange: (data: CryptoFormData) => void;
}

export const CryptoForm: React.FC<Props> = ({ data, onChange }) => {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Cryptocurrency
          </label>
          <select
            value={data.currency}
            onChange={(e) =>
              onChange({ ...data, currency: e.target.value as "BTC" | "ETH" | "SOL" | "USDT" })
            }
            className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="BTC">Bitcoin (BTC)</option>
            <option value="ETH">Ethereum (ETH)</option>
            <option value="SOL">Solana (SOL)</option>
            <option value="USDT">Tether (USDT)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Amount (Optional)
          </label>
          <input
            type="text"
            value={data.amount}
            onChange={(e) => onChange({ ...data, amount: e.target.value })}
            placeholder="e.g. 0.005"
            className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
          Wallet Address
        </label>
        <input
          type="text"
          value={data.address}
          onChange={(e) => onChange({ ...data, address: e.target.value })}
          placeholder="e.g. 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
          className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 text-sm font-mono text-xs"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
          Label / Merchant Note
        </label>
        <input
          type="text"
          value={data.label}
          onChange={(e) => onChange({ ...data, label: e.target.value })}
          placeholder="e.g. Coffee Payment"
          className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>
    </div>
  );
};
