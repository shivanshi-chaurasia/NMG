import React, { useState, useEffect } from 'react';
import api from '../api';
import { 
  Kanban, Plus, Trash2, Users, ArrowRight, Play, Trophy, 
  Activity, Star, Award, Shield, CheckCircle2, X, ChevronLeft, ChevronRight, Sparkles, Layout, Target
} from 'lucide-react';

const GRADIENTS = [
  'from-[#667eea] to-[#764ba2]',
  'from-[#ff7e5f] to-[#feb47b]',
  'from-[#00c6ff] to-[#0072ff]',
  'from-[#11998e] to-[#38ef7d]',
  'from-[#fc4a1a] to-[#f7b733]',
];

const DEMO_SLIDES = [
  {
    title: "Welcome to ZenBoard",
    description: "Your team's central command center for shipping high-quality software, tracking metrics, and automating standard tasks.",
    icon: Sparkles,
    color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    feature: "Enterprise-grade Kanban dashboard"
  },
  {
    title: "High-Velocity Kanban columns",
    description: "Organize tasks, align lists, and drag cards with smooth layouts and drag-and-drop feedback.",
    icon: Layout,
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    feature: "Drag-and-drop list columns"
  },
  {
    title: "Priority Tag left borders",
    description: "ZenBoard dynamically colors task cards with border highlights matching Critical/High, Medium, and Low priorities.",
    icon: Target,
    color: "text-amber-600 bg-amber-50 border-amber-100",
    feature: "Smart color priorities"
  },
  {
    title: "Team Sync & Collaboration",
    description: "Invite core developers, assign checklists, set deadlines, and monitor real-time task statuses in one clean view.",
    icon: Users,
    color: "text-blue-600 bg-blue-50 border-blue-100",
    feature: "Seamless member management"
  }
];

