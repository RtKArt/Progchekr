import { Task } from "./TaskCard";
import { timeUnitToMs } from "./TaskCard";

export interface Project {
  id: string;
  name: string;
  tasks: Task[];
}

const STORAGE_KEY = "progchek_projects";
const ACTIVE_KEY = "progchek_active_project";

// CSV format: projectId,projectName,taskId,title,description,timeRemaining,timeUnit,completed,deadline
function projectsToCsv(projects: Project[]): string {
  const header = "projectId,projectName,taskId,title,description,timeRemaining,timeUnit,completed,deadline";
  const rows: string[] = [header];

  for (const project of projects) {
    if (project.tasks.length === 0) {
      // Store project with no tasks as a row with empty task fields
      rows.push(
        `${esc(project.id)},${esc(project.name)},,,,,,,`
      );
    } else {
      for (const task of project.tasks) {
        rows.push(
          `${esc(project.id)},${esc(project.name)},${esc(task.id)},${esc(task.title)},${esc(task.description)},${task.timeRemaining},${task.timeUnit},${task.completed},${task.deadline}`
        );
      }
    }
  }

  return rows.join("\n");
}

function esc(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function parseCsvRow(row: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (inQuotes) {
      if (char === '"' && row[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        fields.push(current);
        current = "";
      } else {
        current += char;
      }
    }
  }
  fields.push(current);
  return fields;
}

function csvToProjects(csv: string): Project[] {
  const lines = csv.split("\n").filter((l) => l.trim());
  if (lines.length <= 1) return [];

  const projectMap = new Map<string, Project>();

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCsvRow(lines[i]);
    const [projectId, projectName, taskId, title, description, timeStr, timeUnit, completedStr, deadline] = fields;

    if (!projectMap.has(projectId)) {
      projectMap.set(projectId, { id: projectId, name: projectName, tasks: [] });
    }

    const project = projectMap.get(projectId)!;

    if (taskId) {
      const timeRem = Number(timeStr) || 0;
      const unit = (timeUnit as "minutes" | "hours" | "days") || "hours";
      const parsedDeadline = Number(deadline);
      // Migrate old tasks that don't have a deadline: compute from timeRemaining
      const taskDeadline = parsedDeadline > 0
        ? parsedDeadline
        : Date.now() + timeUnitToMs(timeRem, unit);

      project.tasks.push({
        id: taskId,
        title: title || "",
        description: description || "",
        timeRemaining: timeRem,
        timeUnit: unit,
        completed: completedStr === "true",
        deadline: taskDeadline,
      });
    }
  }

  return Array.from(projectMap.values());
}

function makeDefaultDeadline(time: number, unit: "minutes" | "hours" | "days"): number {
  return Date.now() + timeUnitToMs(time, unit);
}

const defaultProjects: Project[] = [
  {
    id: "proj_1",
    name: "Website Redesign",
    tasks: [
      { id: "1", title: "Design Element", description: "New location designed.", timeRemaining: 2, timeUnit: "hours", completed: false, deadline: makeDefaultDeadline(2, "hours") },
      { id: "2", title: "Backend API", description: "Set up REST endpoints.", timeRemaining: 6, timeUnit: "hours", completed: false, deadline: makeDefaultDeadline(6, "hours") },
      { id: "3", title: "User Testing", description: "Conduct usability tests.", timeRemaining: 8, timeUnit: "hours", completed: false, deadline: makeDefaultDeadline(8, "hours") },
      { id: "4", title: "Documentation", description: "Write technical docs.", timeRemaining: 12, timeUnit: "hours", completed: false, deadline: makeDefaultDeadline(12, "hours") },
      { id: "5", title: "Deployment", description: "Deploy to production server.", timeRemaining: 2, timeUnit: "days", completed: false, deadline: makeDefaultDeadline(2, "days") },
    ],
  },
  {
    id: "proj_2",
    name: "Mobile App",
    tasks: [
      { id: "6", title: "Wireframes", description: "Create app wireframes.", timeRemaining: 3, timeUnit: "hours", completed: false, deadline: makeDefaultDeadline(3, "hours") },
      { id: "7", title: "Auth Flow", description: "Implement login & signup.", timeRemaining: 1, timeUnit: "days", completed: false, deadline: makeDefaultDeadline(1, "days") },
      { id: "8", title: "Push Notifs", description: "Set up push notifications.", timeRemaining: 45, timeUnit: "minutes", completed: false, deadline: makeDefaultDeadline(45, "minutes") },
    ],
  },
];

export function loadProjects(): Project[] {
  try {
    const csv = localStorage.getItem(STORAGE_KEY);
    if (csv) {
      const projects = csvToProjects(csv);
      if (projects.length > 0) return projects;
    }
  } catch { /* ignore */ }
  return defaultProjects;
}

export function saveProjects(projects: Project[]): void {
  try {
    const csv = projectsToCsv(projects);
    localStorage.setItem(STORAGE_KEY, csv);
  } catch { /* ignore */ }
}

export function loadActiveProjectId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_KEY);
  } catch {
    return null;
  }
}

export function saveActiveProjectId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_KEY, id);
  } catch { /* ignore */ }
}

export function exportCsv(projects: Project[]): void {
  const csv = projectsToCsv(projects);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "progchek_data.csv";
  a.click();
  URL.revokeObjectURL(url);
}