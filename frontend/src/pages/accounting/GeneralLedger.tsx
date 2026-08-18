import { formatMoney } from "../../config/regional";
import React, { useState } from 'react';
import { Calculator, Filter } from 'lucide-react';

interface LedgerTxn {
  id: string;
  date: string;
  glCode: string;
  glName: string;
  description: string;
  debit: string;
  credit: string;
  runningBalance: string;
}

export const GeneralLedger = () => {
  const [selectedGl, setSelectedGl] = useState('1000');

  const ledgerRecords: LedgerTxn[] = [
    { id: '1', date: '2026-08-01', glCode: '1000', glName: 'Petty Cash', description: 'Opening Balance', debit: formatMoney(10000000), credit: '-', runningBalance: formatMoney(10000000) },
    { id: '2', date: '2026-08-05', glCode: '1000', glName: 'Petty Cash', description: 'Client Voluntary Savings Deposit', debit: formatMoney(1500000), credit: '-', runningBalance: formatMoney(11500000) },
    { id: '3', date: '2026-08-06', glCode: '1000', glName: 'Petty Cash', description: 'Loan Disbursement #LN-10029', debit: '-', credit: formatMoney(2500000), runningBalance: formatMoney(9000000) },
  ];

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#05445E]">General Ledger</h1>
          <p className="text-sm text-slate-500">View real-time audit balance history across GL accounts</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex gap-4 items-center">
        <Filter size={18} className="text-[#189AB4]" />
        <span className="text-xs font-bold text-slate-700">Filter GL Account:</span>
        <select
          value={selectedGl}
          onChange={(e) => setSelectedGl(e.target.value)}
          className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
        >
          <option value="1000">1000 - Petty Cash</option>
          <option value="1100">1100 - Gross Loan Portfolio</option>
          <option value="2000">2000 - Client Voluntary Savings</option>
          <option value="4000">4000 - Interest Income</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-[#05445E]/5 text-[#05445E] uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">GL Code</th>
              <th className="p-4">Account Description</th>
              <th className="p-4 text-right">Debit (DR)</th>
              <th className="p-4 text-right">Credit (CR)</th>
              <th className="p-4 text-right">Running Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ledgerRecords.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-mono text-xs text-slate-500">{l.date}</td>
                <td className="p-4 font-mono font-bold text-[#189AB4]">{l.glCode}</td>
                <td className="p-4 font-bold text-[#05445E]">{l.description}</td>
                <td className="p-4 text-right font-bold text-emerald-600">{l.debit}</td>
                <td className="p-4 text-right font-bold text-rose-600">{l.credit}</td>
                <td className="p-4 text-right font-bold text-slate-800">{l.runningBalance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
