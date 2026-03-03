"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { SignedIn, SignedOut } from "@/auth/clerk";

interface Board {
  id: string;
  name: string;
  slug: string;
}

const BOARDS: Board[] = [
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

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [boards, setBoards] = useState<Board[]>(BOARDS);

  useEffect(() => {
    // Try to fetch from API, fall back to hardcoded
    fetch("https://ain-mission-control.vercel.app/api/v1/boards")
      .then((r) => r.json())
      .then((data) => {
        if (data.boards && Array.isArray(data.boards)) {
          setBoards(data.boards);
        }
      })
      .catch(() => {
        setBoards(BOARDS);
      });
  }, []);

  const selectedBoardData = boards.find((b) => b.id === selectedBoard);

  return (
    <>
      <SignedOut>
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
            <p className="text-slate-600">Please sign in to access Mission Control</p>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex h-screen bg-slate-50 overflow-hidden">
          {/* Mobile hamburger button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 active:bg-slate-200"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside
            className={`fixed lg:static left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 z-40 transition-transform duration-200 flex flex-col ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}
          >
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">Mission Control</h2>
            </div>
            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-2">
                {boards.map((board) => (
                  <li key={board.id}>
                    <button
                      onClick={() => {
                        setSelectedBoard(board.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors active:bg-slate-200 ${
                        selectedBoard === board.id
                          ? "bg-slate-900 text-white hover:bg-slate-800"
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

          {/* Main content */}
          <main className="flex-1 overflow-auto flex flex-col">
            {/* Header */}
            <div className="border-b border-slate-200 bg-white p-4 lg:p-6 sticky top-0 z-10">
              <h1 className="text-2xl font-bold text-slate-900 mt-8 lg:mt-0">
                {selectedBoardData ? selectedBoardData.name : "Select a Board"}
              </h1>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-4 lg:p-6">
              {!selectedBoard ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {boards.map((board) => (
                    <button
                      key={board.id}
                      onClick={() => {
                        setSelectedBoard(board.id);
                        setSidebarOpen(false);
                      }}
                      className="p-4 rounded-lg border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all text-left active:bg-slate-50"
                    >
                      <h3 className="font-semibold text-slate-900 mb-1">
                        {board.name}
                      </h3>
                      <p className="text-xs text-slate-600">{board.slug}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  {/* Kanban columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {["Inbox", "In Progress", "Review", "Done"].map((status) => (
                      <div
                        key={status}
                        className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col min-h-[300px]"
                      >
                        <h3 className="font-semibold text-slate-900 mb-4 text-sm">
                          {status}
                        </h3>
                        <div className="space-y-3 flex-1">
                          <div className="p-3 bg-slate-50 rounded border border-dashed border-slate-300 text-center text-xs text-slate-500">
                            No tasks yet
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </SignedIn>
    </>
  );
}
