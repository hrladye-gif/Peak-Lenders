import React from 'react';
import { Building2, Plus, MapPin, Users, Phone } from 'lucide-react';

export const Branches = () => {
  const branches = [
    { id: 'BR-01', name: 'Kampala Central HQ', code: 'KLA-01', manager: 'Sarah Akello', phone: '+256 772 100 200', activeLoans: 680, location: 'Plot 42 Kampala Road' },
    { id: 'BR-02', name: 'Jinja Branch', code: 'JNJ-02', manager: 'John Opio', phone: '+256 701 300 400', activeLoans: 310, location: 'Main Street, Jinja City' },
    { id: 'BR-03', name: 'Mbarara Regional Branch', code: 'MBR-03', manager: 'Robert Mulema', phone: '+256 752 500 600', activeLoans: 250, location: 'High Street, Mbarara' },
  ];

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#05445E]">Branch Operations</h1>
          <p className="text-sm text-slate-500">Manage regional branches and organizational hierarchy</p>
        </div>
        <button className="flex items-center gap-2 bg-[#189AB4] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md hover:bg-[#05445E] transition-colors">
          <Plus size={16} /> Add New Branch
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {branches.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#189AB4]/10 rounded-xl text-[#189AB4]">
                  <Building2 size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-[#05445E] text-sm">{b.name}</h3>
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{b.code}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2"><MapPin size={14} className="text-slate-400" /> {b.location}</div>
              <div className="flex items-center gap-2"><Users size={14} className="text-slate-400" /> Manager: <span className="font-semibold text-slate-800">{b.manager}</span></div>
              <div className="flex items-center gap-2"><Phone size={14} className="text-slate-400" /> {b.phone}</div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-slate-400">Active Borrowers:</span>
              <span className="font-bold font-mono text-[#05445E] text-sm">{b.activeLoans} Loans</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
