import React, { useState } from 'react';
import { PiggyBank, Plus, Search, UserCheck, X } from 'lucide-react';

interface SavingsAccount {
  id: string;
  accountNo: string;
  accountHolder: string;
  type: 'Individual' | 'Group';
  balance: string;
  accountType: 'Voluntary Savings' | 'Compulsory Share' | 'Fixed Deposit';
  status: 'Active' | 'Dormant';
}

export const SavingsAccounts = () => {
  const [accounts, setAccounts] = useState<SavingsAccount[]>([
    {
      id: '1',
      accountNo: 'SAV-10029',
      accountHolder: 'Robert Musoke',
      type: 'Individual',
      balance: 'UGX 1,450,000',
      accountType: 'Voluntary Savings',
      status: 'Active',
    },
    {
      id: '2',
      accountNo: 'SAV-10030',
      accountHolder: 'Nakawa Traders SACCO Group',
      type: 'Group',
      balance: 'UGX 8,200,000',
      accountType: 'Compulsory Share',
      status: 'Active',
    },
    {
      id: '3',
      accountNo: 'SAV-10012',
      accountHolder: 'Grace Namubiru',
      type: 'Individual',
      balance: 'UGX 620,000',
      accountType: 'Voluntary Savings',
      status: 'Active',
    },
  ]);

  const availableBorrowers = [
    { id: 'b1', name: 'Robert Musoke', type: 'Individual' },
    { id: 'b2', name: 'Grace Namubiru', type: 'Individual' },
    { id: 'b3', name: 'Josephine K.', type: 'Individual' },
    { id: 'g1', name: 'Nakawa Traders SACCO Group', type: 'Group' },
    { id: 'g2', name: 'Wandegeya Women Farmers', type: 'Group' },
  ];

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHolder, setSelectedHolder] = useState(availableBorrowers[0].name);
  const [accountCategory, setAccountCategory] = useState<'Voluntary Savings' | 'Compulsory Share' | 'Fixed Deposit'>('Voluntary Savings');
  const [initialDeposit, setInitialDeposit] = useState('');

  const handleOpenAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHolder || !initialDeposit) return;

    const matchedBorrower = availableBorrowers.find((b) => b.name === selectedHolder);

    const newAccount: SavingsAccount = {
      id: Date.now().toString(),
      accountNo: `SAV-${Math.floor(10000 + Math.random() * 90000)}`,
      accountHolder: selectedHolder,
      type: matchedBorrower ? (matchedBorrower.type as any) : 'Individual',
      balance: `UGX ${Number(initialDeposit).toLocaleString()}`,
      accountType: accountCategory,
      status: 'Active',
    };

    setAccounts([newAccount, ...accounts]);
    setInitialDeposit('');
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#05445E]">Savings Accounts</h1>
          <p className="text-sm text-slate-500">Manage voluntary savings, SACCO shares, and fixed deposits</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#189AB4] hover:bg-[#05445E] text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-colors"
        >
          <Plus size={18} />
          Open Savings Account
        </button>
      </div>

      {/* Account List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <div className="relative w-80">
            <Search size={18} className="absolute left-3.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search savings accounts..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
            />
          </div>
        </div>

        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-[#05445E]/5 text-[#05445E] uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
            <tr>
              <th className="p-4">Account No</th>
              <th className="p-4">Account Holder</th>
              <th className="p-4">Holder Type</th>
              <th className="p-4">Product Category</th>
              <th className="p-4">Current Balance</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {accounts.map((acc) => (
              <tr key={acc.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-mono font-bold text-[#189AB4]">{acc.accountNo}</td>
                <td className="p-4 font-bold text-[#05445E]">{acc.accountHolder}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                    {acc.type}
                  </span>
                </td>
                <td className="p-4 text-xs font-semibold text-slate-600">{acc.accountType}</td>
                <td className="p-4 font-bold text-emerald-600">{acc.balance}</td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                    {acc.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Open Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xl font-bold text-[#05445E] flex items-center gap-2">
                <PiggyBank className="text-[#189AB4]" size={22} /> Open Savings Account
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleOpenAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Account Holder / Group
                </label>
                <select
                  value={selectedHolder}
                  onChange={(e) => setSelectedHolder(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#189AB4] font-medium text-slate-700"
                >
                  <optgroup label="Individual Borrowers">
                    {availableBorrowers
                      .filter((b) => b.type === 'Individual')
                      .map((b) => (
                        <option key={b.id} value={b.name}>
                          👤 {b.name}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Borrower Groups">
                    {availableBorrowers
                      .filter((b) => b.type === 'Group')
                      .map((b) => (
                        <option key={b.id} value={b.name}>
                          👥 {b.name}
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Product Category</label>
                <select
                  value={accountCategory}
                  onChange={(e) => setAccountCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                >
                  <option value="Voluntary Savings">Voluntary Savings</option>
                  <option value="Compulsory Share">Compulsory Share</option>
                  <option value="Fixed Deposit">Fixed Deposit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Initial Deposit (UGX)</label>
                <input
                  type="number"
                  required
                  value={initialDeposit}
                  onChange={(e) => setInitialDeposit(e.target.value)}
                  placeholder="e.g. 100000"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
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
