import React, { useState } from "react";
import { Task, TimeUnit } from "./TaskCard";

interface TaskModalProps {
  existingTask?: Task | null;
  onSave: (title: string, description: string, time: number, unit: TimeUnit) => void;
  onClose: () => void;
}

const UNIT_RANGES: Record<TimeUnit, { min: number; max: number }> = {
  minutes: { min: 1, max: 120 },
  hours: { min: 1, max: 72 },
  days: { min: 1, max: 90 },
};

export function TaskModal({ existingTask, onSave, onClose }: TaskModalProps) {
  const [title, setTitle] = useState(existingTask?.title ?? "");
  const [description, setDescription] = useState(existingTask?.description ?? "");
  const [timeUnit, setTimeUnit] = useState<TimeUnit>(existingTask?.timeUnit ?? "hours");
  const [time, setTime] = useState(existingTask?.timeRemaining ?? 4);
  const isEditing = !!existingTask;

  const range = UNIT_RANGES[timeUnit];
  const clampedTime = Math.min(Math.max(time, range.min), range.max);

  const handleUnitChange = (newUnit: TimeUnit) => {
    setTimeUnit(newUnit);
    const newRange = UNIT_RANGES[newUnit];
    setTime(Math.min(Math.max(time, newRange.min), newRange.max));
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave(title.trim(), description.trim() || "No description", clampedTime, timeUnit);
  };

  const unitLabel = timeUnit === "minutes" ? "min" : timeUnit === "days" ? "d" : "h";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-[#2a2a2a] rounded-2xl p-6 w-full max-w-md border border-[#444]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          className="text-white text-[32px] text-center mb-6"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          {isEditing ? "Edit Task" : "New Task"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-[#aaa] text-sm block mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#1a1a1a] text-white rounded-lg px-4 py-3 border border-[#444] focus:border-[#0c4] focus:outline-none"
              placeholder="e.g. Design Element"
              autoFocus
            />
          </div>

          <div>
            <label className="text-[#aaa] text-sm block mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#1a1a1a] text-white rounded-lg px-4 py-3 border border-[#444] focus:border-[#0c4] focus:outline-none"
              placeholder="e.g. New location designed."
            />
          </div>

          {/* Time Unit Selector */}
          <div>
            <label className="text-[#aaa] text-sm block mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Time Unit
            </label>
            <div className="flex gap-2">
              {(["minutes", "hours", "days"] as TimeUnit[]).map((unit) => (
                <button
                  key={unit}
                  onClick={() => handleUnitChange(unit)}
                  className={`flex-1 py-2 rounded-lg text-sm transition-colors ${
                    timeUnit === unit
                      ? "bg-[#00cc44] text-white"
                      : "bg-[#1a1a1a] text-[#888] border border-[#444] hover:border-[#666]"
                  }`}
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {unit.charAt(0).toUpperCase() + unit.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Time Slider */}
          <div>
            <label className="text-[#aaa] text-sm block mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Time Remaining: {clampedTime} {unitLabel}
            </label>
            <input
              type="range"
              min={range.min}
              max={range.max}
              value={clampedTime}
              onChange={(e) => setTime(Number(e.target.value))}
              className="w-full accent-[#00cc44]"
            />
            <div className="flex justify-between text-[#666] text-xs mt-1">
              <span>{range.min}{unitLabel}</span>
              <span>{range.max}{unitLabel}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-[#444] text-white hover:bg-[#555] transition-colors"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-xl bg-[#00cc44] text-white hover:bg-[#00aa33] transition-colors"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {isEditing ? "Save" : "Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
