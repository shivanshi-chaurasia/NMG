import React, { useState, useEffect } from 'react';
import api from '../api';
import { 
  X, Calendar, Tag as TagIcon, Users, Trash2, 
  FileText, Clock, AlertCircle, Plus, Check 
} from 'lucide-react';

const PRESETS = [
  { name: 'Bug', color: '#e11d48' },      // Rose 600
  { name: 'Feature', color: '#059669' },  // Emerald 600
  { name: 'Design', color: '#d97706' },   // Amber 600
  { name: 'Refactor', color: '#7c3aed' }, // Violet 600
  { name: 'Docs', color: '#0284c7' },     // Sky 600
];

export default function CardModal({ card, boardMembers, onClose }) {
  const [title, setTitle] = useState(card.title || '');
  const [description, setDescription] = useState(card.description || '');
  const [dueDate, setDueDate] = useState(
    card.due_date ? new Date(card.due_date).toISOString().split('T')[0] : ''
  );
  
  const [tags, setTags] = useState(card.tags || []);
  const [members, setMembers] = useState(card.members || []);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);

  // New tag custom creation states
  const [showAddTag, setShowAddTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#059669'); // Default emerald

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

  const isOverdue = () => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const now = new Date();
    due.setHours(0,0,0,0);
    now.setHours(0,0,0,0);
    return due < now;
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-8 shadow-2xl animate-fade-in-scale flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-6">
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
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xl font-bold text-slate-800 outline-none w-full focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  autoFocus
                />
                <button 
                  onClick={() => {
                    setIsEditingTitle(false);
                    handleUpdateField('title', title);
                  }}
                  className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-emerald-600 transition-colors shadow-sm"
                >
                  <Check className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <h2 
                onClick={() => setIsEditingTitle(true)}
                className="text-2xl font-extrabold text-slate-900 hover:text-indigo-650 cursor-pointer transition-colors"
                title="Double click to edit title"
              >
                {title}
              </h2>
            )}
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Scroll Container */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-thin">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Column - Details */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  Description
                </h4>
                {isEditingDesc ? (
                  <div className="space-y-3">
                    <textarea
                      rows="4"
                      placeholder="Add a detailed description for this task card..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 outline-none text-sm text-slate-800 placeholder-slate-400 transition-all resize-none shadow-sm"
                      autoFocus
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setIsEditingDesc(false);
                          handleUpdateField('description', description);
                        }}
                        className="px-4 py-2 bg-indigo-605 hover:bg-indigo-705 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditingDesc(false)}
                        className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-semibold transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => setIsEditingDesc(true)}
                    className="bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 p-4 rounded-2xl cursor-pointer min-h-[100px] text-sm text-slate-700 leading-relaxed transition-all shadow-sm"
                    title="Click to edit description"
                  >
                    {description ? description : <span className="text-slate-400 italic">No description added yet. Click to write details.</span>}
                  </div>
                )}
              </div>

              {/* Tags Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <TagIcon className="w-4 h-4 text-indigo-500" />
                  Tags / Labels
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
                    className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border border-dashed border-slate-300 hover:border-indigo-500/40 hover:bg-indigo-50/20 text-slate-500 hover:text-indigo-650 transition-all bg-white hover:shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New Tag
                  </button>
                </div>

                {/* Create Tag Drawer */}
                {showAddTag && (
                  <div className="bg-slate-50/50 border border-slate-200 p-4 rounded-2xl space-y-4 shadow-sm">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        placeholder="Tag name (e.g. Bug, Urgent)"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 focus:border-indigo-500 outline-none text-xs text-slate-800 shadow-sm"
                      />
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-slate-500 font-medium">Color:</label>
                        <input
                          type="color"
                          value={newTagColor}
                          onChange={(e) => setNewTagColor(e.target.value)}
                          className="w-8 h-8 rounded border border-slate-200 bg-transparent cursor-pointer"
                        />
                      </div>
                    </div>
                    
                    {/* Presets */}
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Presets:</span>
                      {PRESETS.map((preset, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleAddTag(preset.name, preset.color)}
                          className="text-[10px] font-bold px-2 py-1 rounded-lg border hover:scale-105 transition-transform"
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

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-200/60">
                      <button
                        onClick={() => setShowAddTag(false)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-xs hover:bg-slate-100 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleAddTag(newTagName, newTagColor)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-sm"
                      >
                        Save Custom
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Controls & Actions */}
            <div className="space-y-6 md:border-l md:border-slate-100 md:pl-6">
              
              {/* Due Date */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  Due Date
                </h4>
                <div className="relative">
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => {
                      setDueDate(e.target.value);
                      handleUpdateField('due_date', e.target.value);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 outline-none text-xs text-slate-800 cursor-pointer shadow-sm"
                  />
                </div>
                {dueDate && isOverdue() && (
                  <div className="flex items-center gap-1.5 text-xs text-rose-700 font-bold bg-rose-50 border border-rose-100 p-2.5 rounded-xl mt-1 shadow-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>Overdue Task!</span>
                  </div>
                )}
              </div>

              {/* Members Assign */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-500" />
                  Assign Members
                </h4>
                <div className="max-h-[160px] overflow-y-auto space-y-1.5 border border-slate-200/80 p-3 rounded-2xl bg-slate-50/50 scrollbar-thin">
                  {boardMembers.length === 0 ? (
                    <p className="text-slate-400 text-xs italic p-1">No board members yet. Invite them in the board view.</p>
                  ) : (
                    boardMembers.map(member => {
                      const isAssigned = members.some(m => m.id === member.id);
                      return (
                        <div 
                          key={member.id}
                          onClick={() => handleToggleMember(member.id)}
                          className={`flex items-center justify-between p-2 rounded-xl border text-xs font-medium cursor-pointer transition-all duration-200 select-none ${
                            isAssigned 
                              ? 'bg-indigo-50 border-indigo-200/50 text-indigo-750 shadow-sm' 
                              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 shadow-sm'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-5.5 h-5.5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-700 uppercase">
                              {member.name.charAt(0)}
                            </div>
                            <span className="truncate max-w-[110px]">{member.name}</span>
                          </div>
                          {isAssigned && <Check className="w-3.5 h-3.5 text-indigo-650" />}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={handleDeleteCard}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 hover:text-rose-700 font-bold text-xs transition-all active:scale-[0.98] shadow-sm"
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
