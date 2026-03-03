export default function BoardsPage() {
  const boards = [
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

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Mission Control</h1>
        <p className="text-slate-600 mb-8">All 15 Project Boards</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board) => (
            <div
              key={board.id}
              className="p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow"
            >
              <h2 className="font-semibold text-slate-900">{board.name}</h2>
              <p className="text-xs text-slate-500 mt-2">Board ID: {board.id}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
