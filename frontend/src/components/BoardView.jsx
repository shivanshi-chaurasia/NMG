import React, { useState, useEffect } from 'react';
import api from '../api';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { 
  ArrowLeft, Plus, Trash2, Edit2, Check, X, 
  UserPlus, GripVertical, Calendar, Tag as TagIcon, Users, Clock 
} from 'lucide-react';
import CardModal from './CardModal';

// Helper to determine colored left border based on tag priorities
const getPriorityStyle = (card) => {
  if (!card.tags || card.tags.length === 0) return {};
  
  // Look for priority-like tags first
  const highPriority = card.tags.find(t => 
    ['high', 'urgent', 'critical', 'bug'].some(k => t.name.toLowerCase().includes(k))
  );
  if (highPriority) return { borderLeft: `4px solid ${highPriority.color || '#f43f5e'}` };
  
  const medPriority = card.tags.find(t => 
    ['medium', 'important', 'warning', 'refactor', 'design'].some(k => t.name.toLowerCase().includes(k))
  );
  if (medPriority) return { borderLeft: `4px solid ${medPriority.color || '#f59e0b'}` };
  
  const lowPriority = card.tags.find(t => 
    ['low', 'feature', 'docs', 'minor', 'info'].some(k => t.name.toLowerCase().includes(k))
  );
  if (lowPriority) return { borderLeft: `4px solid ${lowPriority.color || '#10b981'}` };
  
  // Fallback to the first tag's color
  return { borderLeft: `4px solid ${card.tags[0].color || '#6366f1'}` };
};

// Droppable List wrapper
function DroppableListContainer({ listId, children }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `list-${listId}`,
  });

  return (
    <div 
      ref={setNodeRef} 
      className={`flex-1 flex flex-col gap-3 min-h-[300px] rounded-xl p-1.5 transition-all duration-200 ${
        isOver ? 'bg-indigo-50/50 border border-dashed border-indigo-300' : 'bg-transparent border border-dashed border-transparent'
      }`}
    >
      {children}
    </div>
  );
}

