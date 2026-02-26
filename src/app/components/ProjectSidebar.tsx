import React, { useState, useRef } from "react";
import { Plus, Trash2, FolderOpen, Download, X, Palette, AlertTriangle, ImagePlus, ImageOff, Sun, Droplets } from "lucide-react";
import { Project } from "./storage";

export const ALL_TASKS_ID = "__all__";

interface ProjectSidebarProps {
  projects: Project[];
  activeProjectId: string;
  bgImage: string | null;
  bgBlur: number;
  bgBrightness: number;
  onSelect: (id: string) => void;
  onAddProject: (name: string) => void;
  onDeleteProject: (id: string) => void;
  onRenameProject: (id: string, name: string) => void;
  onExport: () => void;
  onOpenColors: () => void;
  onSetBgImage: (dataUrl: string | null) => void;
  onSetBgBlur: (value: number) => void;
  onSetBgBrightness: (value: number) => void;
  onClose: () => void;
}

export function ProjectSidebar({
  projects,
  activeProjectId,
  bgImage,
  bgBlur,
  bgBrightness,
  onSelect,
  onAddProject,
  onDeleteProject,
  onRenameProject,
  onExport,
  onOpenColors,
  onSetBgImage,
  onSetBgBlur,
  onSetBgBrightness,
  onClose,
}: ProjectSidebarProps) {
  const [newName, setNewName] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    const name = newName.trim();
    if (!name) return;
    onAddProject(name);
    setNewName("");
  };

  const startRename = (project: Project) => {
    setRenamingId(project.id);
    setRenameValue(project.name);
  };

  const finishRename = () => {
    if (renamingId && renameValue.trim()) {
      onRenameProject(renamingId, renameValue.trim());
    }
    setRenamingId(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      if (result) {
        onSetBgImage(result);
      }
    };
    reader.readAsDataURL(file);
    // Reset so the same file can be re-selected
    e.target.value = "";
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-[300px] max-w-[85vw] bg-[#1e1e1e] z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#333]">
          <h2
            className="text-white text-[28px] leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Projects
          </h2>
          <button onClick={onClose} className="text-[#888] hover:text-white transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Project List */}
        <div className="flex-1 overflow-y-auto py-2">
          {/* Most Pressing - all tasks overview */}
          <div
            className={`flex items-center gap-2 px-4 py-3 cursor-pointer transition-colors ${
              activeProjectId === ALL_TASKS_ID
                ? "bg-[#ff6600]/15 border-l-[3px] border-[#ff6600]"
                : "hover:bg-[#2a2a2a] border-l-[3px] border-transparent"
            }`}
            onClick={() => { onSelect(ALL_TASKS_ID); onClose(); }}
          >
            <AlertTriangle size={18} className={activeProjectId === ALL_TASKS_ID ? "text-[#ff6600]" : "text-[#666]"} />
            <div className="flex-1 min-w-0">
              <p className={`text-sm truncate ${activeProjectId === ALL_TASKS_ID ? "text-white" : "text-[#ccc]"}`}>
                Most Pressing
              </p>
              <p className="text-[#666] text-xs">
                All tasks by urgency
              </p>
            </div>
          </div>

          <div className="h-px bg-[#333] mx-4 my-1" />

          {projects.map((project) => {
            const isActive = project.id === activeProjectId;
            const completedCount = project.tasks.filter((t) => t.completed).length;
            const totalCount = project.tasks.length;

            return (
              <div
                key={project.id}
                className={`flex items-center gap-2 px-4 py-3 cursor-pointer transition-colors ${
                  isActive ? "bg-[#00cc44]/15 border-l-[3px] border-[#00cc44]" : "hover:bg-[#2a2a2a] border-l-[3px] border-transparent"
                }`}
                onClick={() => { onSelect(project.id); onClose(); }}
              >
                <FolderOpen size={18} className={isActive ? "text-[#00cc44]" : "text-[#666]"} />

                {renamingId === project.id ? (
                  <input
                    className="flex-1 bg-[#111] text-white px-2 py-1 rounded border border-[#444] focus:border-[#0c4] focus:outline-none text-sm"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={finishRename}
                    onKeyDown={(e) => { if (e.key === "Enter") finishRename(); }}
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                  />
                ) : (
                  <div
                    className="flex-1 min-w-0"
                    onDoubleClick={(e) => { e.stopPropagation(); startRename(project); }}
                  >
                    <p className={`text-sm truncate ${isActive ? "text-white" : "text-[#ccc]"}`}>
                      {project.name}
                    </p>
                    <p className="text-[#666] text-xs">
                      {completedCount}/{totalCount} tasks done
                    </p>
                  </div>
                )}

                {projects.length > 1 && (
                  <button
                    className="text-[#555] hover:text-red-400 transition-colors p-1"
                    onClick={(e) => { e.stopPropagation(); onDeleteProject(project.id); }}
                    title="Delete project"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Project */}
        <div className="border-t border-[#333] p-4 space-y-3">
          <div className="flex gap-2">
            <input
              className="flex-1 bg-[#111] text-white px-3 py-2 rounded-lg border border-[#444] focus:border-[#0c4] focus:outline-none text-sm"
              placeholder="New project name..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
            />
            <button
              onClick={handleAdd}
              className="bg-[#00cc44] hover:bg-[#00aa33] text-white rounded-lg px-3 py-2 transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>

          <button
            onClick={onExport}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-[#333] hover:bg-[#444] text-[#aaa] transition-colors text-sm"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            <Download size={14} />
            Export CSV
          </button>

          <button
            onClick={() => { onOpenColors(); onClose(); }}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-[#333] hover:bg-[#444] text-[#aaa] transition-colors text-sm"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            <Palette size={14} />
            Card Colors
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-[#333] hover:bg-[#444] text-[#aaa] transition-colors text-sm"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            <ImagePlus size={14} />
            Background Image
          </button>

          {bgImage && (
            <button
              onClick={() => onSetBgImage(null)}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-[#333] hover:bg-[#444] text-red-400/80 hover:text-red-400 transition-colors text-sm"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              <ImageOff size={14} />
              Remove Background
            </button>
          )}

          {bgImage && (
            <div className="space-y-2 rounded-lg bg-[#282828] p-3">
              {/* Brightness slider */}
              <div className="flex items-center gap-2">
                <Sun size={14} className="text-[#aaa] flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-[#aaa] text-xs"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      Brightness
                    </span>
                    <span
                      className="text-[#666] text-xs"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      {bgBrightness}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={100}
                    value={bgBrightness}
                    onChange={(e) => onSetBgBrightness(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-[#444] accent-[#00cc44]"
                  />
                </div>
              </div>

              {/* Blur slider */}
              <div className="flex items-center gap-2">
                <Droplets size={14} className="text-[#aaa] flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-[#aaa] text-xs"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      Blur
                    </span>
                    <span
                      className="text-[#666] text-xs"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      {bgBlur}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={30}
                    value={bgBlur}
                    onChange={(e) => onSetBgBlur(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-[#444] accent-[#00cc44]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}