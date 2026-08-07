import React from 'react';
import { Ban, ShieldCheck } from 'lucide-react';

export const WriteOffs = () => {
  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-[#05445E]">Loan Write-Offs</h1>
        <p className="text-sm text-slate-500">Manage non-collectible bad debt provisions according to accounting policy</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 mb-4">
          <Ban size={22} className="text-rose-500" />
          <p className="text-xs text-slate-600">
            Written-off loans are moved out of active portfolio balance sheets into loss provisions.
          </p>
        </div>
        <p className="text-center text-slate-400 text-sm font-medium py-8">No accounts currently marked for write-off.</p>
      </div>
    </div>
  );
};
