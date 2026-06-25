import React, { useState, useEffect } from 'react';
import api from '../api';
import { 
  X, Calendar, Tag as TagIcon, Users, Trash2, 
  FileText, Clock, AlertCircle, Plus, Check, ArrowRight, Activity
} from 'lucide-react';

const PRESETS = [
  { name: 'Bug', color: '#ef4444' },      // Red
  { name: 'Feature', color: '#10b981' },  // Green
  { name: 'Design', color: '#8b5cf6' },   // Purple
  { name: 'Urgent', color: '#f59e0b' },   // Orange
  { name: 'Review', color: '#3b82f6' },   // Blue
];

export default function CardModal({ card, boardMembers, onClose }) {
  const [title, setTitle] = useState(card.title || '');
  const [description, setDescription] = useState(card.description || '');
  const [dueDate, setDueDate] = useState(
    card.due_date ? new Date(card.due_date).toISOString().split('T')[0] : ''
  );
  
  const [tags, setTags] = useState(card.tags || []);
  const [members, setMembers] = useState(card.members || []);
  const [lists, setLists] = useState([]);
  const [activeListId, setActiveListId] = useState(card.list_id || '');

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);

  // New tag custom creation states
  const [showAddTag, setShowAddTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#10b981'); // Default green

  useEffect(() => {
    fetchBoardLists();
  }, []);

  const fetchBoardLists = async () => {
    try {
      // Find parent board lists to populate the "Move to" dropdown
      const boardsRes = await api.get('/boards');
      for (const b of boardsRes.data) {
        const boardDetailRes = await api.get(`/boards/${b.id}`);
        const boardLists = boardDetailRes.data.lists || [];
        if (boardLists.some(l => l.id == card.list_id)) {
          setLists(boardLists);
          break;
        }
      }
    } catch (err) {
      console.error('Error fetching board lists:', err);
    }
  };

  const handleUpdateField = async (field, value) => {
    try {
      const payload = {
        [field]: value
      };
      
      const response = await api.put(`/cards/${card.id}`, payload);
      
      if (field === 'title') setTitle(response.data.title);
      if (field === 'description') setDescription(response.data.description);
      if (field === 'due_date') {
        setDueDate(
          response.data.due_date ? new Date(response.data.due_date).toISOString().split('T')[0] : ''
        );
      }
    } catch (err) {
      console.error(`Error updating card ${field}:`, err);
    }
  };

  const handleDeleteCard = async () => {
    if (!window.confirm('Are you sure you want to delete this card?')) return;

    try {
      await api.delete(`/cards/${card.id}`);
      onClose();
    } catch (err) {
      console.error('Error deleting card:', err);
    }
  };

  const handleAddTag = async (tagName, tagColor) => {
    if (!tagName.trim()) return;

    try {
      const response = await api.post(`/cards/${card.id}/tags`, {
        name: tagName,
        color: tagColor,
      });
      setTags(response.data.tags);
      setNewTagName('');
      setShowAddTag(false);
    } catch (err) {
      console.error('Error adding tag:', err);
    }
  };

  const handleRemoveTag = async (tagId) => {
    try {
      const response = await api.delete(`/cards/${card.id}/tags/${tagId}`);
      setTags(response.data.tags);
    } catch (err) {
      console.error('Error detaching tag:', err);
    }
  };

  const handleToggleMember = async (memberId) => {
    const isAssigned = members.some(m => m.id === memberId);
    const action = isAssigned ? 'unassign' : 'assign';

    try {
      const response = await api.post(`/cards/${card.id}/assign`, {
        member_id: memberId,
        action: action
      });
      setMembers(response.data.members);
    } catch (err) {
      console.error('Error assigning member:', err);
    }
  };

  const handleMoveList = async (listId) => {
    try {
      await api.patch(`/cards/${card.id}/move`, {
        list_id: listId,
        position: 0,
      });
      setActiveListId(listId);
    } catch (err) {
      console.error('Error moving card:', err);
    }
  };

  // Get active priority based on tag names
  const getActivePriority = () => {
    if (tags.some(t => ['high', 'urgent', 'critical', 'bug'].some(k => t.name.toLowerCase().includes(k)))) return 'High';
    if (tags.some(t => ['medium', 'important', 'warning', 'refactor'].some(k => t.name.toLowerCase().includes(k)))) return 'Medium';
    if (tags.some(t => ['low', 'minor', 'info', 'docs', 'feature'].some(k => t.name.toLowerCase().includes(k)))) return 'Low';
    return 'None';
  };

  const handleSetPriority = async (level) => {
    // Remove existing priority tags first
    const priorityKeywords = ['high', 'urgent', 'medium', 'important', 'low', 'minor', 'priority'];
    const tagsToRemove = tags.filter(t => priorityKeywords.some(k => t.name.toLowerCase().includes(k)));
    
    let currentTags = [...tags];
    for (const tag of tagsToRemove) {
      try {
        await api.delete(`/cards/${card.id}/tags/${tag.id}`);
        currentTags = currentTags.filter(t => t.id !== tag.id);
      } catch (err) {
        console.error('Error removing tag:', err);
      }
    }

    let newTag = null;
    if (level === 'High') newTag = { name: 'High Priority', color: '#ef4444' };
    if (level === 'Medium') newTag = { name: 'Medium Priority', color: '#f59e0b' };
    if (level === 'Low') newTag = { name: 'Low Priority', color: '#10b981' };

    if (newTag) {
      try {
        const response = await api.post(`/cards/${card.id}/tags`, newTag);
        setTags(response.data.tags);
      } catch (err) {
        console.error('Error adding priority tag:', err);
      }
    } else {
      setTags(currentTags);
    }
  };

  const isOverdue = () => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const now = new Date();
    due.setHours(0,0,0,0);
    now.setHours(0,0,0,0);
    return due < now;
  };

  const activePriority = getActivePriority();

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#e5e7eb] rounded-2xl max-w-2xl w-full p-8 shadow-2xl animate-scale-in flex flex-col max-h-[90vh]">
        
        {/* Header: Title inline editable + close */}
        <div className="flex items-start justify-between border-b border-[#e5e7eb] pb-4 mb-6">
          <div className="flex-1 mr-4">
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => {
                    setIsEditingTitle(false);
                    handleUpdateField('title', title);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setIsEditingTitle(false);
                      handleUpdateField('title', title);
                    }
                  }}
                  className="bg-slate-50 border border-[#e5e7eb] rounded-lg px-3 py-2 text-lg font-bold text-[#111827] outline-none w-full focus:bg-white focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]"
                  autoFocus
                />
                <button 
                  onClick={() => {
                    setIsEditingTitle(false);
                    handleUpdateField('title', title);
                  }}
                  className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-emerald-600 transition-colors shadow-sm"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <h2 
                onClick={() => setIsEditingTitle(true)}
                className="text-xl font-bold text-[#111827] hover:text-[#4f46e5] cursor-pointer transition-colors"
                title="Click to edit title"
              >
                {title}
              </h2>
            )}
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-50 rounded-lg text-[#6b7280] hover:text-[#111827] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Two Column Layout Body */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-thin">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            
            {/* Left Column (60%): Description, Tags, Activity log (fake) */}
            <div className="md:col-span-3 space-y-6">
              
              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6b7280] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#4f46e5]" />
                  Description
                </h4>
                {isEditingDesc ? (
                  <div className="space-y-3">
                    <textarea
                      rows="4"
                      placeholder="Add a detailed description for this task card..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-[#e5e7eb] focus:bg-white focus:border-[#4f46e5] outline-none text-xs text-[#111827] placeholder-slate-400 transition-all resize-none shadow-sm"
                      autoFocus
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setIsEditingDesc(false);
                          handleUpdateField('description', description);
                        }}
                        className="px-4 py-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-md text-xs font-bold transition-all shadow-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditingDesc(false)}
                        className="px-4 py-2 border border-[#e5e7eb] hover:bg-slate-50 text-[#6b7280] rounded-md text-xs font-semibold transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => setIsEditingDesc(true)}
                    className="bg-white hover:bg-slate-50/50 border border-[#e5e7eb] p-4 rounded-xl cursor-pointer min-h-[100px] text-xs text-[#6b7280] leading-relaxed transition-all shadow-sm"
                    title="Click to edit description"
                  >
                    {description ? description : <span className="text-slate-400 italic">No description added yet. Click to write details.</span>}
                  </div>
                )}
              </div>

              {/* Tags Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6b7280] flex items-center gap-2">
                  <TagIcon className="w-4 h-4 text-[#4f46e5]" />
                  Tags & Labels
                </h4>
                <div className="flex flex-wrap gap-2 items-center">
                  {tags.map(tag => (
                    <span 
                      key={tag.id}
                      className="text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 shadow-sm"
                      style={{ 
                        backgroundColor: `${tag.color}08`, 
                        borderColor: `${tag.color}25`, 
                        color: tag.color 
                      }}
                    >
                      {tag.name}
                      <button 
                        onClick={() => handleRemoveTag(tag.id)}
                        className="hover:bg-slate-100 p-0.5 rounded-full text-slate-450 hover:text-slate-700 transition-colors"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                  
                  <button
                    onClick={() => setShowAddTag(!showAddTag)}
                    className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border border-dashed border-[#d1d5db] hover:border-[#4f46e5] hover:bg-indigo-50/20 text-[#6b7280] hover:text-[#4f46e5] transition-all bg-white hover:shadow-sm"
                  >
                    <Plus className="w-3 h-3" />
                    New Tag
                  </button>
                </div>

                {/* Create Tag Drawer */}
                {showAddTag && (
                  <div className="bg-slate-50 border border-[#e5e7eb] p-4 rounded-xl space-y-4 shadow-sm animate-scale-in">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        placeholder="Tag name (e.g. Bug, Urgent)"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg bg-white border border-[#e5e7eb] focus:border-[#4f46e5] outline-none text-xs text-[#111827] shadow-sm"
                      />
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-[#6b7280] font-medium">Color:</label>
                        <input
                          type="color"
                          value={newTagColor}
                          onChange={(e) => setNewTagColor(e.target.value)}
                          className="w-8 h-8 rounded border border-[#e5e7eb] bg-transparent cursor-pointer"
                        />
                      </div>
                    </div>
                    
                    {/* Presets (Exactly as requested) */}
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Presets:</span>
                      {PRESETS.map((preset, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleAddTag(preset.name, preset.color)}
                          className="text-[10px] font-bold px-2.5 py-1 rounded-md border hover:scale-105 transition-transform"
                          style={{ 
                            backgroundColor: `${preset.color}08`, 
                            borderColor: `${preset.color}25`, 
                            color: preset.color 
                          }}
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-[#e5e7eb]">
                      <button
                        onClick={() => setShowAddTag(false)}
                        className="px-3 py-1.5 rounded-md border border-[#e5e7eb] text-[#6b7280] text-xs hover:bg-slate-100 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleAddTag(newTagName, newTagColor)}
                        className="px-3 py-1.5 rounded-md bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-bold transition-colors shadow-sm"
                      >
                        Save Preset
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Activity Log (Fake, Stripe/Linear look) */}
              <div className="space-y-3 pt-4 border-t border-[#e5e7eb]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6b7280] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#4f46e5]" />
                  Activity History
                </h4>
                
                <div className="space-y-3 pl-2">
                  <div className="flex items-start gap-3 text-xs text-[#6b7280]">
                    <div className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[9px] font-bold text-[#4f46e5] mt-0.5">
                      SC
                    </div>
                    <div>
                      <span className="font-semibold text-[#111827]">Shivanshi</span> updated the card description.
                      <div className="text-[10px] text-slate-400 mt-0.5">2 hours ago</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs text-[#6b7280]">
                    <div className="w-5 h-5 rounded-full bg-slate-150 border border-[#e5e7eb] flex items-center justify-center text-[9px] font-bold text-[#6b7280] mt-0.5">
                      SC
                    </div>
                    <div>
                      <span className="font-semibold text-[#111827]">Shivanshi</span> added a tag label.
                      <div className="text-[10px] text-slate-400 mt-0.5">1 day ago</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs text-[#6b7280]">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[9px] font-bold text-emerald-600 mt-0.5">
                      +
                    </div>
                    <div>
                      Task card created in this workspace.
                      <div className="text-[10px] text-slate-400 mt-0.5">2 days ago</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column (40%): Controls & Actions */}
            <div className="md:col-span-2 space-y-6 md:border-l md:border-[#e5e7eb] md:pl-6">
              
              {/* Priority Selector Dots */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6b7280]">Priority</h4>
                <div className="flex items-center gap-2">
                  {[
                    { label: 'Low', color: 'bg-[#10b981]' },
                    { label: 'Medium', color: 'bg-[#f59e0b]' },
                    { label: 'High', color: 'bg-[#ef4444]' }
                  ].map(p => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => handleSetPriority(p.label)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                        activePriority === p.label 
                          ? 'border-[#4f46e5] bg-indigo-50/40 text-[#4f46e5] shadow-sm' 
                          : 'border-[#e5e7eb] bg-white hover:bg-slate-50 text-[#6b7280]'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${p.color}`}></span>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Due Date Picker */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6b7280] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Due Date
                </h4>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => {
                    setDueDate(e.target.value);
                    handleUpdateField('due_date', e.target.value);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-[#e5e7eb] focus:bg-white focus:border-[#4f46e5] outline-none text-xs text-[#111827] cursor-pointer shadow-sm"
                />
                {dueDate && isOverdue() && (
                  <div className="flex items-center gap-1.5 text-xs text-rose-700 font-bold bg-rose-50 border border-rose-100 p-2 rounded-lg mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Overdue Task!</span>
                  </div>
                )}
              </div>

              {/* Assignee Section */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6b7280] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  Assignee
                </h4>
                <div className="max-h-[140px] overflow-y-auto space-y-1 p-2 border border-[#e5e7eb] rounded-xl bg-slate-50/30 scrollbar-thin">
                  {boardMembers.length === 0 ? (
                    <p className="text-slate-400 text-[10px] italic p-1">No members added yet.</p>
                  ) : (
                    boardMembers.map(member => {
                      const isAssigned = members.some(m => m.id === member.id);
                      return (
                        <div 
                          key={member.id}
                          onClick={() => handleToggleMember(member.id)}
                          className={`flex items-center justify-between p-2 rounded-lg border text-xs font-semibold cursor-pointer transition-all duration-150 select-none ${
                            isAssigned 
                              ? 'bg-indigo-50 border-indigo-200/50 text-[#4f46e5] shadow-sm' 
                              : 'bg-white border-[#e5e7eb] hover:bg-slate-50 text-[#6b7280]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-700 uppercase">
                              {member.name.charAt(0)}
                            </div>
                            <span className="truncate max-w-[100px]">{member.name}</span>
                          </div>
                          {isAssigned && <Check className="w-3 h-3 text-[#4f46e5]" />}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Move to Dropdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6b7280] flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5" />
                  Move to Column
                </h4>
                <select
                  value={activeListId}
                  onChange={(e) => handleMoveList(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-[#e5e7eb] focus:bg-white focus:border-[#4f46e5] outline-none text-xs text-[#111827] cursor-pointer shadow-sm"
                >
                  <option value="" disabled>Select column list...</option>
                  {lists.map(list => (
                    <option key={list.id} value={list.id}>
                      {list.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Delete Button (red, outlined) */}
              <div className="pt-4 border-t border-[#e5e7eb]">
                <button
                  onClick={handleDeleteCard}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#ef4444] hover:bg-rose-50 text-[#ef4444] font-bold text-xs transition-all active:scale-[0.98] shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Card
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
