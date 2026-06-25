import React from 'react';
import { BarChart3, TrendingUp, Users, CheckSquare, Zap, Activity } from 'lucide-react';

const WEEKLY_COMPLETIONS = [
  { day: "Mon", count: 12, height: "h-[45%]", color: "bg-[#4f46e5]" },
  { day: "Tue", count: 18, height: "h-[65%]", color: "bg-[#4f46e5]" },
  { day: "Wed", count: 24, height: "h-[85%]", color: "bg-gradient-to-t from-[#667eea] to-[#764ba2]" },
  { day: "Thu", count: 15, height: "h-[55%]", color: "bg-[#4f46e5]" },
  { day: "Fri", count: 20, height: "h-[75%]", color: "bg-[#4f46e5]" },
  { day: "Sat", count: 8,  height: "h-[30%]", color: "bg-slate-350" },
  { day: "Sun", count: 6,  height: "h-[22%]", color: "bg-slate-350" },
];

const BOARD_ACTIVITY = [
  { name: "Stripe Billing Engine", percentage: 92, count: 48, color: "bg-[#4f46e5]" },
  { name: "Linear Integration Sync", percentage: 76, count: 32, color: "bg-[#8b5cf6]" },
  { name: "Figma UI Redesign Core", percentage: 54, count: 19, color: "bg-[#10b981]" },
];

const TEAM_PRODUCTIVITY = [
  { name: "Sarah Jenkins", rate: 95, color: "bg-pink-500", label: "SJ" },
  { name: "Emma Rodriguez", rate: 88, color: "bg-emerald-500", label: "ER" },
  { name: "James Taylor", rate: 92, color: "bg-violet-500", label: "JT" },
  { name: "David Chen", rate: 74, color: "bg-blue-500", label: "DC" },
];

export default function AnalyticsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 flex-1 flex flex-col w-full animate-fade-in-up">
      
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#111827] flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-[#4f46e5]" />
            Workspace Analytics
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time reporting dashboards for tasks, workspace bottlenecks, and developer velocity.
          </p>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold shadow-sm self-start sm:self-auto">
          <TrendingUp className="w-4 h-4" />
          <span>Velocity +12% this week</span>
        </div>
      </div>

      {/* Grid of charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Chart 1: Tasks Completed This Week (Vertical CSS bars) */}
        <div className="lg:col-span-2 bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[360px]">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <span className="text-xs font-extrabold uppercase text-[#111827] tracking-wider flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#4f46e5]" />
                Tasks Completed This Week
              </span>
              <span className="text-xs font-bold text-[#6b7280]">Total: 103 Tasks</span>
            </div>

            {/* Visual Column Container */}
            <div className="h-48 flex items-end justify-between gap-4 px-2 select-none">
              {WEEKLY_COMPLETIONS.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group">
                  {/* Floating tooltip */}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#111827] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md mb-1 shadow-sm">
                    {item.count}
                  </span>
                  
                  {/* Styled Bar */}
                  <div className={`w-full ${item.height} ${item.color} rounded-t-md transition-all duration-300 hover:scale-x-105 shadow-sm`}></div>
                  
                  {/* Label */}
                  <span className="text-[10px] font-bold text-[#6b7280] mt-2">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Highlight widgets */}
        <div className="space-y-4">
          
          {/* Stat 1 */}
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4f46e5]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">Completion Rate</div>
              <div className="text-xl font-extrabold text-[#111827] mt-0.5">94.2%</div>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">Active Contributers</div>
              <div className="text-xl font-extrabold text-[#111827] mt-0.5">4 Developers</div>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">Avg Cycle Time</div>
              <div className="text-xl font-extrabold text-[#111827] mt-0.5">1.8 Days</div>
            </div>
          </div>

        </div>

      </div>

      {/* Second Row of charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        
        {/* Chart 2: Board Activity (Horizontal CSS bars) */}
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-sm min-h-[280px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <span className="text-xs font-extrabold uppercase text-[#111827] tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#4f46e5]" />
                Active Board Project Levels
              </span>
              <span className="text-[10px] font-bold text-[#6b7280]">Sort: Activity</span>
            </div>

            <div className="space-y-4">
              {BOARD_ACTIVITY.map((board, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#111827]">{board.name}</span>
                    <span className="text-slate-500 font-semibold">{board.count} commits ({board.percentage}%)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${board.color} rounded-full transition-all duration-500`}
                      style={{ width: `${board.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 3: Team Productivity (Horizontal CSS bars) */}
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-sm min-h-[280px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <span className="text-xs font-extrabold uppercase text-[#111827] tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-[#4f46e5]" />
                Team Productivity Metrics
              </span>
              <span className="text-[10px] font-bold text-[#6b7280]">Target: 80%+</span>
            </div>

            <div className="space-y-4">
              {TEAM_PRODUCTIVITY.map((member, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  {/* Initials */}
                  <div className={`w-8 h-8 rounded-full ${member.color} text-white font-bold text-[11px] flex items-center justify-center shrink-0 uppercase`}>
                    {member.label}
                  </div>
                  
                  {/* Bar and name */}
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#111827]">{member.name}</span>
                      <span className="text-slate-550 font-bold">{member.rate}% efficiency</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full transition-all duration-500"
                        style={{ width: `${member.rate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
