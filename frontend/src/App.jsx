import React, { useState } from 'react';
import BoardList from './components/BoardList';
import BoardView from './components/BoardView';
import ProjectsPage from './components/ProjectsPage';
import TeamPage from './components/TeamPage';
import AnalyticsPage from './components/AnalyticsPage';
import { Kanban, Search, Bell, Zap } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('workspace'); // workspace | projects | team | analytics
  const [currentBoardId, setCurrentBoardId] = useState(null);

  const navigateToWorkspace = () => {
    setCurrentPage('workspace');
    setCurrentBoardId(null);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'projects':
        return <ProjectsPage />;
      case 'team':
        return <TeamPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'workspace':
      default:
        if (currentBoardId) {
          return (
            <BoardView 
              boardId={currentBoardId} 
              onBack={() => setCurrentBoardId(null)} 
            />
          );
        }
        return (
          <BoardList 
            onSelectBoard={setCurrentBoardId} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#111827]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-45 h-16 bg-white border-b border-[#e5e7eb] shadow-[0_1px_3px_rgba(0,0,0,0.08)] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          
          {/* Left Area: Logo with lightning bolt icon & gradient text */}
          <div 
            onClick={navigateToWorkspace}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center transition-all duration-300 group-hover:bg-indigo-100/80">
              <Zap className="w-5 h-5 text-[#4f46e5] fill-[#4f46e5]/10 animate-pulse" />
            </div>
            <span className="font-extrabold tracking-tight text-xl bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent transition-all">
              ZenBoard
            </span>
          </div>

          {/* Center Navigation Links (Routing Toggles) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#6b7280]">
            <button 
              onClick={navigateToWorkspace}
              className={`transition-colors hover:text-[#4f46e5] ${
                currentPage === 'workspace' ? 'text-[#4f46e5]' : ''
              }`}
            >
              Workspace
            </button>
            <button 
              onClick={() => { setCurrentPage('projects'); setCurrentBoardId(null); }}
              className={`transition-colors hover:text-[#4f46e5] ${
                currentPage === 'projects' ? 'text-[#4f46e5]' : ''
              }`}
            >
              Projects
            </button>
            <button 
              onClick={() => { setCurrentPage('team'); setCurrentBoardId(null); }}
              className={`transition-colors hover:text-[#4f46e5] ${
                currentPage === 'team' ? 'text-[#4f46e5]' : ''
              }`}
            >
              Team
            </button>
            <button 
              onClick={() => { setCurrentPage('analytics'); setCurrentBoardId(null); }}
              className={`transition-colors hover:text-[#4f46e5] ${
                currentPage === 'analytics' ? 'text-[#4f46e5]' : ''
              }`}
            >
              Analytics
            </button>
          </nav>

          {/* Right Area: Search, Bell, Upgrade Button, Avatar */}
          <div className="flex items-center gap-4">
            
            {/* Fake Search Bar */}
            <div className="relative hidden sm:block w-48 lg:w-64">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search..."
                disabled
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#e5e7eb] bg-slate-50 text-xs text-slate-400 cursor-not-allowed outline-none focus:border-[#4f46e5]"
              />
            </div>

            {/* Bell Icon with notification dot */}
            <div className="relative p-1.5 text-[#6b7280] hover:text-[#111827] hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ef4444] border-2 border-white"></span>
            </div>

            {/* Upgrade Button */}
            <button className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-xs font-bold shadow-sm hover:opacity-95 btn-transition btn-hover active:scale-[0.98]">
              Upgrade
            </button>

            {/* Avatar SC */}
            <div 
              className="w-8 h-8 rounded-full bg-[#4f46e5] text-white font-bold flex items-center justify-center text-xs shadow-sm hover:ring-2 hover:ring-indigo-100 transition-all cursor-pointer"
              title="Shivanshi (SC)"
            >
              SC
            </div>

          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0">
        {renderContent()}
      </main>
    </div>
  );
}
