"use client";

import { useState } from "react";
import { Menu, X, ArrowLeft } from "lucide-react";

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

const STATUSES = ["Inbox", "In Progress", "Review", "Done"];

export default function BoardsPage() {
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const selectedBoard = BOARDS.find((b) => b.id === selectedBoardId);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile hamburger */}
      {selectedBoardId && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      )}

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      {selectedBoardId && (
        <aside
          className={`fixed lg:static left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 z-40 transition-transform duration-200 flex flex-col ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="p-4 border-b border-slate-200">
            <button
              onClick={() => {
                setSelectedBoardId(null);
                setSidebarOpen(false);
              }}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Boards
            </button>
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
      <main className={`flex-1 ${selectedBoardId ? "lg:ml-0" : ""}`}>
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
            <div className="mb-6 flex items-center justify-between mt-8 lg:mt-0">
              <h1 className="text-2xl font-bold text-slate-900">{selectedBoard?.name}</h1>
              <button
                onClick={() => setSelectedBoardId(null)}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg lg:hidden"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>

            {/* Kanban columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-max">
              {STATUSES.map((status) => (
                <div
                  key={status}
                  className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col"
                >
                  <h3 className="font-semibold text-slate-900 mb-4 text-sm">{status}</h3>
                  <div className="space-y-3 flex-1">
                    <div className="p-3 bg-slate-50 rounded border border-dashed border-slate-300 text-center text-xs text-slate-500 min-h-[200px] flex items-center justify-center">
                      No tasks yet
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
