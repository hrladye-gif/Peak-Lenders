import { formatMoney } from "../../config/regional";
import React, { useState } from 'react';
import { Plus, Search, FolderTree, X } from 'lucide-react';

interface Account {
  id: string;
  code: string;
  name: string;
  category: 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense';
  type: string;
  description: string;
  balance: string;
  status: 'Active' | 'Inactive';
}

export const ChartOfAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([
    { id: '1', code: '1000', name: 'Petty Cash', category: 'Asset', type: 'Cash & Bank', description: 'Main cash on hand at central office', balance: formatMoney(5200000), status: 'Active' },
    { id: '2', code: '1100', name: 'Gross Loan Portfolio', category: 'Asset', type: 'Loans Receivable', description: 'Total outstanding microfinance principal', balance: formatMoney(420000000), status: 'Active' },
    { id: '3', code: '2000', name: 'Client Voluntary Savings', category: 'Liability', type: 'Savings Deposits', description: 'Voluntary client savings deposits liability', balance: formatMoney(185000000), status: 'Active' },
    { id: '4', code: '3000', name: 'Share Capital', category: 'Equity', type: 'Equity', description: 'Paid-up equity share capital', balance: formatMoney(100000000), status: 'Active' },
    { id: '5', code: '4000', name: 'Interest Income on Loans', category: 'Income', type: 'Revenue', description: 'Earned interest on active loan contracts', balance: formatMoney(38500000), status: 'Active' },
    { id: '6', code: '5000', name: 'Office Operating Expenses', category: 'Expense', type: 'Operating Cost', description: 'Day-to-day branch administrative expenses', balance: formatMoney(12100000), status: 'Active' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense'>('Asset');

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) return;

    const newAcc: Account = {
      id: Date.now().toString(),
      code,
      name,
      category,
      type: category,
      description,
      balance: formatMoney(0),
      status: 'Active',
    };

    setAccounts([...accounts, newAcc]);
    setCode('');
    setName('');
    setDescription('');
    setIsModalOpen(false);
  };

  const categoryColors = {
    Asset: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Liability: 'bg-amber-50 text-amber-700 border-amber-200',
    Equity: 'bg-purple-50 text-purple-700 border-purple-200',
    Income: 'bg-blue-50 text-blue-700 border-blue-200',
    Expense: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#05445E]">Chart of Accounts</h1>
          <p className="text-sm text-slate-500">Master financial ledger classification for MFI operations</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#189AB4] hover:bg-[#05445E] text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-colors"
        >
          <Plus size={18} /> Add Account
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <div className="relative w-80">
            <Search size={18} className="absolute left-3.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by code or account name..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
            />
          </div>
        </div>

        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-[#05445E]/5 text-[#05445E] uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
            <tr>
              <th className="p-4">GL Code</th>
              <th className="p-4">Account Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-right">Balance</th>
              <th className="p-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {accounts.map((acc) => (
              <tr key={acc.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-mono font-bold text-[#189AB4]">{acc.code}</td>
                <td className="p-4 font-bold text-[#05445E]">{acc.name}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${categoryColors[acc.category]}`}>
                    {acc.category}
                  </span>
                </td>
                <td className="p-4 text-xs text-slate-500 max-w-xs truncate">{acc.description || '-'}</td>
                <td className="p-4 text-right font-bold text-slate-800">{acc.balance}</td>
                <td className="p-4 text-center">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-teal-50 text-teal-700 border border-teal-200">
                    {acc.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xl font-bold text-[#05445E] flex items-center gap-2">
                <FolderTree className="text-[#189AB4]" size={22} /> Add GL Account
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddAccount} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">GL Code</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. 1050"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  >
                    <option value="Asset">Asset</option>
                    <option value="Liability">Liability</option>
                    <option value="Equity">Equity</option>
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Account Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mobile Money Collection Account"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Used for tracking incoming client repayments via mobile wallet..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#189AB4] resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-[#189AB4] hover:bg-[#05445E] text-white rounded-xl font-semibold transition-colors text-xs"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
