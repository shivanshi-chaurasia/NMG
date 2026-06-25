import React, { useState, useEffect } from 'react';
import api from '../api';
import { Kanban, Plus, Trash2, Users, ArrowRight } from 'lucide-react';

export default function BoardList({ onSelectBoard }) {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDesc, setNewBoardDesc] = useState('');

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

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-medium text-sm">Loading your workspace...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 flex-1 flex flex-col w-full animate-fade-in-scale">
      
      {/* Hero Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 md:p-12 mb-12 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-4">
            <Kanban className="w-3.5 h-3.5" />
            <span>ZenBoard Workspace</span>
          </div>
          <h1 className="text-3.5xl md:text-4.5xl font-extrabold tracking-tight text-slate-900 mb-3 leading-tight">
            Simplify your workflow, <br />
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 bg-clip-text text-transparent">amplify your team focus.</span>
          </h1>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-xl">
            Track milestones, plan sprints, and organize your files and tag labels. Work collaboratively with team members in a fast, elegant, and business-focused space.
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/15 active:scale-95 self-start md:self-center group relative z-10 shrink-0 text-sm"
        >
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
          Create New Board
        </button>
      </div>

      {error && (
        <div className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex flex-col gap-3">
          <p className="font-medium">{error}</p>
          <button 
            onClick={fetchBoards}
            className="px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold rounded-xl text-xs self-start transition-all"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Grid */}
      {boards.length === 0 && !error ? (
        <div className="flex-1 border border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center bg-white min-h-[350px] shadow-sm">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl mb-4">
            <Kanban className="w-12 h-12 text-slate-400 stroke-[1.5]" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No boards created yet</h3>
          <p className="mt-2 text-slate-500 max-w-sm text-sm">
            Create your first board to start organizing your lists, tags, and collaborative cards.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-650 border border-indigo-200/50 font-bold text-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Get Started
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <div
              key={board.id}
              onClick={() => onSelectBoard(board.id)}
              className="group relative border border-slate-200/80 hover:border-indigo-500/50 rounded-2xl p-6 bg-white transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 flex flex-col justify-between min-h-[200px]"
            >
              {/* Delete Button (floating) */}
              <button
                onClick={(e) => handleDeleteBoard(e, board.id)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-100/50 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                title="Delete Board"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors flex items-center gap-2 mb-2 pr-8">
                  {board.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">
                  {board.description || 'No description provided.'}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Users className="w-3.5 h-3.5 text-slate-450" />
                  <span>{board.members?.length || 0}</span>
                  <span>{board.members?.length === 1 ? 'member' : 'members'}</span>
                </div>
                <span className="text-xs text-indigo-600 group-hover:text-indigo-700 font-bold flex items-center gap-1 transition-all group-hover:translate-x-1">
                  Open Board
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-8 shadow-2xl animate-fade-in-scale">
            <h2 className="text-xl font-bold text-slate-950 mb-6 flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-100">
                <Kanban className="w-5 h-5 text-indigo-600" />
              </div>
              Create Board
            </h2>
            <form onSubmit={handleCreateBoard} className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Board Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Website Launch, Sprint Board"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-slate-800 placeholder-slate-400 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Outline the scope, goals, or schedule..."
                  value={newBoardDesc}
                  onChange={(e) => setNewBoardDesc(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-slate-800 placeholder-slate-400 transition-all text-sm resize-none"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewBoardName('');
                    setNewBoardDesc('');
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-all shadow-sm hover:shadow-md hover:shadow-indigo-500/10 active:scale-95"
                >
                  Create Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