export default function BoardList({ onSelectBoard }) {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDesc, setNewBoardDesc] = useState('');
  const [activeTab, setActiveTab] = useState('All Boards');

  // Watch Demo slideshow states
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      setLoading(true);
      const response = await api.get('/boards');
      setBoards(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching boards:', err);
      setError('Could not connect to the backend server. Make sure it is running at http://localhost:8000.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;

    try {
      const response = await api.post('/boards', {
        name: newBoardName,
        description: newBoardDesc,
      });
      setBoards([...boards, response.data]);
      setNewBoardName('');
      setNewBoardDesc('');
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error creating board:', err);
      alert('Failed to create board. Please try again.');
    }
  };

  const handleDeleteBoard = async (e, id) => {
    e.stopPropagation(); // Prevent opening the board
    if (!window.confirm('Are you sure you want to delete this board? All lists and cards will be lost.')) return;

    try {
      await api.delete(`/boards/${id}`);
      setBoards(boards.filter(b => b.id !== id));
    } catch (err) {
      console.error('Error deleting board:', err);
      alert('Failed to delete board.');
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % DEMO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + DEMO_SLIDES.length) % DEMO_SLIDES.length);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#4f46e5] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-[#6b7280] font-medium text-sm">Loading your enterprise workspace...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 flex-1 flex flex-col w-full animate-fade-in-up">
      
      {/* Hero Section */}
      <div 
        className="rounded-2xl border border-[#e5e7eb] p-8 md:p-12 mb-8 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
        style={{ background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)' }}
      >
        {/* Left Side Info */}
        <div className="max-w-2xl text-left relative z-10 flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-indigo-100/80 text-[#4f46e5] text-xs font-bold mb-6 shadow-sm">
            <span>✨</span>
            <span>Now with AI-powered suggestions</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#111827] mb-4 leading-[1.1]">
            Your team's command center for shipping faster
          </h1>
          
          <p className="text-[#6b7280] text-sm md:text-base leading-relaxed max-w-xl mb-8">
            Streamline projects, eliminate chaos, and deliver results — all in one beautiful, enterprise-ready collaborative workspace.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold text-sm btn-transition btn-hover shadow-sm active:scale-95 group"
            >
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              Create New Board
            </button>
            <button
              onClick={() => { setShowDemoModal(true); setCurrentSlide(0); }}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white border border-[#e5e7eb] hover:bg-[#fafafa] text-[#111827] font-bold text-sm btn-transition shadow-sm hover:border-[#d1d5db]"
            >
              <Play className="w-4 h-4 text-[#6b7280] fill-[#6b7280]/20" />
              Watch Demo
            </button>
          </div>
        </div>

        {/* Right Side Stats cards */}
        <div className="flex flex-col gap-4 w-full sm:w-80 relative z-10 shrink-0 select-none">
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#6b7280]">Active Tasks</div>
              <div className="text-sm font-bold text-[#111827] flex items-center gap-1.5 mt-0.5">
                24 Tasks
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#e5e7eb] rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4f46e5]">
              <Kanban className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#6b7280]">Active Workspaces</div>
              <div className="text-sm font-bold text-[#111827] mt-0.5">{boards.length} Boards</div>
            </div>
          </div>

          <div className="bg-white border border-[#e5e7eb] rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#6b7280]">Milestone Rate</div>
              <div className="text-sm font-bold text-[#111827] mt-0.5">98% On-time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border border-[#e5e7eb] rounded-xl py-5 px-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3 flex-1 justify-center">
          <Users className="w-4 h-4 text-[#6b7280]" />
          <span className="text-sm font-bold text-[#111827]">50K+ Teams</span>
        </div>
        <div className="hidden md:block h-6 w-px bg-[#e5e7eb]"></div>
        <div className="flex items-center gap-3 flex-1 justify-center">
          <Activity className="w-4 h-4 text-[#6b7280]" />
          <span className="text-sm font-bold text-[#111827]">99.9% Uptime</span>
        </div>
        <div className="hidden md:block h-6 w-px bg-[#e5e7eb]"></div>
        <div className="flex items-center gap-3 flex-1 justify-center">
          <Star className="w-4 h-4 text-[#6b7280] fill-[#f59e0b]/10" />
          <span className="text-sm font-bold text-[#111827]">4.9/5 Rating</span>
        </div>
        <div className="hidden md:block h-6 w-px bg-[#e5e7eb]"></div>
        <div className="flex items-center gap-3 flex-1 justify-center">
          <Award className="w-4 h-4 text-[#6b7280]" />
          <span className="text-sm font-bold text-[#111827]">SOC2 Certified</span>
        </div>
      </div>

      {/* Workspaces Section Title & Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold tracking-tight text-[#111827]">Your Workspaces</h2>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-[#4f46e5] text-xs font-bold">
            {boards.length}
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg border border-[#e5e7eb] self-start md:self-auto">
          {['All Boards', 'Recent', 'Starred'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                activeTab === tab 
                  ? 'bg-white text-[#4f46e5] shadow-sm' 
                  : 'text-[#6b7280] hover:text-[#111827]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex flex-col gap-3">
          <p className="font-semibold">{error}</p>
          <button 
            onClick={fetchBoards}
            className="px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold rounded-lg text-xs self-start transition-all"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Boards Grid */}
      {boards.length === 0 && !error ? (
        <div className="border-2 border-dashed border-[#d1d5db] rounded-2xl p-12 flex flex-col items-center justify-center text-center bg-white min-h-[300px]">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl mb-4">
            <Kanban className="w-10 h-10 text-slate-400 stroke-[1.5]" />
          </div>
          <h3 className="text-lg font-bold text-[#111827]">No boards created yet</h3>
          <p className="mt-1 text-[#6b7280] max-w-xs text-xs">
            Create your first workspace to start organizing your columns, tagging priorities, and tracking milestones.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold text-xs transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Get Started
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {boards.map((board, index) => {
            const gradientClass = GRADIENTS[index % GRADIENTS.length];
            return (
              <div
                key={board.id}
                onClick={() => onSelectBoard(board.id)}
                className="group relative border border-[#e5e7eb] rounded-xl bg-white overflow-hidden card-transition card-hover cursor-pointer shadow-sm flex flex-col justify-between min-h-[220px]"
              >
                <div className={`h-2.5 bg-gradient-to-r ${gradientClass} w-full`}></div>

                <button
                  onClick={(e) => handleDeleteBoard(e, board.id)}
                  className="absolute top-6 right-4 p-1.5 rounded-lg bg-white/95 border border-[#e5e7eb] text-slate-400 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 shadow-sm"
                  title="Delete Board"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <div className="p-5 flex-1">
                  <h3 className="text-base font-bold text-[#111827] group-hover:text-[#4f46e5] transition-colors flex items-center gap-2 mb-2 pr-6">
                    {board.name}
                  </h3>
                  <p className="text-xs text-[#6b7280] line-clamp-3 leading-relaxed">
                    {board.description || 'No description provided for this work board.'}
                  </p>
                </div>

                <div className="px-5 py-4 border-t border-[#e5e7eb] flex items-center justify-between mt-auto bg-slate-50/50">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {board.members && board.members.slice(0, 4).map(member => (
                      <div 
                        key={member.id}
                        title={member.name}
                        className="w-5.5 h-5.5 rounded-full bg-[#4f46e5] border border-white flex items-center justify-center text-[9px] font-bold text-white uppercase"
                      >
                        {member.name.charAt(0)}
                      </div>
                    ))}
                    {board.members && board.members.length > 4 && (
                      <div className="w-5.5 h-5.5 rounded-full bg-slate-200 border border-white flex items-center justify-center text-[9px] font-bold text-slate-600">
                        +{board.members.length - 4}
                      </div>
                    )}
                    {(!board.members || board.members.length === 0) && (
                      <div className="w-5.5 h-5.5 rounded-full bg-slate-100 border border-[#e5e7eb] flex items-center justify-center text-[9px] text-slate-400 uppercase font-semibold">
                        N/A
                      </div>
                    )}
                  </div>

                  <span className="text-xs text-[#4f46e5] font-bold flex items-center gap-1 transition-all group-hover:translate-x-1">
                    Open
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}

          <div
            onClick={() => setShowCreateModal(true)}
            className="group min-h-[220px] rounded-xl border-2 border-dashed border-[#d1d5db] hover:border-[#4f46e5] hover:bg-indigo-50/10 cursor-pointer flex flex-col items-center justify-center transition-all duration-200 card-transition"
          >
            <div className="w-10 h-10 rounded-full border border-slate-200 bg-white group-hover:border-indigo-200 group-hover:bg-indigo-50 flex items-center justify-center mb-3 transition-colors shadow-sm">
              <Plus className="w-5 h-5 text-slate-400 group-hover:text-[#4f46e5] transition-colors" />
            </div>
            <span className="text-sm font-bold text-slate-600 group-hover:text-[#4f46e5] transition-colors">
              New Workspace
            </span>
          </div>

        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e5e7eb] rounded-2xl max-w-md w-full p-8 shadow-2xl animate-scale-in">
            <h2 className="text-lg font-bold text-[#111827] mb-6 flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-100">
                <Kanban className="w-5 h-5 text-[#4f46e5]" />
              </div>
              Create Board
            </h2>
            <form onSubmit={handleCreateBoard} className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b7280] mb-2">
                  Board Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stripe Billing, Linear Sprint"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-[#e5e7eb] focus:bg-white focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] outline-none text-[#111827] placeholder-slate-400 transition-all text-sm shadow-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b7280] mb-2">
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Outline the scope, goals, or schedule..."
                  value={newBoardDesc}
                  onChange={(e) => setNewBoardDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-[#e5e7eb] focus:bg-white focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] outline-none text-[#111827] placeholder-slate-400 transition-all text-sm resize-none shadow-sm"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e5e7eb]">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewBoardName('');
                    setNewBoardDesc('');
                  }}
                  className="px-4 py-2 rounded-lg border border-[#e5e7eb] hover:bg-slate-50 text-[#6b7280] text-sm font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#4f46e5] hover:bg-[#4338ca] text-white text-sm font-bold transition-all shadow-sm active:scale-95"
                >
                  Create Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feature Walkthrough Slideshow Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e5e7eb] rounded-3xl max-w-xl w-full p-8 shadow-2xl animate-scale-in relative overflow-hidden flex flex-col justify-between min-h-[420px]">
            {/* Background Glow */}
            <div className="absolute -right-20 -top-20 w-60 h-60 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            {/* Top row */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4f46e5] bg-indigo-50 border border-indigo-100/50 px-2.5 py-1 rounded-md">
                Product Tour
              </span>
              <button 
                onClick={() => setShowDemoModal(false)}
                className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-[#111827] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slide Body */}
            <div className="my-8 flex flex-col items-center text-center flex-1 justify-center">
              {/* Feature Icon */}
              {(() => {
                const SlideIcon = DEMO_SLIDES[currentSlide].icon;
                return (
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border shadow-sm ${DEMO_SLIDES[currentSlide].color}`}>
                    <SlideIcon className="w-7 h-7 stroke-[1.8]" />
                  </div>
                );
              })()}
              
              <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider mb-1">
                {DEMO_SLIDES[currentSlide].feature}
              </span>
              <h3 className="text-xl font-bold text-[#111827] mb-3">
                {DEMO_SLIDES[currentSlide].title}
              </h3>
              <p className="text-xs text-[#6b7280] max-w-sm leading-relaxed">
                {DEMO_SLIDES[currentSlide].description}
              </p>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
              {/* Indicator dots */}
              <div className="flex items-center gap-1.5">
                {DEMO_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx === currentSlide ? 'bg-[#4f46e5] w-5' : 'bg-slate-200'
                    }`}
                  ></button>
                ))}
              </div>

              {/* Slider Toggles */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-lg border border-[#e5e7eb] hover:bg-slate-50 text-[#6b7280] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {currentSlide === DEMO_SLIDES.length - 1 ? (
                  <button
                    onClick={() => setShowDemoModal(false)}
                    className="px-4 py-2 rounded-lg bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                  >
                    Finish Tour
                  </button>
                ) : (
                  <button
                    onClick={nextSlide}
                    className="px-4 py-2 rounded-lg bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1"
                  >
                    Next
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
