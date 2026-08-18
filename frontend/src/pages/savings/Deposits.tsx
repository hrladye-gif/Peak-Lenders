import React, { useState } from 'react';
import { ArrowDownLeft, Plus, X, Calendar } from 'lucide-react';

import { getCurrency, formatMoney } from "../../config/regional";
interface Deposit {
  id: string;
  accountNo: string;
  holder: string;
  amount: string;
  method: string;
  ref: string;
  date: string;
}

export const Deposits = () => {
  const availableAccounts = [
    { no: 'SAV-10029', holder: 'Robert Musoke' },
    { no: 'SAV-10030', holder: 'Nakawa Traders SACCO Group' },
    { no: 'SAV-10012', holder: 'Grace Namubiru' },
  ];

  const [deposits, setDeposits] = useState<Deposit[]>([
    { id: '1', accountNo: 'SAV-10029', holder: 'Robert Musoke', amount: formatMoney(200000), method: 'MTN Mobile Money', ref: 'MM-9012', date: '2026-08-06' },
    { id: '2', accountNo: 'SAV-10030', holder: 'Nakawa Traders SACCO Group', amount: formatMoney(1500000), method: 'Bank Deposit', ref: 'BK-5521', date: '2026-08-05' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(availableAccounts[0].no);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('MTN Mobile Money');
  const [ref, setRef] = useState('');
  const [date, setDate] = useState('2026-08-07');

  const handleRecordDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    const matched = availableAccounts.find((a) => a.no === selectedAccount);

    const newDep: Deposit = {
      id: Date.now().toString(),
      accountNo: selectedAccount,
      holder: matched ? matched.holder : 'Unknown',
      amount: formatMoney(Number(amount)),
      method,
      ref: ref || `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      date,
    };

    setDeposits([newDep, ...deposits]);
    setAmount('');
    setRef('');
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#05445E]">Savings Deposits</h1>
          <p className="text-sm text-slate-500">Record cash deposits, mobile money transfers, and standing orders</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#189AB4] hover:bg-[#05445E] text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-colors"
        >
          <Plus size={18} /> Record Deposit
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-[#05445E]/5 text-[#05445E] uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
            <tr>
              <th className="p-4">Account Holder</th>
              <th className="p-4">Account No</th>
              <th className="p-4">Payment Method</th>
              <th className="p-4">Reference No</th>
              <th className="p-4">Deposit Date</th>
              <th className="p-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {deposits.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-bold text-[#05445E]">{d.holder}</td>
                <td className="p-4 font-mono text-xs text-[#189AB4] font-bold">{d.accountNo}</td>
                <td className="p-4 text-xs text-slate-600">{d.method}</td>
                <td className="p-4 font-mono text-xs text-slate-500">{d.ref}</td>
                <td className="p-4 font-mono text-xs text-slate-500">{d.date}</td>
                <td className="p-4 text-right font-bold text-emerald-600">+ {d.amount}</td>
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
                <ArrowDownLeft className="text-emerald-600" size={22} /> Record Savings Deposit
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRecordDeposit} className="space-y-4">
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
                <label className="block text-sm font-semibold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                >
                  <option value="MTN Mobile Money">MTN Mobile Money</option>
                  <option value="Airtel Money">Airtel Money</option>
                  <option value="Bank Deposit">Bank Deposit</option>
                  <option value="Cash Teller">Cash Teller</option>
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
                    placeholder="200000"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Reference / Receipt</label>
                  <input
                    type="text"
                    value={ref}
                    onChange={(e) => setRef(e.target.value)}
                    placeholder="MM-9012"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Calendar size={13} className="text-[#189AB4]" /> Deposit Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                />
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
                  Confirm Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
