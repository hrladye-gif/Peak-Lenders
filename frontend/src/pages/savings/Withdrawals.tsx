import React, { useState } from 'react';
import { ArrowUpRight, Plus, X, Calendar } from 'lucide-react';

import { getCurrency, formatMoney } from "../../config/regional";
interface Withdrawal {
  id: string;
  accountNo: string;
  holder: string;
  amount: string;
  method: string;
  date: string;
  status: 'Approved' | 'Pending Verification';
}

export const Withdrawals = () => {
  const availableAccounts = [
    { no: 'SAV-10029', holder: 'Robert Musoke' },
    { no: 'SAV-10030', holder: 'Nakawa Traders SACCO Group' },
    { no: 'SAV-10012', holder: 'Grace Namubiru' },
  ];

  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([
    { id: '1', accountNo: 'SAV-10012', holder: 'Grace Namubiru', amount: formatMoney(50000), method: 'Cash Teller', date: '2026-08-02', status: 'Approved' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(availableAccounts[0].no);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Cash Teller');
  const [date, setDate] = useState('2026-08-07');

  const handleRecordWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    const matched = availableAccounts.find((a) => a.no === selectedAccount);

    const newWth: Withdrawal = {
      id: Date.now().toString(),
      accountNo: selectedAccount,
      holder: matched ? matched.holder : 'Unknown',
      amount: formatMoney(Number(amount)),
      method,
      date,
      status: 'Approved',
    };

    setWithdrawals([newWth, ...withdrawals]);
    setAmount('');
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#05445E]">Savings Withdrawals</h1>
          <p className="text-sm text-slate-500">Authorize and process client savings payout requests</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#189AB4] hover:bg-[#05445E] text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-colors"
        >
          <Plus size={18} /> Process Withdrawal
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-[#05445E]/5 text-[#05445E] uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
            <tr>
              <th className="p-4">Account Holder</th>
              <th className="p-4">Account No</th>
              <th className="p-4">Payout Channel</th>
              <th className="p-4">Withdrawal Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {withdrawals.map((w) => (
              <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-bold text-[#05445E]">{w.holder}</td>
                <td className="p-4 font-mono text-xs text-[#189AB4] font-bold">{w.accountNo}</td>
                <td className="p-4 text-xs text-slate-600">{w.method}</td>
                <td className="p-4 font-mono text-xs text-slate-500">{w.date}</td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {w.status}
                  </span>
                </td>
                <td className="p-4 text-right font-bold text-rose-600">- {w.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xl font-bold text-[#05445E] flex items-center gap-2">
                <ArrowUpRight className="text-rose-600" size={22} /> Process Savings Payout
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRecordWithdrawal} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Select Savings Account</label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                >
                  {availableAccounts.map((a) => (
                    <option key={a.no} value={a.no}>
                      {a.holder} ({a.no})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Payout Channel</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                >
                  <option value="Cash Teller">Cash Teller</option>
                  <option value="MTN Mobile Money">MTN Mobile Money Payout</option>
                  <option value="Airtel Money">Airtel Money Payout</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Amount ({getCurrency()})</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="50000"
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
                  Authorize Payout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
