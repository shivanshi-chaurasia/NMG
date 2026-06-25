import React, { useState } from 'react';
import { Mail, Shield, UserPlus, MoreVertical, Search, Check, Sparkles } from 'lucide-react';

const INITIAL_MEMBERS = [
  { id: 1, name: "Sarah Jenkins", email: "sarah.j@zenboard.io", role: "Principal Designer", status: "online", color: "bg-pink-500", label: "Admin" },
  { id: 2, name: "David Chen", email: "d.chen@zenboard.io", role: "Lead Engineer", status: "offline", color: "bg-blue-500", label: "Owner" },
  { id: 3, name: "Emma Rodriguez", email: "emma.r@zenboard.io", role: "Product Manager", status: "online", color: "bg-emerald-500", label: "Admin" },
  { id: 4, name: "James Taylor", email: "j.taylor@zenboard.io", role: "Backend Developer", status: "online", color: "bg-violet-500", label: "Member" },
];

export default function TeamPage() {
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Member');

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const colors = ["bg-pink-500", "bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-amber-500", "bg-sky-500"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newMember = {
      id: members.length + 1,
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      status: "online",
      color: randomColor,
      label: "Member"
    };

    setMembers([...members, newMember]);
    setInviteName('');
    setInviteEmail('');
    setShowInviteModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 flex-1 flex flex-col w-full animate-fade-in-up">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#111827] flex items-center gap-3">
            Team Workspace
            <span className="text-xs font-bold bg-indigo-50 border border-indigo-100 text-[#4f46e5] px-2.5 py-0.5 rounded-full">
              {members.length} Members
            </span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage permissions, roles, and review core active users in your engineering team.
          </p>
        </div>
        
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold text-xs btn-transition btn-hover shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          Invite User
        </button>
      </div>

      {/* Grid of Team members */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {members.map(member => (
          <div 
            key={member.id}
            className="group relative bg-white border border-[#e5e7eb] rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:border-[#d1d5db] transition-colors"
          >
            {/* Options Button */}
            <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Avatar with initials */}
            <div className={`w-16 h-16 rounded-full ${member.color} text-white font-extrabold text-lg flex items-center justify-center shadow-md mb-4 uppercase relative`}>
              {member.name.charAt(0) + member.name.split(' ').slice(1).map(n => n.charAt(0)).join('')}
              {/* Online indicator */}
              <span className={`absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${
                member.status === 'online' ? 'bg-[#10b981] animate-pulse' : 'bg-slate-400'
              }`}></span>
            </div>

            {/* User Details */}
            <h3 className="font-bold text-[#111827] text-sm group-hover:text-[#4f46e5] transition-colors">
              {member.name}
            </h3>
            
            <div className="text-[10px] font-bold text-[#4f46e5] bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded-md mt-1 mb-3">
              {member.role}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#6b7280] mb-4">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate max-w-[150px]">{member.email}</span>
            </div>

            {/* Bottom Row - Role tag info */}
            <div className="w-full pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold">
              <span className="text-slate-400 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                {member.label}
              </span>
              <span className={`font-bold ${
                member.status === 'online' ? 'text-emerald-600' : 'text-slate-400'
              }`}>
                {member.status === 'online' ? 'Active' : 'Offline'}
              </span>
            </div>

          </div>
        ))}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e5e7eb] rounded-2xl max-w-md w-full p-8 shadow-2xl animate-scale-in">
            <h2 className="text-lg font-bold text-[#111827] mb-6 flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-100">
                <UserPlus className="w-5 h-5 text-[#4f46e5]" />
              </div>
              Invite Team Member
            </h2>
            <form onSubmit={handleInvite} className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b7280] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-[#e5e7eb] focus:bg-white focus:border-[#4f46e5] outline-none text-sm text-[#111827] shadow-sm"
                />
              </div>
              
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b7280] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. sarah@zenboard.io"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-[#e5e7eb] focus:bg-white focus:border-[#4f46e5] outline-none text-sm text-[#111827] shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b7280] mb-2">
                  Work Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-[#e5e7eb] focus:bg-white focus:border-[#4f46e5] outline-none text-xs text-[#111827] cursor-pointer shadow-sm"
                >
                  <option value="Lead Engineer">Lead Engineer</option>
                  <option value="Principal Designer">Principal Designer</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Quality Assurance">Quality Assurance</option>
                  <option value="Member">Member</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e5e7eb]">
                <button
                  type="button"
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteName('');
                    setInviteEmail('');
                  }}
                  className="px-4 py-2 rounded-lg border border-[#e5e7eb] hover:bg-slate-50 text-[#6b7280] text-sm font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#4f46e5] hover:bg-[#4338ca] text-white text-sm font-bold transition-all shadow-sm"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
