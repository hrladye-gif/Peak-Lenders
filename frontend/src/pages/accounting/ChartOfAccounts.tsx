import { formatMoney } from "../../config/regional";
import React, { useEffect, useState } from 'react';
import { api } from '../../api/axios';
import {
  Plus,
  Search,
  FolderTree,
  X,
  Pencil,
  Trash2,
  Eye,
  ArrowLeft,
  BookOpen,
} from 'lucide-react';

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

interface Transaction {
  id: string;
  date: string;
  reference_no?: string;
  description?: string;
  debit: number;
  credit: number;
  running_balance: number;
}

export const ChartOfAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] =
    useState<'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense'>('Asset');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAccounts = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/accounting/accounts');

      const mapped = response.data.map((account: any) => ({
        id: account.id,
        code: account.account_code,
        name: account.account_name,
        category: account.account_type,
        type: account.account_type,
        description: account.description || '',
        balance: formatMoney(Number(account.balance || 0)),
        status: account.status === 'Active' ? 'Active' : 'Inactive',
      }));

      setAccounts(mapped);
      setFilteredAccounts(mapped);
    } catch (err: any) {
      console.error('Failed to load accounts:', err);
      setError(
        err.response?.data?.detail ||
        'Failed to load chart of accounts.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    const q = search.trim().toLowerCase();

    if (!q) {
      setFilteredAccounts(accounts);
      return;
    }

    setFilteredAccounts(
      accounts.filter(
        (account) =>
          account.code.toLowerCase().includes(q) ||
          account.name.toLowerCase().includes(q) ||
          account.category.toLowerCase().includes(q) ||
          account.description.toLowerCase().includes(q)
      )
    );
  }, [search, accounts]);

  const resetForm = () => {
    setCode('');
    setName('');
    setDescription('');
    setCategory('Asset');
    setEditingAccount(null);
  };

  const openAddModal = () => {
    resetForm();
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (account: Account) => {
    setEditingAccount(account);
    setCode(account.code);
    setName(account.name);
    setDescription(account.description || '');
    setCategory(account.category);
    setError('');
    setIsModalOpen(true);
  };

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim() || !name.trim()) {
      setError('GL code and account name are required.');
      return;
    }

    try {
      setError('');

      const payload = {
        account_code: code.trim(),
        account_name: name.trim(),
        account_type: category,
        description: description.trim() || null,
      };

      if (editingAccount) {
        await api.put(
          `/accounting/accounts/${editingAccount.id}`,
          payload
        );
      } else {
        await api.post('/accounting/accounts', payload);
      }

      setIsModalOpen(false);
      resetForm();
      await loadAccounts();

      if (selectedAccount) {
        await openAccountDetails(selectedAccount.id);
      }
    } catch (err: any) {
      console.error('Failed to save account:', err);
      setError(
        err.response?.data?.detail ||
        'Failed to save account.'
      );
    }
  };

  const handleDelete = async (account: Account) => {
    const confirmed = window.confirm(
      `Delete "${account.name}" (${account.code})?\n\nThis cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setError('');

      await api.delete(`/accounting/accounts/${account.id}`);

      if (selectedAccount?.id === account.id) {
        setSelectedAccount(null);
        setTransactions([]);
      }

      await loadAccounts();
    } catch (err: any) {
      console.error('Failed to delete account:', err);
      setError(
        err.response?.data?.detail ||
        'Failed to delete account.'
      );
    }
  };

  const openAccountDetails = async (accountId: string) => {
    try {
      setLoadingDetails(true);
      setError('');

      const [accountResponse, transactionResponse] = await Promise.all([
        api.get(`/accounting/accounts/${accountId}`),
        api.get(`/accounting/accounts/${accountId}/transactions`),
      ]);

      const accountData = accountResponse.data;

      setSelectedAccount({
        id: accountData.id,
        code: accountData.account_code,
        name: accountData.account_name,
        category: accountData.account_type,
        type: accountData.account_type,
        description: accountData.description || '',
        balance: formatMoney(Number(accountData.balance || 0)),
        status: accountData.status === 'Active' ? 'Active' : 'Inactive',
      });

      setTransactions(transactionResponse.data || []);
    } catch (err: any) {
      console.error('Failed to load account details:', err);
      setError(
        err.response?.data?.detail ||
        'Failed to load account details.'
      );
    } finally {
      setLoadingDetails(false);
    }
  };

  const categoryColors = {
    Asset: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Liability: 'bg-amber-50 text-amber-700 border-amber-200',
    Equity: 'bg-purple-50 text-purple-700 border-purple-200',
    Income: 'bg-blue-50 text-blue-700 border-blue-200',
    Expense: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  if (selectedAccount) {
    return (
      <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => {
                setSelectedAccount(null);
                setTransactions([]);
              }}
              className="flex items-center gap-2 text-sm font-semibold text-[#189AB4] hover:text-[#05445E] mb-3"
            >
              <ArrowLeft size={17} />
              Back to Chart of Accounts
            </button>

            <h1 className="text-3xl font-bold text-[#05445E]">
              {selectedAccount.name}
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Complete GL account details and transaction history
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => openEditModal(selectedAccount)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[#05445E] font-semibold hover:bg-slate-50"
            >
              <Pencil size={16} />
              Edit
            </button>

            <button
              onClick={() => handleDelete(selectedAccount)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-700"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase">GL Code</p>
            <p className="text-xl font-bold text-[#189AB4] mt-2 font-mono">
              {selectedAccount.code}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase">Category</p>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full border text-sm font-semibold ${categoryColors[selectedAccount.category]}`}>
              {selectedAccount.category}
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase">Balance</p>
            <p className="text-xl font-bold text-slate-800 mt-2">
              {selectedAccount.balance}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase">Status</p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold bg-teal-50 text-teal-700 border border-teal-200">
              {selectedAccount.status}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-[#05445E] mb-2">
            Account Description
          </h2>

          <p className="text-sm text-slate-600">
            {selectedAccount.description || 'No description provided.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center gap-2">
            <BookOpen size={19} className="text-[#189AB4]" />
            <h2 className="text-lg font-bold text-[#05445E]">
              Transaction History
            </h2>
          </div>

          {loadingDetails ? (
            <div className="p-8 text-center text-slate-500">
              Loading account transactions...
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No transactions recorded for this account.
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-[#05445E]/5 text-[#05445E] uppercase text-[11px] font-bold">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Reference</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 text-right">Debit</th>
                  <th className="p-4 text-right">Credit</th>
                  <th className="p-4 text-right">Balance</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50">
                    <td className="p-4 text-xs text-slate-500">
                      {tx.date}
                    </td>
                    <td className="p-4 font-mono text-xs font-semibold text-[#189AB4]">
                      {tx.reference_no || '-'}
                    </td>
                    <td className="p-4 text-sm text-slate-700">
                      {tx.description || '-'}
                    </td>
                    <td className="p-4 text-right font-semibold text-emerald-700">
                      {tx.debit > 0 ? formatMoney(tx.debit) : '-'}
                    </td>
                    <td className="p-4 text-right font-semibold text-rose-700">
                      {tx.credit > 0 ? formatMoney(tx.credit) : '-'}
                    </td>
                    <td className="p-4 text-right font-bold text-slate-800">
                      {formatMoney(tx.running_balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Edit modal */}
        {isModalOpen && (
          <AccountModal
            editingAccount={editingAccount}
            code={code}
            name={name}
            description={description}
            category={category}
            setCode={setCode}
            setName={setName}
            setDescription={setDescription}
            setCategory={setCategory}
            onClose={() => {
              setIsModalOpen(false);
              resetForm();
            }}
            onSubmit={handleSaveAccount}
            error={error}
          />
        )}
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#05445E]">
            Chart of Accounts
          </h1>
          <p className="text-sm text-slate-500">
            Master financial ledger classification for MFI operations
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#189AB4] hover:bg-[#05445E] text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-colors"
        >
          <Plus size={18} />
          Add Account
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm">
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  Loading accounts...
                </td>
              </tr>
            ) : filteredAccounts.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  No GL accounts found.
                </td>
              </tr>
            ) : (
              filteredAccounts.map((acc) => (
                <tr
                  key={acc.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="p-4 font-mono font-bold text-[#189AB4]">
                    {acc.code}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => openAccountDetails(acc.id)}
                      className="font-bold text-[#05445E] hover:text-[#189AB4] hover:underline text-left"
                    >
                      {acc.name}
                    </button>
                  </td>

                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${categoryColors[acc.category]}`}>
                      {acc.category}
                    </span>
                  </td>

                  <td
                    className="p-4 text-xs text-slate-500 max-w-xs truncate"
                    title={acc.description}
                  >
                    {acc.description || 'No description'}
                  </td>

                  <td className="p-4 text-right font-bold text-slate-800">
                    {acc.balance}
                  </td>

                  <td className="p-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-teal-50 text-teal-700 border border-teal-200">
                      {acc.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex justify-center gap-1">
                      <button
                        title="View account"
                        onClick={() => openAccountDetails(acc.id)}
                        className="p-2 rounded-lg text-[#189AB4] hover:bg-cyan-50"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        title="Edit account"
                        onClick={() => openEditModal(acc)}
                        className="p-2 rounded-lg text-[#05445E] hover:bg-slate-100"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        title="Delete account"
                        onClick={() => handleDelete(acc)}
                        className="p-2 rounded-lg text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <AccountModal
          editingAccount={editingAccount}
          code={code}
          name={name}
          description={description}
          category={category}
          setCode={setCode}
          setName={setName}
          setDescription={setDescription}
          setCategory={setCategory}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          onSubmit={handleSaveAccount}
          error={error}
        />
      )}
    </div>
  );
};


function AccountModal({
  editingAccount,
  code,
  name,
  description,
  category,
  setCode,
  setName,
  setDescription,
  setCategory,
  onClose,
  onSubmit,
  error,
}: any) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-5">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-xl font-bold text-[#05445E] flex items-center gap-2">
            <FolderTree className="text-[#189AB4]" size={22} />
            {editingAccount ? 'Edit GL Account' : 'Add GL Account'}
          </h3>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-3 py-2 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                GL Code
              </label>

              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Account Name
            </label>

            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description
            </label>

            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this account is used for..."
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#189AB4] resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 text-xs"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-1/2 py-2.5 bg-[#189AB4] hover:bg-[#05445E] text-white rounded-xl font-semibold text-xs"
            >
              {editingAccount ? 'Save Changes' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
