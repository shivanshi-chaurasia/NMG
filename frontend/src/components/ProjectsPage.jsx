import React from 'react';
import { Calendar, Compass, Lock, Rocket, Sliders, ChevronRight } from 'lucide-react';

export default function ProjectsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 flex-1 flex flex-col w-full animate-fade-in-up">
      
      {/* Header Area */}
      <div className="text-center md:text-left mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[#4f46e5] text-xs font-bold mb-4 shadow-sm">
          <Rocket className="w-3.5 h-3.5" />
          <span>Active Pipeline</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#111827] mb-3">
          Projects Portfolio & Roadmap
        </h1>
        <p className="text-slate-500 text-sm max-w-xl leading-relaxed">
          Unlock high-level project management, cross-board milestones, and automated portfolios. The complete portfolio control panel is coming soon.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Mock Gantt Timeline */}
        <div className="lg:col-span-2 bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <span className="text-xs font-extrabold uppercase text-[#111827] tracking-wider">Milestone Timeline</span>
              <span className="text-[10px] font-bold text-[#6b7280]">Targeting Release v2.0</span>
            </div>

            <div className="space-y-6">
              {/* Task 1 */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#111827] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                    ZenBoard Analytics Core
                  </span>
                  <span className="text-slate-400 font-medium">Completed</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#10b981] rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              {/* Task 2 */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#111827] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#4f46e5] animate-pulse"></span>
                    Portfolio Automation & Multi-board Sync
                  </span>
                  <span className="text-[#4f46e5] font-bold">85% In Progress</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              {/* Task 3 */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#111827] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-350"></span>
                    Resource Allocations & Budgets
                  </span>
                  <span className="text-slate-400 font-medium">Planned Q3</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-200 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#6b7280] font-medium">Get notified when we roll out workspace updates.</span>
            <div className="flex gap-2 w-full sm:w-auto">
              <input 
                type="email" 
                placeholder="developer@work.com"
                disabled
                className="px-3 py-1.5 rounded-lg border border-[#e5e7eb] bg-slate-50 text-xs outline-none w-full sm:w-48 text-slate-400"
              />
              <button className="px-4 py-1.5 bg-[#111827] text-white text-xs font-bold rounded-lg shrink-0 opacity-80 cursor-not-allowed">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Features List cards */}
        <div className="space-y-4">
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4f46e5] mb-4">
              <Compass className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-[#111827] mb-1">Interactive Gantt Engine</h4>
            <p className="text-xs text-[#6b7280] leading-relaxed">
              Visualize milestones and drag timeline blocks directly. Automatically resolves checklist bottlenecks.
            </p>
          </div>

          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-4">
              <Sliders className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-[#111827] mb-1">Cross-Board Syncing</h4>
            <p className="text-xs text-[#6b7280] leading-relaxed">
              Link card updates across sprint databases automatically, avoiding manual copy-pastes.
            </p>
          </div>

          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5 shadow-sm flex items-center justify-between group cursor-pointer hover:border-[#d1d5db] transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#111827]">Request Beta Access</h5>
                <p className="text-[10px] text-[#6b7280]">For Enterprise workspaces</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

      </div>

    </div>
  );
}
