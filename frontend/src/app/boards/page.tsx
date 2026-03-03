"use client";

import { useState } from "react";
import { Menu, X, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

const BOARDS = [
  { id: "1", name: "AIN: Lead Pipeline" },
  { id: "2", name: "AIN: CROS Clients" },
  { id: "3", name: "Investing: Deal Pipeline" },
  { id: "4", name: "Investing: Portfolio" },
  { id: "5", name: "WGOOAA: Growth" },
  { id: "6", name: "WGOOAA: Content" },
  { id: "7", name: "Patriot: M&A Pipeline" },
  { id: "8", name: "Patriot: Investor Outreach" },
  { id: "9", name: "Launch Commerce: Features" },
  { id: "10", name: "AIN FX: Tracking" },
  { id: "11", name: "Angel & Heroes: Recovery" },
  { id: "12", name: "Ops: Content Pipeline" },
  { id: "13", name: "Ops: Tech Build" },
  { id: "14", name: "Ops: Ideas" },
  { id: "15", name: "Ops: Blocked" },
];

// Define pipeline stages for each board type
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

const DEFAULT_STAGES = ["Inbox", "In Progress", "Review", "Done"];

export default function BoardsPage() {
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const selectedBoard = BOARDS.find((b) => b.id === selectedBoardId);
  const boardSlug = selectedBoard?.name.toLowerCase().replace(/\s+/g, "-").replace(/:/g, "");
  const stages = boardSlug ? (BOARD_STAGES[boardSlug] || DEFAULT_STAGES) : DEFAULT_STAGES;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {selectedBoardId && (
              <button
                onClick={() => {
                  setSelectedBoardId(null);
                  setSidebarOpen(false);
                }}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <Link href="/boards" className="flex items-center gap-2 text-slate-900 hover:text-slate-600">
              <Home className="w-5 h-5" />
              <span className="font-bold">Mission Control</span>
            </Link>
          </div>
          {selectedBoardId && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      {selectedBoardId && (
        <aside
          className={`fixed lg:static left-0 top-[73px] lg:top-0 h-[calc(100vh-73px)] w-64 bg-white border-r border-slate-200 z-40 transition-transform duration-200 flex flex-col overflow-hidden ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">All Boards</h2>
          </div>
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {BOARDS.map((board) => (
                <li key={board.id}>
                  <button
                    onClick={() => {
                      setSelectedBoardId(board.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedBoardId === board.id
                        ? "bg-slate-900 text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {board.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {!selectedBoardId ? (
          // Board list view
          <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Mission Control</h1>
            <p className="text-slate-600 mb-8">All 15 Project Boards</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {BOARDS.map((board) => (
                <button
                  key={board.id}
                  onClick={() => setSelectedBoardId(board.id)}
                  className="p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all text-left active:bg-slate-50"
                >
                  <h2 className="font-semibold text-slate-900">{board.name}</h2>
                  <p className="text-xs text-slate-500 mt-2">Click to open</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Board Kanban view
          <div className="p-4 lg:p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900">{selectedBoard?.name}</h1>
              <p className="text-sm text-slate-600 mt-1">{stages.length} pipeline stages</p>
            </div>

            {/* Kanban columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-max">
              {stages.map((stage) => (
                <div
                  key={stage}
                  className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col min-h-[300px]"
                >
                  <h3 className="font-semibold text-slate-900 mb-4 text-sm">{stage}</h3>
                  <div className="space-y-3 flex-1">
                    <div className="p-3 bg-slate-50 rounded border border-dashed border-slate-300 text-center text-xs text-slate-500">
                      No tasks
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
