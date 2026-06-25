import React, { useState } from 'react';
import BoardList from './components/BoardList';
import BoardView from './components/BoardView';
import { Kanban, HelpCircle, Layers, Settings, User } from 'lucide-react';

export default function App() {
  const [currentBoardId, setCurrentBoardId] = useState(null);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 selection:bg-indigo-500/10 selection:text-indigo-600">
      {/* Top Navbar */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo Section */}
          <div 
            onClick={() => setCurrentBoardId(null)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100/60 group-hover:bg-indigo-100/80 group-hover:border-indigo-200 transition-all duration-300 shadow-sm">
              <Kanban className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex items-center">
              <span className="font-bold tracking-tight text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                ZenBoard
              </span>
              <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase bg-indigo-50 text-indigo-600 border border-indigo-100/50">
                PRO
              </span>
            </div>
          </div>

          {/* Center Navigation Links (SaaS look) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button 
              onClick={() => setCurrentBoardId(null)}
              className={`transition-colors hover:text-indigo-600 ${!currentBoardId ? 'text-indigo-600 font-semibold' : ''}`}
            >
              Workspace
            </button>
            <a href="#" className="transition-colors hover:text-indigo-600">Templates</a>
            <a href="#" className="transition-colors hover:text-indigo-600">Integrations</a>
            <a href="#" className="transition-colors hover:text-indigo-600">Documentation</a>
          </nav>

          {/* Right Section: Status & Profile */}
          <div className="flex items-center gap-4">
            {/* Status indicator */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200/40 text-[11px] font-medium text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Sync Active</span>
            </div>

            {/* Icons / Profile */}
            <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
              <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors" title="Settings">
                <Settings className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors" title="Help Docs">
                <HelpCircle className="w-4 h-4" />
              </button>
              <div 
                className="ml-2 w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-600 border border-indigo-200 text-white font-bold flex items-center justify-center text-xs shadow-sm cursor-pointer hover:ring-2 hover:ring-indigo-100 transition-all"
                title="Shivanshi (User)"
              >
                SC
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0">
        {currentBoardId ? (
          <BoardView 
            boardId={currentBoardId} 
            onBack={() => setCurrentBoardId(null)} 
          />
        ) : (
          <BoardList 
            onSelectBoard={setCurrentBoardId} 
          />
        )}
      </main>
    </div>
  );
}
