"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronLeft, ChevronRight, Plus, Trash2, X as XIcon, Mic, Square, AlertCircle } from "lucide-react";

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

interface VoiceNote {
  id: string;
  timestamp: string;
  audioUrl: string;
  transcript?: string;
}

interface Checklist {
  id: string;
  text: string;
  completed: boolean;
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  tags: string[];
  checklist?: Checklist[];
  notes?: string;
  voiceNotes?: VoiceNote[];
  assignee?: string;
  dueDate?: string;
  updatedAt?: string;
}

// Auto-sync card to backend
async function syncCardToBackend(boardSlug: string, stage: string, task: Task) {
  try {
    const response = await fetch("https://ain-mission-control.vercel.app/api/cards/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ board: boardSlug, stage, task })
    });
    const result = await response.json();
    
    if (result.phase4_ready) {
      console.log("🚀 PHASE 4 READY!");
    }
  } catch (error) {
    // Offline mode: continue
  }
}

export default function BoardsPage() {
  const [selectedBoardId, setSelectedBoardId] = useState<string>("15");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<{ task: Task; stage: string } | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const [tasks, setTasks] = useState<Record<string, Task[]>>({
    "Waiting on Input": [
      {
        id: "task-1",
        title: "Provide Q2 Critical Inputs",
        description: "Gathering the 3 critical inputs needed to launch Phase 4",
        priority: "high",
        tags: ["critical", "q2-launch"],
        checklist: [
          { id: "check-1", text: "Booking link for discovery call calendar", completed: false },
          { id: "check-2", text: "Interview answers (about AIN background)", completed: false },
          { id: "check-3", text: "2-3 customer case studies", completed: false }
        ],
        notes: "These inputs unlock Phase 4 execution. Once received, we can finalize content strategy and launch.",
        voiceNotes: [],
        assignee: "Jeff",
        dueDate: "2026-03-07",
        updatedAt: new Date().toISOString()
      }
    ]
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("mission-control-tasks");
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage AND sync to backend whenever tasks change
  useEffect(() => {
    localStorage.setItem("mission-control-tasks", JSON.stringify(tasks));
    
    // Auto-sync all tasks to backend
    Object.entries(tasks).forEach(([stage, stageTasks]) => {
      stageTasks.forEach((task) => {
        const selectedBoard = BOARDS.find((b) => b.id === selectedBoardId);
        if (selectedBoard) {
          syncCardToBackend(selectedBoard.slug, stage, task);
        }
      });
    });
  }, [tasks, selectedBoardId]);

  // Handle hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        const board = BOARDS.find((b) => b.slug === hash || b.id === hash);
        if (board) {
          setSelectedBoardId(board.id);
        }
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleBoardSelect = (boardId: string) => {
    const board = BOARDS.find((b) => b.id === boardId);
    if (board) {
      window.location.hash = board.slug;
      setSelectedBoardId(boardId);
      setMobileMenuOpen(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (selectedTask) {
          const voiceNote: VoiceNote = {
            id: `voice-${Date.now()}`,
            timestamp: new Date().toISOString(),
            audioUrl,
            transcript: "[Transcription pending]"
          };

          const updatedTask = {
            ...selectedTask.task,
            voiceNotes: [...(selectedTask.task.voiceNotes || []), voiceNote],
            updatedAt: new Date().toISOString()
          };

          setTasks((prev) => ({
            ...prev,
            [selectedTask.stage]: prev[selectedTask.stage].map((t) =>
              t.id === selectedTask.task.id ? updatedTask : t
            )
          }));

          setSelectedTask({ ...selectedTask, task: updatedTask });
          
          // Sync voice note to backend for transcription
          const selectedBoard = BOARDS.find((b) => b.id === selectedBoardId);
          if (selectedBoard) {
            syncCardToBackend(selectedBoard.slug, selectedTask.stage, updatedTask);
          }
          
          setNotification("✅ Voice note recorded and synced");
          setTimeout(() => setNotification(null), 2000);
        }
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (error) {
      setNotification("❌ Microphone access denied");
      setTimeout(() => setNotification(null), 2000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const selectedBoard = BOARDS.find((b) => b.id === selectedBoardId);
  const stages = selectedBoard ? (BOARD_STAGES[selectedBoard.slug] || ["Inbox", "In Progress", "Review", "Done"]) : ["Inbox", "In Progress", "Review", "Done"];

  const addTask = (stage: string, title: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      description: "",
      priority: "medium",
      tags: [],
      checklist: [],
      notes: "",
      voiceNotes: [],
      updatedAt: new Date().toISOString()
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
    setSelectedTask(null);
  };

  const updateTask = (field: string, value: any) => {
    if (!selectedTask) return;
    
    const updatedTask = {
      ...selectedTask.task,
      [field]: value,
      updatedAt: new Date().toISOString()
    };

    setTasks((prev) => ({
      ...prev,
      [selectedTask.stage]: prev[selectedTask.stage].map((t) =>
        t.id === selectedTask.task.id ? updatedTask : t
      )
    }));

    setSelectedTask({ ...selectedTask, task: updatedTask });
    setNotification(`✅ Updated`);
    setTimeout(() => setNotification(null), 1500);
  };

  const toggleChecklistItem = (taskId: string, checkId: string) => {
    if (!selectedTask) return;
    const updatedTask = {
      ...selectedTask.task,
      checklist: selectedTask.task.checklist?.map((item) =>
        item.id === checkId ? { ...item, completed: !item.completed } : item
      ) || [],
      updatedAt: new Date().toISOString()
    };
    
    setTasks((prev) => ({
      ...prev,
      [selectedTask.stage]: prev[selectedTask.stage].map((t) =>
        t.id === taskId ? updatedTask : t
      )
    }));
    
    setSelectedTask({ ...selectedTask, task: updatedTask });
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

      {/* Left Sidebar */}
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
                  onClick={() => handleBoardSelect(board.id)}
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-slate-200 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mt-12 md:mt-0">{selectedBoard?.name}</h1>
              <p className="text-sm text-slate-600 mt-1">{stages.length} pipeline stages</p>
            </div>
            <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-mono">
              #{selectedBoard?.slug}
            </div>
          </div>
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
                      <div
                        key={task.id}
                        onClick={() => setSelectedTask({ task, stage })}
                        className="p-3 bg-slate-50 rounded border border-slate-300 hover:shadow-md hover:border-slate-400 transition-all cursor-pointer group"
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-slate-900 text-sm flex-1">{task.title}</h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTask(stage, task.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">{task.description}</p>
                        {task.voiceNotes && task.voiceNotes.length > 0 && (
                          <p className="text-xs text-blue-600 mt-1">🎙️ {task.voiceNotes.length}</p>
                        )}
                        <div className="flex gap-2 mt-2">
                          {task.tags.map((tag) => (
                            <span key={tag} className={`text-xs px-2 py-1 rounded-full ${tag === "critical" ? "bg-red-100 text-red-700" : "bg-slate-200 text-slate-700"}`}>
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

      {/* Card Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelectedTask(null)}>
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900">{selectedTask.task.title}</h2>
                <p className="text-sm text-slate-600 mt-2">{selectedTask.stage}</p>
              </div>
              <button onClick={() => setSelectedTask(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {notification && (
              <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {notification}
              </div>
            )}

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-900 block mb-2">Priority</label>
                  <select
                    value={selectedTask.task.priority}
                    onChange={(e) => updateTask("priority", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-900 block mb-2">Assignee</label>
                  <input
                    type="text"
                    value={selectedTask.task.assignee || ""}
                    onChange={(e) => updateTask("assignee", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    placeholder="Enter name"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">Description</label>
                <textarea
                  value={selectedTask.task.description}
                  onChange={(e) => updateTask("description", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm h-24 resize-none"
                  placeholder="Add description..."
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">Notes</label>
                <textarea
                  value={selectedTask.task.notes || ""}
                  onChange={(e) => updateTask("notes", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm h-24 resize-none"
                  placeholder="Add notes..."
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-3">Voice Notes</label>
                {isRecording ? (
                  <button
                    onClick={stopRecording}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
                  >
                    <Square className="w-5 h-5" />
                    Stop Recording
                  </button>
                ) : (
                  <button
                    onClick={startRecording}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium"
                  >
                    <Mic className="w-5 h-5" />
                    Record Voice Note
                  </button>
                )}
                
                {selectedTask.task.voiceNotes && selectedTask.task.voiceNotes.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {selectedTask.task.voiceNotes.map((note) => (
                      <div key={note.id} className="p-3 bg-blue-50 rounded border border-blue-200">
                        <audio controls className="w-full mb-2">
                          <source src={note.audioUrl} type="audio/webm" />
                        </audio>
                        <p className="text-xs text-slate-600 mb-1">{new Date(note.timestamp).toLocaleString()}</p>
                        <p className="text-xs text-slate-700">{note.transcript}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedTask.task.checklist && selectedTask.task.checklist.length > 0 && (
                <div>
                  <label className="text-sm font-semibold text-slate-900 block mb-3">Checklist</label>
                  <div className="space-y-2">
                    {selectedTask.task.checklist.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => toggleChecklistItem(selectedTask.task.id, item.id)}
                          className="w-4 h-4 rounded border-slate-300"
                        />
                        <span className={`text-sm ${item.completed ? "line-through text-slate-400" : "text-slate-600"}`}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">Due Date</label>
                <input
                  type="date"
                  value={selectedTask.task.dueDate || ""}
                  onChange={(e) => updateTask("dueDate", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              {selectedTask.task.updatedAt && (
                <p className="text-xs text-slate-500 text-right">
                  Last updated: {new Date(selectedTask.task.updatedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