// Draggable Card item
function DraggableCardItem({ card, onClick }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `card-${card.id}`,
    data: { card },
  });

  const style = {
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    opacity: isDragging ? 0.35 : 1,
    zIndex: isDragging ? 50 : 1,
    ...getPriorityStyle(card)
  };

  // Determine if card is overdue
  const isOverdue = () => {
    if (!card.due_date) return false;
    const due = new Date(card.due_date);
    const now = new Date();
    due.setHours(0,0,0,0);
    now.setHours(0,0,0,0);
    return due < now;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative border border-slate-200/80 bg-white rounded-xl p-4 transition-all duration-200 hover:border-indigo-400 hover:shadow-md cursor-pointer flex flex-col gap-3 select-none hover:-translate-y-0.5"
      onClick={() => onClick(card)}
    >
      {/* Top row: tags and drag handle */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1">
          {card.tags && card.tags.map(tag => (
            <span 
              key={tag.id} 
              className="text-[9px] font-bold px-2 py-0.5 rounded-full border tracking-wide"
              style={{ 
                backgroundColor: `${tag.color}08`, 
                borderColor: `${tag.color}25`, 
                color: tag.color 
              }}
            >
              {tag.name}
            </span>
          ))}
        </div>
        
        {/* Drag handle */}
        <div 
          {...listeners} 
          {...attributes} 
          onClick={(e) => e.stopPropagation()} // Stop modal from triggering when grabbing handle
          className="text-slate-400 hover:text-slate-700 hover:bg-slate-50 p-1 rounded cursor-grab active:cursor-grabbing transition-colors"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Card Title */}
      <h4 className="font-semibold text-slate-800 text-sm leading-snug group-hover:text-indigo-650 transition-colors">
        {card.title}
      </h4>

      {/* Card Description Snippet */}
      {card.description && (
        <p className="text-xs text-slate-555 line-clamp-2 leading-relaxed">
          {card.description}
        </p>
      )}

      {/* Footer row: due date and members */}
      {(card.due_date || (card.members && card.members.length > 0)) && (
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1 text-xs">
          {/* Due date */}
          {card.due_date ? (
            <div 
              className={`flex items-center gap-1 font-semibold ${
                isOverdue() 
                  ? 'text-rose-650 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-lg' 
                  : 'text-slate-500 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-lg'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>{formatDate(card.due_date)}</span>
            </div>
          ) : <div />}

          {/* Members list */}
          <div className="flex -space-x-1.5 overflow-hidden">
            {card.members && card.members.map(member => (
              <div 
                key={member.id}
                title={member.name}
                className="w-5.5 h-5.5 rounded-full bg-indigo-500 border border-white flex items-center justify-center text-[9px] font-bold text-white uppercase shadow-sm"
              >
                {member.name.charAt(0)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BoardView({ boardId, onBack }) {
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // List management states
  const [editingListId, setEditingListId] = useState(null);
  const [editingListName, setEditingListName] = useState('');
  const [showAddList, setShowAddList] = useState(false);
  const [newListName, setNewListName] = useState('');

  // Card creation states
  const [addingCardListId, setAddingCardListId] = useState(null);
  const [newCardTitle, setNewCardTitle] = useState('');

  // Member management states
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');

  // Modal card state
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    fetchBoardDetails();
  }, [boardId]);

  const fetchBoardDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/boards/${boardId}`);
      setBoard(response.data);
      // Ensure lists are ordered by position
      const sortedLists = (response.data.lists || []).sort((a, b) => a.position - b.position);
      setLists(sortedLists);
    } catch (err) {
      console.error('Error fetching board details:', err);
      alert('Failed to load board details.');
      onBack();
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    try {
      const response = await api.post(`/boards/${boardId}/lists`, {
        name: newListName,
      });
      setLists([...lists, { ...response.data, cards: [] }]);
      setNewListName('');
      setShowAddList(false);
    } catch (err) {
      console.error('Error creating list:', err);
    }
  };

  const handleUpdateListTitle = async (id) => {
    if (!editingListName.trim()) {
      setEditingListId(null);
      return;
    }

    try {
      await api.put(`/lists/${id}`, {
        name: editingListName,
      });
      setLists(lists.map(l => l.id === id ? { ...l, name: editingListName } : l));
      setEditingListId(null);
    } catch (err) {
      console.error('Error updating list:', err);
    }
  };

  const handleDeleteList = async (id) => {
    if (!window.confirm('Delete this list and all its cards?')) return;

    try {
      await api.delete(`/lists/${id}`);
      setLists(lists.filter(l => l.id !== id));
    } catch (err) {
      console.error('Error deleting list:', err);
    }
  };

  const handleCreateCard = async (e, listId) => {
    e.preventDefault();
    if (!newCardTitle.trim()) return;

    try {
      const response = await api.post(`/lists/${listId}/cards`, {
        title: newCardTitle,
      });
      
      setLists(lists.map(l => {
        if (l.id === listId) {
          return {
            ...l,
            cards: [...(l.cards || []), response.data].sort((a, b) => a.position - b.position),
          };
        }
        return l;
      }));

      setNewCardTitle('');
      setAddingCardListId(null);
    } catch (err) {
      console.error('Error creating card:', err);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) return;

    try {
      const response = await api.post(`/boards/${boardId}/members`, {
        name: newMemberName,
        email: newMemberEmail,
      });

      // Update board members
      setBoard({
        ...board,
        members: [...(board.members || []), response.data],
      });

      setNewMemberName('');
      setNewMemberEmail('');
      setShowAddMember(false);
    } catch (err) {
      console.error('Error adding member:', err);
      alert('Failed to add member to board.');
    }
  };

  // Drag and Drop End handler
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const draggedCardId = active.id.replace('card-', '');
    let targetListId = null;
    let targetPosition = 0;

    // Case 1: Dropped over list container
    if (over.id.startsWith('list-')) {
      targetListId = over.id.replace('list-', '');
      const targetList = lists.find(l => l.id == targetListId);
      targetPosition = targetList ? (targetList.cards?.length || 0) : 0;
    } 
    // Case 2: Dropped over another card
    else if (over.id.startsWith('card-')) {
      const targetCardId = over.id.replace('card-', '');
      
      for (const list of lists) {
        const idx = list.cards?.findIndex(c => c.id == targetCardId);
        if (idx !== undefined && idx !== -1) {
          targetListId = list.id;
          targetPosition = idx;
          break;
        }
      }
    }

    if (targetListId) {
      // Find list and verify if card actually moved
      const sourceList = lists.find(l => l.cards?.some(c => c.id == draggedCardId));
      const targetList = lists.find(l => l.id == targetListId);
      
      // If same list and same position, do nothing
      if (sourceList && sourceList.id == targetListId) {
        const oldIndex = sourceList.cards.findIndex(c => c.id == draggedCardId);
        if (oldIndex === targetPosition) return;
      }

      // Snappy Optimistic UI Update
      setLists(prevLists => {
        let cardToMove = null;
        
        // Remove from old list
        const updatedLists = prevLists.map(list => {
          const card = list.cards?.find(c => c.id == draggedCardId);
          if (card) {
            cardToMove = card;
            return {
              ...list,
              cards: list.cards.filter(c => c.id != draggedCardId)
            };
          }
          return list;
        });

        if (!cardToMove) return prevLists;

        // Insert into new list
        return updatedLists.map(list => {
          if (list.id == targetListId) {
            const cards = [...(list.cards || [])];
            cards.splice(targetPosition, 0, {
              ...cardToMove,
              list_id: parseInt(targetListId)
            });
            return {
              ...list,
              cards: cards.map((c, i) => ({ ...c, position: i + 1 }))
            };
          }
          return list;
        });
      });

      // Background API request
      try {
        await api.patch(`/cards/${draggedCardId}/move`, {
          list_id: targetListId,
          position: targetPosition,
        });
        
        // Refetch to sync any deep relationships and correct sequencing
        const response = await api.get(`/boards/${boardId}`);
        const sortedLists = (response.data.lists || []).sort((a, b) => a.position - b.position);
        setLists(sortedLists);
      } catch (err) {
        console.error('Error saving card move:', err);
        fetchBoardDetails(); // Revert on failure
      }
    }
  };

  if (loading || !board) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-medium text-sm">Loading board details...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full animate-fade-in-scale">
      {/* Board Header */}
      <div className="border-b border-slate-200/85 bg-white px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-4">
          <button 
            onClick={onBack}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-all duration-200 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              {board.name}
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-xl">
              {board.description || 'No description provided.'}
            </p>
          </div>
        </div>

        {/* Member Action / Section */}
        <div className="flex items-center gap-4 self-end md:self-auto">
          {/* List of members preview */}
          <div className="flex items-center -space-x-2">
            {board.members && board.members.slice(0, 5).map(member => (
              <div 
                key={member.id}
                title={`${member.name} (${member.email})`}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-indigo-600 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600 hover:text-white uppercase transition-all duration-150 shadow-sm"
              >
                {member.name.charAt(0)}
              </div>
            ))}
            {board.members && board.members.length > 5 && (
              <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm">
                +{board.members.length - 5}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowAddMember(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs transition-all shadow-sm active:scale-95"
          >
            <UserPlus className="w-4 h-4 text-slate-550" />
            Add Member
          </button>
        </div>
      </div>

      {/* Drag & Drop Board Columns Wrapper */}
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex-1 overflow-x-auto flex items-start gap-5 p-6 min-h-0 bg-slate-50/50">
          
          {/* Lists loop */}
          {lists.map(list => (
            <div 
              key={list.id} 
              className="w-[290px] max-h-full flex-shrink-0 bg-[#f1f5f9]/75 border border-slate-200/50 rounded-2xl flex flex-col p-4 shadow-sm"
            >
              {/* List Header */}
              <div className="flex items-center justify-between mb-4 group/list-head">
                {editingListId === list.id ? (
                  <div className="flex items-center gap-1 flex-1">
                    <input
                      type="text"
                      value={editingListName}
                      onChange={(e) => setEditingListName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleUpdateListTitle(list.id)}
                      className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm font-semibold text-slate-800 outline-none w-full focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      autoFocus
                    />
                    <button 
                      onClick={() => handleUpdateListTitle(list.id)}
                      className="p-1 text-emerald-600 hover:bg-slate-200/80 rounded"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setEditingListId(null)}
                      className="p-1 text-slate-500 hover:bg-slate-200/80 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <h3 
                        onDoubleClick={() => {
                          setEditingListId(list.id);
                          setEditingListName(list.name);
                        }}
                        className="font-bold text-slate-800 text-sm cursor-pointer select-none hover:text-indigo-600 transition-colors truncate"
                      >
                        {list.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-slate-200/60 text-slate-500 text-[10px] font-bold">
                        {list.cards?.length || 0}
                      </span>
                    </div>
                    <div className="flex items-center opacity-0 group-hover/list-head:opacity-100 transition-opacity ml-2">
                      <button
                        onClick={() => {
                          setEditingListId(list.id);
                          setEditingListName(list.name);
                        }}
                        className="p-1 hover:bg-slate-200/80 rounded text-slate-400 hover:text-slate-700 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteList(list.id)}
                        className="p-1 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* List Cards Droppable Zone */}
              <div className="overflow-y-auto flex-1 mb-2 pr-0.5 scrollbar-thin">
                <DroppableListContainer listId={list.id}>
                  {list.cards && list.cards.map(card => (
                    <DraggableCardItem 
                      key={card.id} 
                      card={card} 
                      onClick={setSelectedCard} 
                    />
                  ))}
                </DroppableListContainer>
              </div>

              {/* List Footer / Add Card */}
              {addingCardListId === list.id ? (
                <form onSubmit={(e) => handleCreateCard(e, list.id)} className="mt-2 space-y-2">
                  <textarea
                    rows="2"
                    placeholder="Enter a title for this card..."
                    required
                    value={newCardTitle}
                    onChange={(e) => setNewCardTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleCreateCard(e, list.id);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-xs text-slate-800 placeholder-slate-400 transition-all resize-none shadow-sm"
                    autoFocus
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-indigo-650 hover:bg-indigo-750 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                    >
                      Add Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddingCardListId(null)}
                      className="p-1.5 text-slate-550 hover:bg-slate-200/80 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => {
                    setAddingCardListId(list.id);
                    setNewCardTitle('');
                  }}
                  className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-dashed border-slate-300 hover:border-indigo-500/40 hover:bg-indigo-50/30 text-slate-500 hover:text-indigo-650 text-xs font-semibold transition-all duration-200 bg-white/40 hover:shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Task Card
                </button>
              )}
            </div>
          ))}

          {/* Add List Column */}
          {showAddList ? (
            <div className="w-[290px] flex-shrink-0 bg-white border border-slate-200 rounded-2xl p-4 flex flex-col shadow-sm">
              <form onSubmit={handleCreateList} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Enter list title..."
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 outline-none text-sm text-slate-800 placeholder-slate-400 transition-all"
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-605 hover:bg-indigo-705 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    Save List
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddList(false)}
                    className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <button
              onClick={() => {
                setShowAddList(true);
                setNewListName('');
              }}
              className="w-[290px] flex-shrink-0 flex items-center justify-center gap-2 py-4 rounded-2xl border border-dashed border-slate-300 hover:border-indigo-550/40 hover:bg-indigo-50/15 text-slate-500 hover:text-indigo-650 font-bold text-sm transition-all duration-300 h-16 self-start bg-white/40 hover:shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Column List
            </button>
          )}

        </div>
      </DndContext>

      {/* Add Board Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-8 shadow-2xl animate-fade-in-scale">
            <h2 className="text-xl font-bold text-slate-950 mb-6 flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-100">
                <UserPlus className="w-5 h-5 text-indigo-600" />
              </div>
              Invite Member
            </h2>
            <form onSubmit={handleAddMember} className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-slate-800 placeholder-slate-450 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. john@example.com"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-slate-800 placeholder-slate-450 transition-all text-sm"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddMember(false);
                    setNewMemberName('');
                    setNewMemberEmail('');
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-650 text-sm font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-all shadow-sm active:scale-95"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Card Details Modal */}
      {selectedCard && (
        <CardModal 
          card={selectedCard}
          boardMembers={board.members || []}
          onClose={() => {
            setSelectedCard(null);
            fetchBoardDetails(); // Refresh list to get updated card state
          }}
        />
      )}
    </div>
  );
}
