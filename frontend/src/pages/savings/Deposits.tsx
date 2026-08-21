import React, { useEffect, useState } from 'react';
import { ArrowDownLeft, Plus, X, Calendar } from 'lucide-react';

import { getCurrency, formatMoney } from "../../config/regional";
import { api } from "../../api/axios";

interface SavingsAccount {
  id: string;
  account_number: string;
  borrower_name: string;
  product_name: string;
  current_balance: number;
  status: string;
}

interface Transaction {
  id: string;
  savings_account_id: string;
  transaction_type: string;
  amount: number;
  reference_no?: string;
  transaction_time?: string;
}

export const Deposits = () => {
  const [accounts, setAccounts] = useState<SavingsAccount[]>([]);
  const [deposits, setDeposits] = useState<Transaction[]>([]);
  const [selectedDeposit, setSelectedDeposit] = useState<Transaction | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('MTN Mobile Money');
  const [ref, setRef] = useState('');
  const [date, setDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const [accountsResponse, transactionsResponse] =
        await Promise.all([
          api.get('/savings/accounts'),
          api.get('/savings/transactions?tx_type=DEPOSIT'),
        ]);

      setAccounts(accountsResponse.data);
      setDeposits(transactionsResponse.data);
    } catch (err: any) {
      console.error('Failed to load savings deposits:', err);

      setError(
        err?.response?.data?.detail ||
          'Failed to load savings deposits.'
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
    setSelectedAccount(accounts[0]?.id || '');
    setAmount('');
    setRef('');
    setMethod('MTN Mobile Money');
    setDate(new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (!saving) {
      setIsModalOpen(false);
      setError('');
    }
  };

  const getAccount = (accountId: string) =>
    accounts.find((account) => account.id === accountId);

  const handleRecordDeposit = async (e: React.FormEvent) => {
    e.preventDefault();

    const depositAmount = Number(amount);

    if (!selectedAccount) {
      setError('Please select a savings account.');
      return;
    }

    if (!depositAmount || depositAmount <= 0) {
      setError('Enter a valid deposit amount.');
      return;
    }

    try {
      setSaving(true);
      setError('');

      await api.post('/savings/deposits', {
        savings_account_id: selectedAccount,
        amount: depositAmount,
        reference_no:
          ref.trim() ||
          `DEP-${Date.now()}`,
      });

      setIsModalOpen(false);

      await fetchData();
    } catch (err: any) {
      console.error('Failed to record deposit:', err);

      setError(
        err?.response?.data?.detail ||
          'Failed to record deposit. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#05445E]">
            Savings Deposits
          </h1>

          <p className="text-sm text-slate-500">
            Record cash deposits, mobile money transfers, and standing orders
          </p>
        </div>

        <button
          onClick={openModal}
          disabled={loading || accounts.length === 0}
          className="flex items-center gap-2 bg-[#189AB4] hover:bg-[#05445E] disabled:bg-slate-300 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-colors"
        >
          <Plus size={18} />
          Record Deposit
        </button>
      </div>

      {error && !isModalOpen && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">
            Loading deposits...
          </div>
        ) : deposits.length === 0 ? (
          <div className="p-12 text-center">
            <ArrowDownLeft
              className="mx-auto text-slate-300 mb-3"
              size={40}
            />

            <p className="font-semibold text-slate-600">
              No deposits recorded
            </p>

            <p className="text-sm text-slate-400 mt-1">
              Record the first savings deposit to get started.
            </p>
          </div>
        ) : (
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
              {deposits.map((deposit) => {
                const account = getAccount(
                  deposit.savings_account_id
                );

                return (
                  <tr
                    key={deposit.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => setSelectedDeposit(deposit)}
                        className="font-bold text-[#05445E] hover:text-[#189AB4] hover:underline transition-colors text-left"
                      >
                        {account?.borrower_name || 'Unknown'}
                      </button>
                    </td>

                    <td className="p-4 font-mono text-xs text-[#189AB4] font-bold">
                      {account?.account_number || 'Unknown'}
                    </td>

                    <td className="p-4 text-xs text-slate-600">
                      {deposit.reference_no?.startsWith('MM-')
                        ? 'MTN Mobile Money'
                        : 'Savings Deposit'}
                    </td>

                    <td className="p-4 font-mono text-xs text-slate-500">
                      {deposit.reference_no || '—'}
                    </td>

                    <td className="p-4 font-mono text-xs text-slate-500">
                      {deposit.transaction_time
                        ? new Date(
                            deposit.transaction_time
                          ).toLocaleDateString()
                        : '—'}
                    </td>

                    <td className="p-4 text-right font-bold text-emerald-600">
                      + {getCurrency()} {formatMoney(deposit.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {selectedDeposit && (() => {
        const account = getAccount(selectedDeposit.savings_account_id);

        return (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">

              <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#189AB4]">
                    Deposit Details
                  </p>
                  <h3 className="text-2xl font-bold text-[#05445E] mt-1">
                    {account?.borrower_name || 'Unknown'}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedDeposit(null)}
                  className="text-slate-400 hover:text-[#05445E] transition-colors"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="p-6 space-y-5">

                <div className="bg-[#D4F1F4] rounded-xl p-5">
                  <p className="text-xs font-semibold text-[#05445E] uppercase tracking-wider">
                    Deposit Amount
                  </p>
                  <p className="text-3xl font-bold text-emerald-600 mt-1">
                    + {getCurrency()} {formatMoney(selectedDeposit.amount)}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-400 font-semibold uppercase">
                      Account Number
                    </p>
                    <p className="font-mono font-bold text-[#189AB4] mt-1">
                      {account?.account_number || 'Unknown'}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-400 font-semibold uppercase">
                      Account Status
                    </p>
                    <p className="font-bold text-[#05445E] mt-1">
                      {account?.status || 'Unknown'}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-400 font-semibold uppercase">
                      Savings Product
                    </p>
                    <p className="font-semibold text-slate-700 mt-1">
                      {account?.product_name || 'Unknown'}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-400 font-semibold uppercase">
                      Current Balance
                    </p>
                    <p className="font-bold text-[#05445E] mt-1">
                      {getCurrency()} {formatMoney(account?.current_balance || 0)}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-400 font-semibold uppercase">
                      Transaction Type
                    </p>
                    <p className="font-bold text-emerald-600 mt-1">
                      {selectedDeposit.transaction_type}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-400 font-semibold uppercase">
                      Payment Method
                    </p>
                    <p className="font-semibold text-slate-700 mt-1">
                      {selectedDeposit.reference_no?.startsWith('MM-')
                        ? 'MTN Mobile Money'
                        : 'Savings Deposit'}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-400 font-semibold uppercase">
                      Reference Number
                    </p>
                    <p className="font-mono font-semibold text-slate-700 mt-1">
                      {selectedDeposit.reference_no || '—'}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-400 font-semibold uppercase">
                      Deposit Date
                    </p>
                    <p className="font-semibold text-slate-700 mt-1">
                      {selectedDeposit.transaction_time
                        ? new Date(selectedDeposit.transaction_time).toLocaleDateString()
                        : '—'}
                    </p>
                  </div>

                </div>

                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs text-slate-400 font-semibold uppercase">
                    Transaction ID
                  </p>
                  <p className="font-mono text-xs text-slate-500 mt-1 break-all">
                    {selectedDeposit.id}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedDeposit(null)}
                  className="w-full bg-[#189AB4] hover:bg-[#05445E] text-white py-2.5 rounded-xl font-semibold transition-colors"
                >
                  Close
                </button>

              </div>
            </div>
          </div>
        );
      })()}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-5">

            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xl font-bold text-[#05445E] flex items-center gap-2">
                <ArrowDownLeft
                  className="text-emerald-600"
                  size={22}
                />

                Record Savings Deposit
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

            <form
              onSubmit={handleRecordDeposit}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Select Savings Account
                </label>

                <select
                  value={selectedAccount}
                  onChange={(e) =>
                    setSelectedAccount(e.target.value)
                  }
                  required
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                >
                  <option value="">
                    Select account...
                  </option>

                  {accounts
                    .filter(
                      (account) =>
                        account.status === 'ACTIVE'
                    )
                    .map((account) => (
                      <option
                        key={account.id}
                        value={account.id}
                      >
                        {account.borrower_name} (
                        {account.account_number})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Payment Method
                </label>

                <select
                  value={method}
                  onChange={(e) =>
                    setMethod(e.target.value)
                  }
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                >
                  <option value="MTN Mobile Money">
                    MTN Mobile Money
                  </option>

                  <option value="Airtel Money">
                    Airtel Money
                  </option>

                  <option value="Bank Deposit">
                    Bank Deposit
                  </option>

                  <option value="Cash Teller">
                    Cash Teller
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Amount ({getCurrency()})
                  </label>

                  <input
                    type="number"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) =>
                      setAmount(e.target.value)
                    }
                    placeholder="200000"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Reference / Receipt
                  </label>

                  <input
                    type="text"
                    value={ref}
                    onChange={(e) =>
                      setRef(e.target.value)
                    }
                    placeholder="MM-9012"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Calendar
                    size={13}
                    className="text-[#189AB4]"
                  />

                  Deposit Date
                </label>

                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) =>
                    setDate(e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                />
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
                  {saving ? 'Processing...' : 'Confirm Deposit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
