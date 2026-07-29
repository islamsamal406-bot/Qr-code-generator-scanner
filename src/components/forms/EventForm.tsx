import React from "react";
import { EventFormData } from "../../types";

interface Props {
  data: EventFormData;
  onChange: (data: EventFormData) => void;
}

export const EventForm: React.FC<Props> = ({ data, onChange }) => {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
          Event Title / Name
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          placeholder="Annual Tech Summit 2026"
          className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Start Date & Time
          </label>
          <input
            type="datetime-local"
            value={data.startDate}
            onChange={(e) => onChange({ ...data, startDate: e.target.value })}
            className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            End Date & Time
          </label>
          <input
            type="datetime-local"
            value={data.endDate}
            onChange={(e) => onChange({ ...data, endDate: e.target.value })}
            className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
          Location
        </label>
        <input
          type="text"
          value={data.location}
          onChange={(e) => onChange({ ...data, location: e.target.value })}
          placeholder="Grand Ballroom, Hilton Hotel / Online Zoom"
          className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
          Description / Agenda
        </label>
        <textarea
          rows={2}
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          placeholder="Keynote speech, panel discussion, networking..."
          className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>
    </div>
  );
};
