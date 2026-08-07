import React from 'react';
import { Bell, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const Notifications = () => {
  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-[#05445E]">Notifications</h1>
        <p className="text-sm text-slate-500">System alerts, loan updates, and operational activity</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y divide-slate-100">
        <div className="p-4 flex items-start gap-4">
          <div className="p-2.5 bg-teal-50 text-[#189AB4] rounded-xl shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-[#05445E] text-sm">Loan Repayment Completed</h4>
            <p className="text-xs text-slate-600 mt-0.5">John Doe completed repayment of UGX 250,000 for Loan #L-9041.</p>
            <span className="text-[10px] text-slate-400 mt-1 block">10 mins ago</span>
          </div>
        </div>

        <div className="p-4 flex items-start gap-4">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0">
            <AlertCircle size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-[#05445E] text-sm">Pending Approval Warning</h4>
            <p className="text-xs text-slate-600 mt-0.5">3 new loan applications require manager sign-off.</p>
            <span className="text-[10px] text-slate-400 mt-1 block">1 hour ago</span>
          </div>
        </div>

        <div className="p-4 flex items-start gap-4">
          <div className="p-2.5 bg-blue-50 text-[#189AB4] rounded-xl shrink-0">
            <Info size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-[#05445E] text-sm">System Maintenance Scheduled</h4>
            <p className="text-xs text-slate-600 mt-0.5">System update scheduled for Sunday at 02:00 AM EAT.</p>
            <span className="text-[10px] text-slate-400 mt-1 block">Yesterday</span>
          </div>
        </div>
      </div>
    </div>
  );
};
