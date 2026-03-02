/**
 * Mobile-optimized Kanban board with carousel view for mobile
 * and horizontal scroll for desktop.
 * 
 * Handles:
 * - Single column carousel on mobile (0-640px)
 * - Multi-column view on tablet+ (641px+)
 * - Touch gestures for column navigation
 * - Responsive card sizing
 */

"use client";

import { useState, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type TaskStatus = "inbox" | "in_progress" | "review" | "done";

type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  priority: string;
  description?: string | null;
  due_at?: string | null;
  assigned_agent_id?: string | null;
};

type TaskBoardMobileProps = {
  tasks: Task[];
  onTaskSelect?: (task: Task) => void;
  onTaskMove?: (taskId: string, status: TaskStatus) => void | Promise<void>;
  readOnly?: boolean;
};

const COLUMNS = [
  { title: "Inbox", status: "inbox" as TaskStatus, color: "bg-slate-50" },
  { title: "In Progress", status: "in_progress" as TaskStatus, color: "bg-purple-50" },
  { title: "Review", status: "review" as TaskStatus, color: "bg-indigo-50" },
  { title: "Done", status: "done" as TaskStatus, color: "bg-green-50" },
];

/**
 * Mobile-First Kanban Board Component
 * - Mobile: Single column carousel with dots
 * - Tablet+: Traditional horizontal scrolling Kanban
 */
export function TaskBoardMobile({
  tasks,
  onTaskSelect,
  onTaskMove,
  readOnly,
}: TaskBoardMobileProps) {
  const [activeColumnIndex, setActiveColumnIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(true);

  // Detect mobile on mount and on resize
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  React.useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // Group tasks by status
  const groupedTasks = useMemo(() => {
    const groups: Record<TaskStatus, Task[]> = {
      inbox: [],
      in_progress: [],
      review: [],
      done: [],
    };
    tasks.forEach((task) => {
      groups[task.status].push(task);
    });
    return groups;
  }, [tasks]);

  const activeColumn = COLUMNS[activeColumnIndex];
  const columnTasks = groupedTasks[activeColumn.status];

  // Handle swipe navigation
  const handlePrevColumn = () => {
    setActiveColumnIndex((i) => Math.max(0, i - 1));
  };

  const handleNextColumn = () => {
    setActiveColumnIndex((i) => Math.min(COLUMNS.length - 1, i + 1));
  };

  // Mobile carousel view
  if (isMobile) {
    return (
      <div className="flex flex-col gap-4 h-full">
        {/* Column Header */}
        <div className="px-4 pt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              {activeColumn.title}
            </h2>
            <span className="text-sm font-medium text-slate-500">
              {activeColumnIndex + 1} / {COLUMNS.length}
            </span>
          </div>

          {/* Column Navigation Dots */}
          <div className="flex gap-2 justify-center">
            {COLUMNS.map((col, idx) => (
              <button
                key={col.status}
                onClick={() => setActiveColumnIndex(idx)}
                className={cn(
                  "h-2 w-2 rounded-full transition-all",
                  idx === activeColumnIndex
                    ? "bg-slate-900 w-8"
                    : "bg-slate-300 hover:bg-slate-400"
                )}
                aria-label={`Go to ${col.title}`}
              />
            ))}
          </div>
        </div>

        {/* Tasks Grid (single column) */}
        <div className="flex-1 overflow-y-auto px-4">
          <div className="space-y-3">
            {columnTasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-slate-500">
                  No tasks in {activeColumn.title.toLowerCase()}
                </p>
              </div>
            ) : (
              columnTasks.map((task) => (
                <TaskCardMobile
                  key={task.id}
                  task={task}
                  onClick={() => onTaskSelect?.(task)}
                />
              ))
            )}
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="flex gap-2 px-4 pb-4">
          <button
            onClick={handlePrevColumn}
            disabled={activeColumnIndex === 0}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border",
              activeColumnIndex === 0
                ? "border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed"
                : "border-slate-300 text-slate-700 bg-white hover:bg-slate-50"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Previous</span>
          </button>
          <button
            onClick={handleNextColumn}
            disabled={activeColumnIndex === COLUMNS.length - 1}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border",
              activeColumnIndex === COLUMNS.length - 1
                ? "border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed"
                : "border-slate-300 text-slate-700 bg-white hover:bg-slate-50"
            )}
          >
            <span className="text-sm font-medium">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Desktop/tablet: Traditional Kanban
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 overflow-x-auto pb-6">
      {COLUMNS.map((column) => {
        const tasks = groupedTasks[column.status];
        return (
          <div
            key={column.status}
            className={cn(
              "rounded-lg border border-slate-200 min-h-[500px] p-4",
              column.color
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">{column.title}</h3>
              <span className="text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded">
                {tasks.length}
              </span>
            </div>
            <div className="space-y-2">
              {tasks.map((task) => (
                <TaskCardMobile
                  key={task.id}
                  task={task}
                  onClick={() => onTaskSelect?.(task)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Mobile-optimized task card with larger touch target
 */
function TaskCardMobile({
  task,
  onClick,
}: {
  task: Task;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-3 rounded-lg border border-slate-200 bg-white",
        "hover:border-slate-300 hover:shadow-sm transition-all",
        "min-h-[60px] flex flex-col justify-between",
        "active:bg-slate-50" // Mobile active state
      )}
    >
      <h4 className="font-medium text-sm text-slate-900 line-clamp-2">
        {task.title}
      </h4>
      <div className="flex items-center gap-2 mt-2">
        <span
          className={cn(
            "text-xs font-medium px-2 py-0.5 rounded",
            task.priority === "high"
              ? "bg-red-100 text-red-700"
              : task.priority === "medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
          )}
        >
          {task.priority}
        </span>
        {task.due_at && (
          <span className="text-xs text-slate-500">{task.due_at}</span>
        )}
      </div>
    </button>
  );
}
