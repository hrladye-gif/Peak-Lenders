import React from 'react';
import { Activity, UserPlus, DollarSign, FileCheck } from 'lucide-react';

export const ActivityFeed = () => {
  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-[#05445E]">Activity Feed</h1>
        <p className="text-sm text-slate-500">Real-time log of team member actions and system events</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        <div className="flex gap-4 items-start relative before:absolute before:left-5 before:top-10 before:bottom-0 before:w-0.5 before:bg-slate-200">
          <div className="p-2.5 bg-[#D4F1F4] text-[#05445E] rounded-full z-10 shrink-0">
            <UserPlus size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#05445E]">
              Sarah Jenkins <span className="font-normal text-slate-600">registered new borrower</span> Robert K.
            </p>
            <span className="text-xs text-slate-400">Kampala Main Branch • 15 mins ago</span>
          </div>
        </div>

        <div className="flex gap-4 items-start relative before:absolute before:left-5 before:top-10 before:bottom-0 before:w-0.5 before:bg-slate-200">
          <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-full z-10 shrink-0">
            <DollarSign size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#05445E]">
              Alex M. <span className="font-normal text-slate-600">disbursed loan</span> #L-8820 (UGX 1,500,000)
            </p>
            <span className="text-xs text-slate-400">Ntinda Branch • 42 mins ago</span>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="p-2.5 bg-blue-100 text-[#189AB4] rounded-full z-10 shrink-0">
            <FileCheck size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#05445E]">
              System <span className="font-normal text-slate-600">generated monthly portfolio audit summary</span>
            </p>
            <span className="text-xs text-slate-400">Automated System Job • 2 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};
