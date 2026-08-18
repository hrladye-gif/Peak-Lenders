import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, Plus, X, Calendar, DollarSign } from 'lucide-react';

import { getCurrency, formatMoney } from "../../config/regional";
interface SavingsTxn {
  id: string;
  accountNo: string;
  accountHolder: string;
  type: 'Deposit' | 'Withdrawal';
  amount: string;
  method: string;
  date: string;
}

export const Transactions = () => {
  const availableAccounts = [
    { no: 'SAV-10029', holder: 'Robert Musoke' },
    { no: 'SAV-10030', holder: 'Nakawa Traders SACCO Group' },
    { no: 'SAV-10012', holder: 'Grace Namubiru' },
  ];

  const [transactions, setTransactions] = useState<SavingsTxn[]>([
    { id: '1', accountNo: 'SAV-10029', accountHolder: 'Robert Musoke', type: 'Deposit', amount: formatMoney(200000), method: 'MTN Mobile Money', date: '2026-08-06' },
    { id: '2', accountNo: 'SAV-10030', accountHolder: 'Nakawa Traders SACCO Group', type: 'Deposit', amount: formatMoney(1500000), method: 'Bank Transfer', date: '2026-08-05' },
    { id: '3', accountNo: 'SAV-10012', accountHolder: 'Grace Namubiru', type: 'Withdrawal', amount: formatMoney(50000), method: 'Cash', date: '2026-08-02' },
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccNo, setSelectedAccNo] = useState(availableAccounts[0].no);
  const [txnType, setTxnType] = useState<'Deposit' | 'Withdrawal'>('Deposit');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('MTN Mobile Money');
  const [date, setDate] = useState('2026-08-07');

  const handleNewTxn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    const matchedAcc = availableAccounts.find((a) => a.no === selectedAccNo);

    const newTxn: SavingsTxn = {
      id: Date.now().toString(),
      accountNo: selectedAccNo,
      accountHolder: matchedAcc ? matchedAcc.holder : 'Unknown',
      type: txnType,
      amount: formatMoney(Number(amount)),
      method,
      date,
    };

    setTransactions([newTxn, ...transactions]);
    setAmount('');
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#05445E]">Savings Transactions</h1>
          <p className="text-sm text-slate-500">Record cash deposits, mobile money inflows, and teller withdrawals</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#189AB4] hover:bg-[#05445E] text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-colors"
        >
          <Plus size={18} />
          New Savings Transaction
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-[#05445E]/5 text-[#05445E] uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
            <tr>
              <th className="p-4">Txn Type</th>
              <th className="p-4">Account Holder</th>
              <th className="p-4">Account No</th>
              <th className="p-4">Method</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map((txn) => (
              <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      txn.type === 'Deposit'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {txn.type === 'Deposit' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                    {txn.type}
                  </span>
                </td>
                <td className="p-4 font-bold text-[#05445E]">{txn.accountHolder}</td>
                <td className="p-4 font-mono text-xs text-[#189AB4] font-bold">{txn.accountNo}</td>
                <td className="p-4 text-xs text-slate-600">{txn.method}</td>
                <td className="p-4 font-mono text-xs text-slate-500">{txn.date}</td>
                <td className={`p-4 text-right font-bold ${txn.type === 'Deposit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {txn.type === 'Deposit' ? '+' : '-'} {txn.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xl font-bold text-[#05445E] flex items-center gap-2">
                <DollarSign className="text-[#189AB4]" size={22} /> Record Transaction
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleNewTxn} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Transaction Type</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setTxnType('Deposit')}
                    className={`py-2 rounded-lg transition-all ${
                      txnType === 'Deposit' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    + Deposit
                  </button>
                  <button
                    type="button"
                    onClick={() => setTxnType('Withdrawal')}
                    className={`py-2 rounded-lg transition-all ${
                      txnType === 'Withdrawal' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    - Withdrawal
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Savings Account</label>
                <select
                  value={selectedAccNo}
                  onChange={(e) => setSelectedAccNo(e.target.value)}
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
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
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
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
