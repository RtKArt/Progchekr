import React, { useState, useEffect, useCallback, useMemo } from "react";
import { TaskCard, Task, TimeUnit } from "./components/TaskCard";
import { TaskModal } from "./components/TaskModal";
import { ProjectSidebar } from "./components/ProjectSidebar";
import { ALL_TASKS_ID } from "./components/ProjectSidebar";
import {
  UrgencyColors,
  ColorSettingsModal,
  loadColors,
  saveColors,
} from "./components/ColorSettings";
import {
  Project,
  loadProjects,
  saveProjects,
  loadActiveProjectId,
  saveActiveProjectId,
  exportCsv,
} from "./components/storage";
import { registerPWA } from "./components/pwa";
import { InstallBanner } from "./components/InstallBanner";

export default function App() {
  const [projects, setProjects] = useState<Project[]>(() => loadProjects());
  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    const saved = loadActiveProjectId();
    if (saved === ALL_TASKS_ID) return ALL_TASKS_ID;
    const loaded = loadProjects();
    if (saved && loaded.find((p) => p.id === saved)) return saved;
    return ALL_TASKS_ID;
  });
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showColorSettings, setShowColorSettings] = useState(false);
  const [urgencyColors, setUrgencyColors] = useState<UrgencyColors>(() => loadColors());

  // Register PWA on mount
  useEffect(() => {
    registerPWA();
  }, []);

  const BG_IMAGE_KEY = "progchek_bg_image";
  const [bgImage, setBgImage] = useState<string | null>(() => {
    try { return localStorage.getItem(BG_IMAGE_KEY); } catch { return null; }
  });

  const BG_BLUR_KEY = "progchek_bg_blur";
  const BG_BRIGHTNESS_KEY = "progchek_bg_brightness";
  const [bgBlur, setBgBlur] = useState<number>(() => {
    try { const v = localStorage.getItem(BG_BLUR_KEY); return v ? Number(v) : 0; } catch { return 0; }
  });
  const [bgBrightness, setBgBrightness] = useState<number>(() => {
    try { const v = localStorage.getItem(BG_BRIGHTNESS_KEY); return v ? Number(v) : 40; } catch { return 40; }
  });

  const handleSetBgImage = (dataUrl: string | null) => {
    setBgImage(dataUrl);
    try {
      if (dataUrl) {
        localStorage.setItem(BG_IMAGE_KEY, dataUrl);
      } else {
        localStorage.removeItem(BG_IMAGE_KEY);
        localStorage.removeItem(BG_BLUR_KEY);
        localStorage.removeItem(BG_BRIGHTNESS_KEY);
        setBgBlur(0);
        setBgBrightness(40);
      }
    } catch { /* localStorage full or unavailable */ }
  };

  const handleSetBgBlur = (value: number) => {
    setBgBlur(value);
    try { localStorage.setItem(BG_BLUR_KEY, String(value)); } catch {}
  };

  const handleSetBgBrightness = (value: number) => {
    setBgBrightness(value);
    try { localStorage.setItem(BG_BRIGHTNESS_KEY, String(value)); } catch {}
  };

  // Persist on change
  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    saveActiveProjectId(activeProjectId);
  }, [activeProjectId]);

  const isAllView = activeProjectId === ALL_TASKS_ID;
  const activeProject = projects.find((p) => p.id === activeProjectId);
  const tasks = activeProject?.tasks ?? [];

  // Build a map of taskId -> projectId for cross-project operations
  const taskProjectMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of projects) {
      for (const t of p.tasks) {
        map.set(t.id, p.id);
      }
    }
    return map;
  }, [projects]);

  // Build aggregated "all tasks" list: incomplete tasks from all projects
  const allTasksWithLabels = useMemo(() => {
    if (!isAllView) return [];
    const items: { task: Task; projectName: string }[] = [];
    for (const p of projects) {
      for (const t of p.tasks) {
        items.push({ task: t, projectName: p.name });
      }
    }
    return items;
  }, [isAllView, projects]);

  const displayTasks = isAllView ? allTasksWithLabels.map((i) => i.task) : tasks;

  const completedCount = displayTasks.filter((t) => t.completed).length;
  const totalCount = displayTasks.length;
  const completionPercent = totalCount === 0 ? 0 : (completedCount / totalCount) * 100;

  const updateTasks = useCallback(
    (updater: (prev: Task[]) => Task[]) => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === activeProjectId ? { ...p, tasks: updater(p.tasks) } : p
        )
      );
    },
    [activeProjectId]
  );

  // Cross-project updater: find the project owning a task and update it there
  const updateTaskInProject = useCallback(
    (taskId: string, updater: (prev: Task[]) => Task[]) => {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.tasks.some((t) => t.id === taskId)) {
            return { ...p, tasks: updater(p.tasks) };
          }
          return p;
        })
      );
    },
    []
  );

  const handleDelete = (id: string) => {
    if (isAllView) {
      updateTaskInProject(id, (prev) => prev.filter((t) => t.id !== id));
    } else {
      updateTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleToggle = (id: string) => {
    if (isAllView) {
      updateTaskInProject(id, (prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
    } else {
      updateTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    }
  };

  const handleSaveTask = (title: string, description: string, time: number, unit: TimeUnit) => {
    if (editingTask) {
      if (isAllView) {
        updateTaskInProject(editingTask.id, (prev) =>
          prev.map((t) =>
            t.id === editingTask.id
              ? { ...t, title, description, timeRemaining: time, timeUnit: unit }
              : t
          )
        );
      } else {
        updateTasks((prev) =>
          prev.map((t) =>
            t.id === editingTask.id
              ? { ...t, title, description, timeRemaining: time, timeUnit: unit }
              : t
          )
        );
      }
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        title,
        description,
        timeRemaining: time,
        timeUnit: unit,
        completed: false,
      };
      if (isAllView) {
        // Add to the first project
        setProjects((prev) => {
          if (prev.length === 0) return prev;
          return prev.map((p, i) => (i === 0 ? { ...p, tasks: [...p.tasks, newTask] } : p));
        });
      } else {
        updateTasks((prev) => [...prev, newTask]);
      }
    }
    setShowTaskModal(false);
    setEditingTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleDuplicate = (task: Task) => {
    const dup: Task = {
      ...task,
      id: Date.now().toString(),
      title: `${task.title} (copy)`,
      completed: false,
    };
    if (isAllView) {
      updateTaskInProject(task.id, (prev) => [...prev, dup]);
    } else {
      updateTasks((prev) => [...prev, dup]);
    }
  };

  const clearCompleted = () => {
    if (isAllView) {
      setProjects((prev) =>
        prev.map((p) => ({ ...p, tasks: p.tasks.filter((t) => !t.completed) }))
      );
    } else {
      updateTasks((prev) => prev.filter((t) => !t.completed));
    }
  };

  // Project management
  const handleAddProject = (name: string) => {
    const newProject: Project = { id: `proj_${Date.now()}`, name, tasks: [] };
    setProjects((prev) => [...prev, newProject]);
    setActiveProjectId(newProject.id);
  };

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (activeProjectId === id && filtered.length > 0) {
        setActiveProjectId(filtered[0].id);
      }
      return filtered;
    });
  };

  const handleRenameProject = (id: string, name: string) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  };

  const handleColorsChange = (colors: UrgencyColors) => {
    setUrgencyColors(colors);
    saveColors(colors);
  };

  // Sort: incomplete first (sorted by urgency), then completed
  const toMinutes = (t: Task) => {
    if (t.timeUnit === "days") return t.timeRemaining * 24 * 60;
    if (t.timeUnit === "hours") return t.timeRemaining * 60;
    return t.timeRemaining;
  };
  const sortedTasks = [...displayTasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return toMinutes(a) - toMinutes(b);
  });

  // Build a lookup for task -> project name (for all-view labels)
  const taskProjectNameMap = useMemo(() => {
    const map = new Map<string, string>();
    if (isAllView) {
      for (const item of allTasksWithLabels) {
        map.set(item.task.id, item.projectName);
      }
    }
    return map;
  }, [isAllView, allTasksWithLabels]);

  return (
    <div className="min-h-screen relative">
      {/* Background layer */}
      {bgImage ? (
        <>
          <div
            className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${bgImage})`,
              filter: `blur(${bgBlur}px) brightness(${bgBrightness / 100})`,
              transform: bgBlur > 0 ? "scale(1.1)" : undefined,
            }}
          />
          <div className="fixed inset-0 z-0 bg-black/30" />
        </>
      ) : (
        <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#212121] via-[#262626] to-[#1f1f1f]" />
      )}

      {/* App content */}
      <div className="relative z-10 min-h-screen">
      {/* Header */}
      <div className={`sticky top-0 z-30 shadow-lg ${bgImage ? "bg-[#282828]/80 backdrop-blur-md" : "bg-[#282828]"}`}>
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-4">
          {/* Menu */}
          <button
            className="relative w-10 h-10 flex flex-col items-center justify-center gap-[5px] hover:opacity-70 transition-opacity"
            onClick={() => setSidebarOpen(true)}
          >
            <div className="w-7 h-[3px] bg-[#d9d9d9] rounded" />
            <div className="w-7 h-[3px] bg-[#d9d9d9] rounded" />
            <div className="w-7 h-[3px] bg-[#d9d9d9] rounded" />
          </button>

          {/* Title */}
          <h1
            className="text-white text-[36px] leading-none tracking-wide"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            PROGCHEKR
          </h1>

          {/* Add button */}
          <button
            className="relative w-10 h-10 flex items-center justify-center hover:opacity-70 transition-opacity"
            onClick={() => { setEditingTask(null); setShowTaskModal(true); }}
          >
            <div className="absolute w-7 h-[3px] bg-[#d9d9d9] rounded" />
            <div className="absolute w-[3px] h-7 bg-[#d9d9d9] rounded" />
          </button>
        </div>
      </div>

      {/* Project Title & Completion Bar */}
      <div className="max-w-2xl mx-auto px-4 pt-5 pb-2">
        <h2
          className="text-white text-[32px] text-center leading-none mb-1"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          {isAllView ? "Most Pressing" : (activeProject?.name ?? "No Project")}
        </h2>

        {/* Completion bar with clear completed */}
        <div className="flex items-center gap-3 mt-2">
          <div className="relative flex-1 h-[14px] bg-[#d9d9d9] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00cc44] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          {completedCount > 0 && (
            <button
              onClick={clearCompleted}
              className="text-[#666] hover:text-red-400 text-xs whitespace-nowrap transition-colors px-2 py-1 rounded-lg hover:bg-[#333]"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              title="Clear completed tasks"
            >
              Clear ({completedCount})
            </button>
          )}
        </div>

        <p
          className="text-[#aaa] text-center mt-2 text-[18px]"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          {completedCount} / {totalCount} Tasks Complete ({Math.round(completionPercent)}%)
        </p>
      </div>

      {/* Tasks List */}
      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4 pb-8">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-16">
            <p
              className="text-[#666] text-[28px]"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              No tasks yet
            </p>
            <p className="text-[#555] mt-2 text-sm">
              Tap the + button to add a task
            </p>
          </div>
        ) : (
          sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              colors={urgencyColors}
              projectLabel={isAllView ? taskProjectNameMap.get(task.id) : undefined}
              onDelete={handleDelete}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
            />
          ))
        )}
      </div>

      {/* Project Sidebar */}
      {sidebarOpen && (
        <ProjectSidebar
          projects={projects}
          activeProjectId={activeProjectId}
          bgImage={bgImage}
          bgBlur={bgBlur}
          bgBrightness={bgBrightness}
          onSelect={setActiveProjectId}
          onAddProject={handleAddProject}
          onDeleteProject={handleDeleteProject}
          onRenameProject={handleRenameProject}
          onExport={() => exportCsv(projects)}
          onOpenColors={() => setShowColorSettings(true)}
          onSetBgImage={handleSetBgImage}
          onSetBgBlur={handleSetBgBlur}
          onSetBgBrightness={handleSetBgBrightness}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      {/* Task Modal (Add / Edit) */}
      {showTaskModal && (
        <TaskModal
          existingTask={editingTask}
          onSave={handleSaveTask}
          onClose={() => { setShowTaskModal(false); setEditingTask(null); }}
        />
      )}

      {/* Color Settings Modal */}
      {showColorSettings && (
        <ColorSettingsModal
          colors={urgencyColors}
          onChange={handleColorsChange}
          onClose={() => setShowColorSettings(false)}
        />
      )}

      {/* PWA Install Banner */}
      <InstallBanner />
      </div>
    </div>
  );
}