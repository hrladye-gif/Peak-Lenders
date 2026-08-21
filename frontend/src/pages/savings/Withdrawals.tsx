import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Plus, X, Calendar, RefreshCw } from 'lucide-react';

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

interface Withdrawal {
  id: string;
  savings_account_id: string;
  accountNo: string;
  holder: string;
  amount: number;
  reference_no?: string | null;
  date: string;
}

export const Withdrawals = () => {
  const [accounts, setAccounts] = useState<SavingsAccount[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Cash Teller');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [ref, setRef] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);

      const [accountsResponse, transactionsResponse] = await Promise.all([
        api.get('/savings/accounts'),
        api.get('/savings/transactions', {
          params: { tx_type: 'WITHDRAWAL' },
        }),
      ]);

      const fetchedAccounts: SavingsAccount[] = accountsResponse.data || [];

      setAccounts(fetchedAccounts);

      const accountMap = new Map(
        fetchedAccounts.map((account) => [
          account.id,
          account,
        ])
      );

      const mappedWithdrawals: Withdrawal[] = (
        transactionsResponse.data || []
      ).map((tx: any) => {
        const account = accountMap.get(tx.savings_account_id);

        return {
          id: tx.id,
          savings_account_id: tx.savings_account_id,
          accountNo: account?.account_number || 'Unknown',
          holder: account?.borrower_name || 'Unknown',
          amount: Number(tx.amount || 0),
          reference_no: tx.reference_no,
          date: tx.transaction_time
            ? new Date(tx.transaction_time).toISOString().split('T')[0]
            : '',
        };
      });

      setWithdrawals(mappedWithdrawals);
    } catch (err) {
      console.error('Failed to load savings withdrawals:', err);
      setError('Failed to load savings withdrawals.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = () => {
    setError('');
    setSuccessMessage('');
    setAmount('');
    setRef('');

    if (!selectedAccount && accounts.length > 0) {
      setSelectedAccount(accounts[0].id);
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (!processing) {
      setIsModalOpen(false);
      setError('');
    }
  };

  const handleRecordWithdrawal = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!selectedAccount) {
      setError('Please select a savings account.');
      return;
    }

    const withdrawalAmount = Number(amount);

    if (!withdrawalAmount || withdrawalAmount <= 0) {
      setError('Enter a valid withdrawal amount.');
      return;
    }

    const account = accounts.find(
      (a) => a.id === selectedAccount
    );

    if (!account) {
      setError('Savings account not found.');
      return;
    }

    if (withdrawalAmount > Number(account.current_balance || 0)) {
      setError(
        `Insufficient funds. Available balance is ${formatMoney(
          Number(account.current_balance || 0)
        )}.`
      );
      return;
    }

    try {
      setProcessing(true);
      setError('');
      setSuccessMessage('');

      const reference =
        ref.trim() ||
        `${method.replace(/\s+/g, '-').toUpperCase()}-${Date.now()}`;

      await api.post('/savings/withdrawals', {
        savings_account_id: selectedAccount,
        amount: withdrawalAmount,
        reference_no: reference,
      });

      setIsModalOpen(false);
      setAmount('');
      setRef('');

      setSuccessMessage(
        `Withdrawal of ${formatMoney(
          withdrawalAmount
        )} processed successfully.`
      );

      await fetchData();

      setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
    } catch (err: any) {
      console.error('Failed to process withdrawal:', err);

      setError(
        err?.response?.data?.detail ||
          'Failed to process withdrawal. Please try again.'
      );
    } finally {
      setProcessing(false);
    }
  };

  const selectedAccountData = accounts.find(
    (a) => a.id === selectedAccount
  );

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#05445E]">
            Savings Withdrawals
          </h1>

          <p className="text-sm text-slate-500">
            Authorize and process client savings payout requests
          </p>
        </div>

        <button
          onClick={openModal}
          disabled={accounts.length === 0}
          className="flex items-center gap-2 bg-[#189AB4] hover:bg-[#05445E] disabled:bg-slate-300 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-colors"
        >
          <Plus size={18} />
          Process Withdrawal
        </button>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl">
          {successMessage}
        </div>
      )}

      {error && !isModalOpen && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="font-bold text-[#05445E]">
              Withdrawal Transactions
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Recorded savings withdrawals
            </p>
          </div>

          <button
            onClick={fetchData}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
            title="Refresh"
          >
            <RefreshCw size={17} />
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">
            Loading withdrawals...
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="p-12 text-center">
            <ArrowUpRight
              size={40}
              className="mx-auto text-slate-300 mb-3"
            />

            <p className="font-semibold text-slate-600">
              No withdrawals recorded
            </p>

            <p className="text-sm text-slate-400 mt-1">
              Process a withdrawal to see it here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-[#05445E]/5 text-[#05445E] uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Account Holder</th>
                  <th className="p-4">Account No</th>
                  <th className="p-4">Reference</th>
                  <th className="p-4">Withdrawal Date</th>
                  <th className="p-4 text-right">Amount</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {withdrawals.map((w) => (
                  <tr
                    key={w.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4 font-bold text-[#05445E]">
                      {w.holder}
                    </td>

                    <td className="p-4 font-mono text-xs text-[#189AB4] font-bold">
                      {w.accountNo}
                    </td>

                    <td className="p-4 font-mono text-xs text-slate-500">
                      {w.reference_no || '—'}
                    </td>

                    <td className="p-4 font-mono text-xs text-slate-500">
                      {w.date}
                    </td>

                    <td className="p-4 text-right font-bold text-rose-600">
                      - {formatMoney(w.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xl font-bold text-[#05445E] flex items-center gap-2">
                <ArrowUpRight
                  className="text-rose-600"
                  size={22}
                />
                Process Savings Payout
              </h3>

              <button
                onClick={closeModal}
                disabled={processing}
                className="text-slate-400 hover:text-slate-600 disabled:opacity-50"
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
              onSubmit={handleRecordWithdrawal}
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
                  disabled={processing}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  required
                >
                  {accounts.map((account) => (
                    <option
                      key={account.id}
                      value={account.id}
                    >
                      {account.borrower_name} (
                      {account.account_number}) — Balance:{' '}
                      {formatMoney(
                        Number(account.current_balance || 0)
                      )}
                    </option>
                  ))}
                </select>
              </div>

              {selectedAccountData && (
                <div className="bg-[#D4F1F4] rounded-xl p-3">
                  <p className="text-xs text-[#05445E] font-semibold">
                    Available Balance
                  </p>

                  <p className="text-lg font-bold text-[#05445E]">
                    {formatMoney(
                      Number(
                        selectedAccountData.current_balance || 0
                      )
                    )}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Payout Channel
                </label>

                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  disabled={processing}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                >
                  <option value="Cash Teller">
                    Cash Teller
                  </option>
                  <option value="MTN Mobile Money">
                    MTN Mobile Money Payout
                  </option>
                  <option value="Airtel Money">
                    Airtel Money Payout
                  </option>
                  <option value="Bank Transfer">
                    Bank Transfer
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
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="50000"
                    disabled={processing}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Reference
                  </label>

                  <input
                    type="text"
                    value={ref}
                    onChange={(e) => setRef(e.target.value)}
                    placeholder="Optional"
                    disabled={processing}
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
                  Withdrawal Date
                </label>

                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={processing}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={processing}
                  className="w-1/2 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={processing || accounts.length === 0}
                  className="w-1/2 py-2.5 bg-[#189AB4] hover:bg-[#05445E] text-white rounded-xl font-semibold transition-colors disabled:bg-slate-300"
                >
                  {processing
                    ? 'Processing...'
                    : 'Authorize Payout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
