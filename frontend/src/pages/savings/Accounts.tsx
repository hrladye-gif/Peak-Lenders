import React, { useEffect, useState } from 'react';
import { PiggyBank, Plus, Search, X, Calendar } from 'lucide-react';

import { getCurrency, formatMoney } from "../../config/regional";
import { api } from "../../api/axios";

interface Borrower {
  id: string;
  name: string;
}

interface SavingsProduct {
  id: string;
  name: string;
  code: string;
  interest_rate: number;
  minimum_balance: number;
  is_active: boolean;
}

interface Account {
  id: string;
  account_number: string;
  borrower_name: string;
  product_name: string;
  current_balance: number;
  status: string;
}

export const Accounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [products, setProducts] = useState<SavingsProduct[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedBorrower, setSelectedBorrower] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [initialDeposit, setInitialDeposit] = useState('');
  const [dateOpened, setDateOpened] = useState(
    new Date().toISOString().split('T')[0]
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const [accountsResponse, borrowersResponse, productsResponse] =
        await Promise.all([
          api.get('/savings/accounts'),
          api.get('/borrowers'),
          api.get('/savings/products'),
        ]);

      const mappedBorrowers = borrowersResponse.data.map((b: any) => ({
        id: b.id,
        name:
          `${b.first_name || ''} ${b.last_name || ''}`.trim() ||
          b.business_name ||
          'Unnamed Borrower',
      }));

      setAccounts(accountsResponse.data);
      setBorrowers(mappedBorrowers);
      setProducts(productsResponse.data);
    } catch (err: any) {
      console.error('Failed to load savings data:', err);
      setError(
        err?.response?.data?.detail ||
          'Failed to load savings accounts data.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = () => {
    setError('');

    setSelectedBorrower(borrowers[0]?.id || '');
    setSelectedProduct(products[0]?.id || '');
    setInitialDeposit('');
    setDateOpened(new Date().toISOString().split('T')[0]);

    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (!saving) {
      setIsModalOpen(false);
      setError('');
    }
  };

  const handleOpenAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBorrower) {
      setError('Please select a borrower.');
      return;
    }

    if (!selectedProduct) {
      setError('Please select a savings product.');
      return;
    }

    const deposit = Number(initialDeposit);

    if (deposit < 0) {
      setError('Initial deposit cannot be negative.');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const accountNumber = `SAV-${Math.floor(
        10000 + Math.random() * 90000
      )}`;

      await api.post('/savings/accounts', {
        borrower_id: selectedBorrower,
        product_id: selectedProduct,
        account_number: accountNumber,
        initial_deposit: deposit || 0,
      });

      setIsModalOpen(false);

      await fetchData();
    } catch (err: any) {
      console.error('Failed to open savings account:', err);

      setError(
        err?.response?.data?.detail ||
          'Failed to open savings account. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const filteredAccounts = accounts.filter((acc) => {
    const search = searchTerm.toLowerCase();

    return (
      acc.account_number?.toLowerCase().includes(search) ||
      acc.borrower_name?.toLowerCase().includes(search) ||
      acc.product_name?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#05445E]">
            Savings Accounts
          </h1>
          <p className="text-sm text-slate-500">
            View individual and group client savings portfolios
          </p>
        </div>

        <button
          onClick={openModal}
          disabled={loading || borrowers.length === 0 || products.length === 0}
          className="flex items-center gap-2 bg-[#189AB4] hover:bg-[#05445E] disabled:bg-slate-300 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-colors"
        >
          <Plus size={18} />
          Open New Account
        </button>
      </div>

      {error && !isModalOpen && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <div className="relative w-80">
            <Search
              size={18}
              className="absolute left-3.5 top-2.5 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search savings accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">
            Loading savings accounts...
          </div>
        ) : filteredAccounts.length === 0 ? (
          <div className="p-12 text-center">
            <PiggyBank className="mx-auto text-slate-300 mb-3" size={40} />
            <p className="font-semibold text-slate-600">
              No savings accounts found
            </p>
            <p className="text-sm text-slate-400 mt-1">
              Open a new savings account to get started.
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-[#05445E]/5 text-[#05445E] uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4">Account No</th>
                <th className="p-4">Account Holder</th>
                <th className="p-4">Savings Product</th>
                <th className="p-4">Current Balance</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredAccounts.map((acc) => (
                <tr
                  key={acc.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="p-4 font-mono font-bold text-[#189AB4]">
                    {acc.account_number}
                  </td>

                  <td className="p-4">
                    <button
                      type="button"
                      onClick={() => setSelectedAccount(acc)}
                      className="font-bold text-[#05445E] hover:text-[#189AB4] hover:underline transition-colors text-left"
                    >
                      {acc.borrower_name}
                    </button>
                  </td>

                  <td className="p-4 text-xs font-semibold text-slate-600">
                    {acc.product_name}
                  </td>

                  <td className="p-4 font-bold text-emerald-600">
                    {getCurrency()} {formatMoney(acc.current_balance)}
                  </td>

                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                      {acc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedAccount && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">

            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#189AB4]">
                  Savings Account Details
                </p>
                <h3 className="text-2xl font-bold text-[#05445E] mt-1">
                  {selectedAccount.borrower_name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAccount(null)}
                className="text-slate-400 hover:text-[#05445E] transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-6 space-y-5">

              <div className="bg-[#D4F1F4] rounded-xl p-5">
                <p className="text-xs font-semibold text-[#05445E] uppercase tracking-wider">
                  Current Balance
                </p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">
                  {getCurrency()} {formatMoney(selectedAccount.current_balance)}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-400 font-semibold uppercase">
                    Account Number
                  </p>
                  <p className="font-mono font-bold text-[#189AB4] mt-1">
                    {selectedAccount.account_number}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-400 font-semibold uppercase">
                    Account Status
                  </p>
                  <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                    {selectedAccount.status}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-400 font-semibold uppercase">
                    Account Holder
                  </p>
                  <p className="font-semibold text-[#05445E] mt-1">
                    {selectedAccount.borrower_name}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-400 font-semibold uppercase">
                    Savings Product
                  </p>
                  <p className="font-semibold text-slate-700 mt-1">
                    {selectedAccount.product_name}
                  </p>
                </div>

              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-400 font-semibold uppercase">
                  Account ID
                </p>
                <p className="font-mono text-xs text-slate-500 mt-1 break-all">
                  {selectedAccount.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAccount(null)}
                className="w-full bg-[#189AB4] hover:bg-[#05445E] text-white py-2.5 rounded-xl font-semibold transition-colors"
              >
                Close
              </button>

            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xl font-bold text-[#05445E] flex items-center gap-2">
                <PiggyBank className="text-[#189AB4]" size={22} />
                Open Savings Account
              </h3>

              <button
                onClick={closeModal}
                disabled={saving}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleOpenAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Select Borrower
                </label>

                <select
                  value={selectedBorrower}
                  onChange={(e) => setSelectedBorrower(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  required
                >
                  <option value="">Select borrower...</option>

                  {borrowers.map((borrower) => (
                    <option key={borrower.id} value={borrower.id}>
                      {borrower.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Savings Product
                </label>

                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  required
                >
                  <option value="">Select product...</option>

                  {products
                    .filter((product) => product.is_active)
                    .map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} ({product.code})
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Initial Deposit ({getCurrency()})
                  </label>

                  <input
                    type="number"
                    min="0"
                    required
                    value={initialDeposit}
                    onChange={(e) => setInitialDeposit(e.target.value)}
                    placeholder="100000"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Calendar size={13} className="text-[#189AB4]" />
                    Date Opened
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
                  onClick={closeModal}
                  disabled={saving}
                  className="w-1/2 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-1/2 py-2.5 bg-[#189AB4] hover:bg-[#05445E] disabled:bg-slate-300 text-white rounded-xl font-semibold transition-colors"
                >
                  {saving ? 'Opening...' : 'Open Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
