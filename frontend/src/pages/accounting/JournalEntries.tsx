import { formatMoney } from "../../config/regional";
import React, { useState } from 'react';
import { Plus, X, Calendar, FileCheck } from 'lucide-react';

interface JournalEntry {
  id: string;
  ref: string;
  date: string;
  narration: string;
  debitAcc: string;
  creditAcc: string;
  amount: string;
  status: 'Posted' | 'Draft';
}

export const JournalEntries = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([
    { id: '1', ref: 'JV-2026-001', date: '2026-08-06', narration: 'Loan disbursement for Robert Musoke', debitAcc: '1100 - Gross Loan Portfolio', creditAcc: '1000 - Petty Cash', amount: formatMoney(2500000), status: 'Posted' },
    { id: '2', ref: 'JV-2026-002', date: '2026-08-05', narration: 'Client Savings Deposit via Mobile Money', debitAcc: '1000 - Petty Cash', creditAcc: '2000 - Client Voluntary Savings', amount: formatMoney(1500000), status: 'Posted' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [narration, setNarration] = useState('');
  const [debitAcc, setDebitAcc] = useState('1100 - Gross Loan Portfolio');
  const [creditAcc, setCreditAcc] = useState('1000 - Petty Cash');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('2026-08-07');

  const handlePostJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!narration || !amount) return;

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      ref: `JV-2026-00${entries.length + 1}`,
      date,
      narration,
      debitAcc,
      creditAcc,
      amount: formatMoney(Number(amount)),
      status: 'Posted',
    };

    setEntries([newEntry, ...entries]);
    setNarration('');
    setAmount('');
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#05445E]">Journal Entries</h1>
          <p className="text-sm text-slate-500">Record manual double-entry financial vouchers and adjustments</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#189AB4] hover:bg-[#05445E] text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-colors"
        >
          <Plus size={18} /> New Journal Voucher
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-[#05445E]/5 text-[#05445E] uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
            <tr>
              <th className="p-4">JV Ref</th>
              <th className="p-4">Date</th>
              <th className="p-4">Narration</th>
              <th className="p-4">Debit GL Account</th>
              <th className="p-4">Credit GL Account</th>
              <th className="p-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {entries.map((j) => (
              <tr key={j.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-mono font-bold text-[#189AB4]">{j.ref}</td>
                <td className="p-4 font-mono text-xs text-slate-500">{j.date}</td>
                <td className="p-4 font-bold text-[#05445E] max-w-xs truncate">{j.narration}</td>
                <td className="p-4 text-xs font-semibold text-emerald-700 bg-emerald-50/50">{j.debitAcc}</td>
                <td className="p-4 text-xs font-semibold text-rose-700 bg-rose-50/50">{j.creditAcc}</td>
                <td className="p-4 text-right font-bold text-slate-800">{j.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Journal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xl font-bold text-[#05445E] flex items-center gap-2">
                <FileCheck className="text-[#189AB4]" size={22} /> Post Journal Voucher
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePostJournal} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Narration / Description</label>
                <input
                  type="text"
                  required
                  value={narration}
                  onChange={(e) => setNarration(e.target.value)}
                  placeholder="e.g. Disbursed loan #LN-1002"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-emerald-700 mb-1">Debit Account (DR)</label>
                  <select
                    value={debitAcc}
                    onChange={(e) => setDebitAcc(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  >
                    <option value="1100 - Gross Loan Portfolio">1100 - Gross Loan Portfolio</option>
                    <option value="1000 - Petty Cash">1000 - Petty Cash</option>
                    <option value="5000 - Office Expenses">5000 - Office Expenses</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-rose-700 mb-1">Credit Account (CR)</label>
                  <select
                    value={creditAcc}
                    onChange={(e) => setCreditAcc(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  >
                    <option value="1000 - Petty Cash">1000 - Petty Cash</option>
                    <option value="2000 - Client Savings">2000 - Client Savings</option>
                    <option value="4000 - Interest Income">4000 - Interest Income</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Amount</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="500000"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Calendar size={13} className="text-[#189AB4]" /> Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-[#189AB4] hover:bg-[#05445E] text-white rounded-xl font-semibold transition-colors"
                >
                  Post Journal Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
