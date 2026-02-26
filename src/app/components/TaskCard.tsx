import React from "react";
import { Copy, Pencil } from "lucide-react";
import { motion } from "motion/react";
import { UrgencyColors, DEFAULT_COLORS } from "./ColorSettings";

export type TimeUnit = "minutes" | "hours" | "days";

export interface Task {
  id: string;
  title: string;
  description: string;
  timeRemaining: number;
  timeUnit: TimeUnit;
  completed: boolean;
}

function toMinutes(time: number, unit: TimeUnit): number {
  if (unit === "days") return time * 24 * 60;
  if (unit === "hours") return time * 60;
  return time;
}

function getCardColor(time: number, unit: TimeUnit, completed: boolean, colors: UrgencyColors): string {
  if (completed) return colors.completed;
  const mins = toMinutes(time, unit);
  if (mins <= 60) return colors.now;
  if (mins <= 480) return colors.upcoming;
  if (mins <= 960) return colors.later;
  return colors.distant;
}

function formatUnitLabel(unit: TimeUnit): { line1: string; line2: string } {
  if (unit === "minutes") return { line1: "Minutes", line2: "Remaining" };
  if (unit === "days") return { line1: "Days", line2: "Remaining" };
  return { line1: "Hours", line2: "Remaining" };
}

interface TaskCardProps {
  task: Task;
  colors?: UrgencyColors;
  projectLabel?: string;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDuplicate: (task: Task) => void;
}

export function TaskCard({ task, colors = DEFAULT_COLORS, projectLabel, onDelete, onToggle, onEdit, onDuplicate }: TaskCardProps) {
  const bgColor = getCardColor(task.timeRemaining, task.timeUnit, task.completed, colors);
  const unitLabel = formatUnitLabel(task.timeUnit);
  const isUrgent = !task.completed && toMinutes(task.timeRemaining, task.timeUnit) <= 60;

  const Wrapper = isUrgent ? motion.div : "div" as any;
  const wrapperProps = isUrgent
    ? {
        animate: {
          x: [0, -2, 2, -2, 2, -1, 1, 0],
          boxShadow: [
            `0 0 8px 2px ${bgColor}88, 0 4px 4px 0 rgba(0,0,0,0.45)`,
            `0 0 20px 8px ${bgColor}cc, 0 4px 4px 0 rgba(0,0,0,0.45)`,
            `0 0 8px 2px ${bgColor}88, 0 4px 4px 0 rgba(0,0,0,0.45)`,
          ],
        },
        transition: {
          x: {
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut" as const,
          },
          boxShadow: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut" as const,
          },
        },
      }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="relative w-full rounded-[16px] border border-[#bcbcbc]/30 overflow-hidden shadow-[0px_4px_4px_0px_rgba(0,0,0,0.45)] cursor-pointer transition-transform hover:scale-[1.01]"
      style={{ backgroundColor: bgColor }}
      onClick={() => onToggle(task.id)}
    >
      <div className="flex items-stretch min-h-[100px]">
        {/* Time section */}
        <div className="flex flex-col items-center justify-center px-5 py-4 min-w-[100px]">
          <span
            className="text-white text-[36px] leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {task.timeRemaining}
          </span>
          <span
            className="text-white text-[14px] leading-none mt-1"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {unitLabel.line1}
          </span>
          <span
            className="text-white text-[12px] leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {unitLabel.line2}
          </span>
        </div>

        {/* Divider */}
        <div className="w-[3px] bg-white/80 my-3 flex-shrink-0" />

        {/* Content section */}
        <div className="flex-1 px-5 py-4 flex flex-col justify-center min-w-0">
          {projectLabel && (
            <span
              className="text-white/50 text-[11px] leading-none mb-1 uppercase tracking-wider truncate"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              {projectLabel}
            </span>
          )}
          <span
            className={`text-white text-[28px] leading-none truncate ${task.completed ? "line-through opacity-60" : ""}`}
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {task.title}
          </span>
          <span
            className={`text-white text-[16px] leading-tight mt-2 truncate ${task.completed ? "line-through opacity-60" : ""}`}
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {task.description}
          </span>
        </div>

        {/* Completed indicator */}
        {task.completed && (
          <div className="flex items-center justify-center px-2 flex-shrink-0">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col items-center justify-center gap-1 px-2 flex-shrink-0">
          <button
            className="p-1.5 rounded-lg hover:bg-white/15 transition-colors"
            title="Edit task"
            onClick={(e) => { e.stopPropagation(); onEdit(task); }}
          >
            <Pencil size={16} className="text-[#d9d9d9]" />
          </button>
          <button
            className="p-1.5 rounded-lg hover:bg-white/15 transition-colors"
            title="Duplicate task"
            onClick={(e) => { e.stopPropagation(); onDuplicate(task); }}
          >
            <Copy size={16} className="text-[#d9d9d9]" />
          </button>
          <button
            className="p-1.5 rounded-lg hover:bg-white/15 transition-colors"
            title="Delete task"
            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
          >
            <div className="w-5 h-[2px] bg-[#d9d9d9] rounded" />
          </button>
        </div>
      </div>
    </Wrapper>
  );
}