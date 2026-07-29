import React from "react";
import { MultiLinkFormData } from "../../types";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  data: MultiLinkFormData;
  onChange: (data: MultiLinkFormData) => void;
}

export const MultiLinkForm: React.FC<Props> = ({ data, onChange }) => {
  const addLink = () => {
    onChange({
      ...data,
      links: [...data.links, { label: "", url: "" }],
    });
  };

  const removeLink = (index: number) => {
    const updated = data.links.filter((_, i) => i !== index);
    onChange({ ...data, links: updated });
  };

  const updateLink = (index: number, field: "label" | "url", value: string) => {
    const updated = [...data.links];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, links: updated });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
          Hub Title / Header
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          placeholder="My Social Links & Resources"
          className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
          Links Collection
        </label>
        {data.links.map((link, idx) => (
          <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
            <input
              type="text"
              value={link.label}
              onChange={(e) => updateLink(idx, "label", e.target.value)}
              placeholder="Button Label (e.g. Portfolio)"
              className="w-1/3 px-2 py-1 bg-white border border-slate-300 rounded text-xs text-slate-900"
            />
            <input
              type="url"
              value={link.url}
              onChange={(e) => updateLink(idx, "url", e.target.value)}
              placeholder="https://..."
              className="flex-1 px-2 py-1 bg-white border border-slate-300 rounded text-xs text-slate-900"
            />
            <button
              type="button"
              onClick={() => removeLink(idx)}
              className="p-1 text-red-500 hover:text-red-700 transition"
              title="Remove link"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addLink}
          className="w-full py-2 px-3 border border-dashed border-slate-300 text-slate-600 hover:border-blue-500 hover:text-blue-600 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Another Link
        </button>
      </div>
    </div>
  );
};
