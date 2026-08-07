import React, { useState } from 'react';
import { PiggyBank, Plus, Search, X, Calendar } from 'lucide-react';

interface Account {
  id: string;
  accountNo: string;
  holder: string;
  product: string;
  balance: string;
  dateOpened: string;
  status: 'Active' | 'Dormant';
}

export const Accounts = () => {
  const availableBorrowers = [
    { name: 'Robert Musoke', type: 'Individual' },
    { name: 'Grace Namubiru', type: 'Individual' },
    { name: 'Nakawa Traders SACCO Group', type: 'Group' },
    { name: 'Wandegeya Women Farmers', type: 'Group' },
  ];

  const [accounts, setAccounts] = useState<Account[]>([
    { id: '1', accountNo: 'SAV-10029', holder: 'Robert Musoke', product: 'Regular Voluntary Savings', balance: 'UGX 1,450,000', dateOpened: '2026-02-10', status: 'Active' },
    { id: '2', accountNo: 'SAV-10030', holder: 'Nakawa Traders SACCO Group', product: 'Group SACCO Shares', balance: 'UGX 8,200,000', dateOpened: '2026-01-15', status: 'Active' },
    { id: '3', accountNo: 'SAV-10012', holder: 'Grace Namubiru', product: 'Regular Voluntary Savings', balance: 'UGX 620,000', dateOpened: '2026-04-01', status: 'Active' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHolder, setSelectedHolder] = useState(availableBorrowers[0].name);
  const [product, setProduct] = useState('Regular Voluntary Savings');
  const [initialDeposit, setInitialDeposit] = useState('');
  const [dateOpened, setDateOpened] = useState('2026-08-07');

  const handleOpenAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialDeposit) return;

    const newAcc: Account = {
      id: Date.now().toString(),
      accountNo: `SAV-${Math.floor(10000 + Math.random() * 90000)}`,
      holder: selectedHolder,
      product,
      balance: `UGX ${Number(initialDeposit).toLocaleString()}`,
      dateOpened,
      status: 'Active',
    };

    setAccounts([newAcc, ...accounts]);
    setInitialDeposit('');
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#05445E]">Savings Accounts</h1>
          <p className="text-sm text-slate-500">View individual and group client savings portfolios</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#189AB4] hover:bg-[#05445E] text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-colors"
        >
          <Plus size={18} /> Open New Account
        </button>
      </div>

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
              <th className="p-4">Savings Product</th>
              <th className="p-4">Date Opened</th>
              <th className="p-4">Current Balance</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {accounts.map((acc) => (
              <tr key={acc.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-mono font-bold text-[#189AB4]">{acc.accountNo}</td>
                <td className="p-4 font-bold text-[#05445E]">{acc.holder}</td>
                <td className="p-4 text-xs font-semibold text-slate-600">{acc.product}</td>
                <td className="p-4 font-mono text-xs text-slate-500">{acc.dateOpened}</td>
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

      {/* Modal */}
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
                <label className="block text-sm font-semibold text-slate-700 mb-1">Select Borrower / Group</label>
                <select
                  value={selectedHolder}
                  onChange={(e) => setSelectedHolder(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                >
                  {availableBorrowers.map((b) => (
                    <option key={b.name} value={b.name}>
                      {b.type === 'Group' ? '👥' : '👤'} {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Savings Product</label>
                <select
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                >
                  <option value="Regular Voluntary Savings">Regular Voluntary Savings</option>
                  <option value="Fixed Term Deposit (12M)">Fixed Term Deposit (12M)</option>
                  <option value="Group SACCO Shares">Group SACCO Shares</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Deposit (UGX)</label>
                  <input
                    type="number"
                    required
                    value={initialDeposit}
                    onChange={(e) => setInitialDeposit(e.target.value)}
                    placeholder="100000"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Calendar size={13} className="text-[#189AB4]" /> Date Opened
                  </label>
                  <input
                    type="date"
                    required
                    value={dateOpened}
                    onChange={(e) => setDateOpened(e.target.value)}
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
                  Open Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
