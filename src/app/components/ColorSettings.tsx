import React, { useState } from "react";
import { X, RotateCcw } from "lucide-react";

export interface UrgencyColors {
  now: string;
  upcoming: string;
  later: string;
  distant: string;
  completed: string;
}

export const DEFAULT_COLORS: UrgencyColors = {
  now: "#910002",
  upcoming: "#914400",
  later: "#818100",
  distant: "#008163",
  completed: "#4a4a4a",
};

const STORAGE_KEY = "progchek_colors";

const PRESET_PALETTES: { name: string; colors: UrgencyColors }[] = [
  { name: "Classic", colors: { ...DEFAULT_COLORS } },
  {
    name: "Ocean",
    colors: { now: "#c0392b", upcoming: "#d68910", later: "#2471a3", distant: "#1a5276", completed: "#4a4a4a" },
  },
  {
    name: "Neon",
    colors: { now: "#ff006e", upcoming: "#fb5607", later: "#8338ec", distant: "#3a86ff", completed: "#4a4a4a" },
  },
  {
    name: "Earth",
    colors: { now: "#8b4513", upcoming: "#b8860b", later: "#556b2f", distant: "#2f4f4f", completed: "#4a4a4a" },
  },
  {
    name: "Pastel",
    colors: { now: "#b5485d", upcoming: "#c2855a", later: "#7a9a6e", distant: "#5b7e96", completed: "#6b6b6b" },
  },
];

export function loadColors(): UrgencyColors {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_COLORS, ...parsed };
    }
  } catch { /* ignore */ }
  return { ...DEFAULT_COLORS };
}

export function saveColors(colors: UrgencyColors): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
  } catch { /* ignore */ }
}

interface ColorSettingsModalProps {
  colors: UrgencyColors;
  onChange: (colors: UrgencyColors) => void;
  onClose: () => void;
}

const FONT = { fontFamily: "'Bebas Neue', sans-serif" };

interface ColorRowProps {
  label: string;
  sublabel: string;
  value: string;
  onChange: (val: string) => void;
}

function ColorRow({ label, sublabel, value, onChange }: ColorRowProps) {
  return (
    <div className="flex items-center gap-3">
      <label
        className="relative w-12 h-12 rounded-xl border-2 border-[#555] cursor-pointer overflow-hidden flex-shrink-0 hover:border-[#888] transition-colors"
        style={{ backgroundColor: value }}
      >
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </label>
      <div className="flex-1 min-w-0">
        <p className="text-white text-[20px] leading-none" style={FONT}>{label}</p>
        <p className="text-[#777] text-xs mt-0.5">{sublabel}</p>
      </div>
      <span className="text-[#666] text-xs uppercase tracking-wide font-mono">{value}</span>
    </div>
  );
}

export function ColorSettingsModal({ colors, onChange, onClose }: ColorSettingsModalProps) {
  const [local, setLocal] = useState<UrgencyColors>({ ...colors });

  const update = (key: keyof UrgencyColors, val: string) => {
    const next = { ...local, [key]: val };
    setLocal(next);
    onChange(next);
  };

  const applyPreset = (preset: UrgencyColors) => {
    setLocal({ ...preset });
    onChange({ ...preset });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-[#2a2a2a] rounded-2xl w-full max-w-md border border-[#444] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 className="text-white text-[32px] leading-none" style={FONT}>
            Card Colors
          </h2>
          <button onClick={onClose} className="text-[#888] hover:text-white transition-colors">
            <X size={22} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 pb-6 space-y-6">
          {/* Presets */}
          <div>
            <p className="text-[#aaa] text-sm mb-2" style={FONT}>Presets</p>
            <div className="flex gap-2 flex-wrap">
              {PRESET_PALETTES.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset.colors)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#444] hover:border-[#666] transition-colors"
                >
                  <div className="flex gap-0.5">
                    {(["now", "upcoming", "later", "distant"] as const).map((k) => (
                      <div
                        key={k}
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: preset.colors[k] }}
                      />
                    ))}
                  </div>
                  <span className="text-[#ccc] text-xs" style={FONT}>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Individual colors */}
          <div className="space-y-4">
            <p className="text-[#aaa] text-sm" style={FONT}>Custom Colors</p>

            <ColorRow
              label="Now"
              sublabel="Urgent — under 1 hour"
              value={local.now}
              onChange={(v) => update("now", v)}
            />
            <ColorRow
              label="Upcoming"
              sublabel="Soon — 1 to 8 hours"
              value={local.upcoming}
              onChange={(v) => update("upcoming", v)}
            />
            <ColorRow
              label="Later"
              sublabel="Moderate — 8 to 16 hours"
              value={local.later}
              onChange={(v) => update("later", v)}
            />
            <ColorRow
              label="Distant"
              sublabel="Relaxed — over 16 hours"
              value={local.distant}
              onChange={(v) => update("distant", v)}
            />
            <ColorRow
              label="Completed"
              sublabel="Finished tasks"
              value={local.completed}
              onChange={(v) => update("completed", v)}
            />
          </div>

          {/* Preview */}
          <div>
            <p className="text-[#aaa] text-sm mb-2" style={FONT}>Preview</p>
            <div className="flex gap-2 h-14">
              {(["now", "upcoming", "later", "distant", "completed"] as const).map((k) => (
                <div
                  key={k}
                  className="flex-1 rounded-xl border border-white/20 flex items-center justify-center"
                  style={{ backgroundColor: local[k] }}
                >
                  <span className="text-white text-[14px] capitalize" style={FONT}>
                    {k === "completed" ? "Done" : k}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={() => applyPreset(DEFAULT_COLORS)}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#333] hover:bg-[#444] text-[#aaa] transition-colors"
            style={FONT}
          >
            <RotateCcw size={14} />
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}
