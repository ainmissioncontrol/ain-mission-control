"use client";

import { useState } from "react";
import { Menu, X, ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";

const BOARDS = [
  { id: "1", name: "AIN: Lead Pipeline", slug: "ain-lead-pipeline" },
  { id: "2", name: "AIN: CROS Clients", slug: "ain-cros-clients" },
  { id: "3", name: "Investing: Deal Pipeline", slug: "investing-deal-pipeline" },
  { id: "4", name: "Investing: Portfolio", slug: "investing-portfolio" },
  { id: "5", name: "WGOOAA: Growth", slug: "wgooaa-growth" },
  { id: "6", name: "WGOOAA: Content", slug: "wgooaa-content" },
  { id: "7", name: "Patriot: M&A Pipeline", slug: "patriot-ma-pipeline" },
  { id: "8", name: "Patriot: Investor Outreach", slug: "patriot-investor-outreach" },
  { id: "9", name: "Launch Commerce: Features", slug: "lc-features" },
  { id: "10", name: "AIN FX: Tracking", slug: "ain-fx-tracking" },
  { id: "11", name: "Angel & Heroes: Recovery", slug: "ah-recovery" },
  { id: "12", name: "Ops: Content Pipeline", slug: "ops-content" },
  { id: "13", name: "Ops: Tech Build", slug: "ops-tech" },
  { id: "14", name: "Ops: Ideas", slug: "ops-ideas" },
  { id: "15", name: "Ops: Blocked", slug: "ops-blocked" },
];

const BOARD_STAGES: Record<string, string[]> = {
  "ain-lead-pipeline": ["Prospect", "Contacted", "Qualified", "Discovery Booked", "Proposal Sent", "Closed"],
  "ain-cros-clients": ["Onboarding", "Active", "Success Tracking", "Churn Risk"],
  "investing-deal-pipeline": ["Research", "Due Diligence", "Risk Review", "Execution", "Monitoring"],
  "investing-portfolio": ["Long Position", "Short Position", "Exit"],
  "wgooaa-growth": ["Idea", "Validation", "Execution", "Launch", "Scale"],
  "wgooaa-content": ["Backlog", "In Progress", "Review", "Approved", "Published"],
  "patriot-ma-pipeline": ["Target Identified", "Outreach", "LOI", "DD", "Negotiation", "Closed", "Integration"],
  "patriot-investor-outreach": ["Prospect", "First Call", "Proposal Sent", "Committed"],
  "lc-features": ["Backlog", "Design", "Development", "Testing", "Released"],
  "ain-fx-tracking": ["Entry", "Active", "Monitoring", "Exit"],
  "ah-recovery": ["Assessment", "Turnaround Plan", "Execution", "Monitoring", "Success"],
  "ops-content": ["Backlog", "Research", "Writing", "Review", "Approved", "Published", "Monitoring"],
  "ops-tech": ["Backlog", "Design", "Development", "Testing", "Deployed"],
  "ops-ideas": ["Brainstorm", "Research", "Planning", "Ready"],
  "ops-blocked": ["Waiting on Decision", "Waiting on Input", "External Blocker"],
};

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  tags: string[];
}

export default function BoardsPage() {
  const [selectedBoardId, setSelectedBoardId] = useState<string>("15");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Local state for tasks - will be replaced with database
  const [tasks, setTasks] = useState<Record<string, Task[]>>({
    "Waiting on Input": [
      {
        id: "task-1",
        title: "Provide Q2 Critical Inputs",
        description: "Need: booking link, interview answers, case studies",
        priority: "high",
        tags: ["critical", "q2-launch"]
      }
    ]
  });

  const selectedBoard = BOARDS.find((b) => b.id === selectedBoardId);
  const stages = selectedBoard ? (BOARD_STAGES[selectedBoard.slug] || ["Inbox", "In Progress", "Review", "Done"]) : ["Inbox", "In Progress", "Review", "Done"];

  const addTask = (stage: string, title: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      description: "",
      priority: "medium",
      tags: []
    };
    setTasks((prev) => ({
      ...prev,
      [stage]: [...(prev[stage] || []), newTask]
    }));
  };

  const deleteTask = (stage: string, taskId: string) => {
    setTasks((prev) => ({
      ...prev,
      [stage]: prev[stage].filter((t) => t.id !== taskId)
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100"
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Left Sidebar - Boards List */}
      <aside
        className={`fixed md:static left-0 top-0 h-screen bg-white border-r border-slate-200 z-40 transition-all duration-200 flex flex-col ${
          sidebarCollapsed ? "w-20" : "w-64"
        } ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          {!sidebarCollapsed && <h2 className="font-bold text-slate-900">Boards</h2>}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex p-1 hover:bg-slate-100 rounded"
          >
            {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {BOARDS.map((board) => (
              <li key={board.id}>
                <button
                  onClick={() => {
                    setSelectedBoardId(board.id);
                    setMobileMenuOpen(false);
                  }}
                  title={board.name}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors truncate ${
                    selectedBoardId === board.id
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {sidebarCollapsed ? board.name.charAt(0) : board.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area - Kanban Board */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-slate-200 p-4 lg:p-6">
          <h1 className="text-2xl font-bold text-slate-900 mt-12 md:mt-0">{selectedBoard?.name}</h1>
          <p className="text-sm text-slate-600 mt-1">{stages.length} pipeline stages</p>
        </div>

        <div className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="grid gap-4 auto-rows-max" style={{ gridTemplateColumns: `repeat(${Math.min(stages.length, 4)}, minmax(300px, 1fr))` }}>
            {stages.map((stage) => (
              <div key={stage} className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col min-h-[400px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900 text-sm">{stage}</h3>
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">{tasks[stage]?.length || 0}</span>
                </div>

                <div className="space-y-3 flex-1">
                  {tasks[stage] && tasks[stage].length > 0 ? (
                    tasks[stage].map((task) => (
                      <div key={task.id} className="p-3 bg-slate-50 rounded border border-slate-300 hover:shadow-md transition-shadow group">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-slate-900 text-sm flex-1">{task.title}</h4>
                          <button
                            onClick={() => deleteTask(stage, task.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{task.description}</p>
                        <div className="flex gap-2 mt-2">
                          {task.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`text-xs px-2 py-1 rounded-full ${
                                tag === "critical" ? "bg-red-100 text-red-700" : "bg-slate-200 text-slate-700"
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 bg-slate-50 rounded border border-dashed border-slate-300 text-center text-xs text-slate-500 min-h-[100px] flex items-center justify-center">
                      No tasks
                    </div>
                  )}
                </div>

                <button
                  onClick={() => addTask(stage, "New Task")}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg border border-dashed border-slate-300"
                >
                  <Plus className="w-4 h-4" />
                  Add task
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
