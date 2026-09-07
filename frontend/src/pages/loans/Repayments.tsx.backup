import React, { useEffect, useMemo, useState } from 'react';
import {
  Receipt,
  Plus,
  X,
  Calendar,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../../api/axios';
import { getCurrency, formatMoney } from '../../config/regional';

interface Loan {
  id: string;
  loan_number: string;
  borrower_id: string;
  principal: number;
  interest_rate: number;
  term_months: number;
  disbursement_date: string | null;
  maturity_date: string | null;
  status: string;
  borrower?: {
    first_name?: string;
    last_name?: string;
    business_name?: string;
    phone?: string;
  };
}

interface Borrower {
  id: string;
  first_name?: string;
  last_name?: string;
  business_name?: string;
  phone?: string;
  borrower_type?: string;
}

interface Payment {
  id: string;
  loanId: string;
  account: string;
  borrower: string;
  phone: string;
  method: string;
  ref: string;
  amount: number;
  paymentDate: string;
  installmentNo: number | null;
  status: string;
}

export const Repayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedLoanId, setSelectedLoanId] = useState('');
  const [method, setMethod] = useState('MTN Mobile Money');
  const [ref, setRef] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // =========================================================
  // LOAD REAL DATA
  // =========================================================

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [loansResponse, borrowersResponse, repaymentsResponse] =
        await Promise.all([
          api.get('/loans/'),
          api.get('/borrowers'),
          api.get('/repayments/'),
        ]);

      const backendLoans: Loan[] = loansResponse.data || [];
      const backendBorrowers: Borrower[] = borrowersResponse.data || [];
      const backendPayments = repaymentsResponse.data || [];

      setLoans(backendLoans);
      setBorrowers(backendBorrowers);

      if (backendLoans.length > 0) {
        setSelectedLoanId(backendLoans[0].id);
      }

      const mappedPayments: Payment[] = backendPayments.map((payment: any) => ({
        id: payment.id,
        loanId: payment.loan_id,
        account: payment.loan_number || '',
        borrower: payment.borrower || 'Unknown Borrower',
        phone: payment.phone || '',
        method: payment.method || 'Unknown',
        ref: payment.reference || '',
        amount: Number(payment.amount || 0),
        paymentDate: payment.payment_date || '',
        installmentNo: payment.installment_no ?? null,
        status: payment.status || 'Posted',
      }));

      setPayments(mappedPayments);
    } catch (err: any) {
      console.error('Failed to load repayment data:', err);

      setError(
        err?.response?.data?.detail ||
          'Unable to load repayment data from the server.'
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // SELECTED LOAN
  // =========================================================

  const selectedLoan = useMemo(
    () => loans.find((loan) => loan.id === selectedLoanId),
    [loans, selectedLoanId]
  );

  const selectedBorrower = useMemo(() => {
    if (!selectedLoan) return undefined;

    return borrowers.find(
      (borrower) => borrower.id === selectedLoan.borrower_id
    );
  }, [borrowers, selectedLoan]);

  const borrowerName = selectedBorrower
    ? selectedBorrower.business_name ||
      `${selectedBorrower.first_name || ''} ${
        selectedBorrower.last_name || ''
      }`.trim() ||
      'Unknown Borrower'
    : selectedLoan?.borrower
      ? selectedLoan.borrower.business_name ||
        `${selectedLoan.borrower.first_name || ''} ${
          selectedLoan.borrower.last_name || ''
        }`.trim()
      : 'Unknown Borrower';

  const borrowerPhone =
    selectedBorrower?.phone ||
    selectedLoan?.borrower?.phone ||
    '';

  // =========================================================
  // RECORD PAYMENT
  // =========================================================

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedLoanId) {
      setError('Please select a loan.');
      return;
    }

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      setError('Please enter a valid repayment amount.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccessMessage('');

      const response = await api.post('/repayments/', {
        loan_id: selectedLoanId,
        payment_date: paymentDate,
        amount: numericAmount,
        payment_method: method,
        reference_no: ref || null,
      });

      const result = response.data;

      setSuccessMessage(
        `Payment of ${formatMoney(
          Number(result.total_paid || numericAmount)
        )} posted successfully.`
      );

      setRef('');
      setAmount('');
      setIsModalOpen(false);

      await loadData();
    } catch (err: any) {
      console.error('Failed to post repayment:', err);

      setError(
        err?.response?.data?.detail ||
          'Unable to post repayment.'
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // TOTALS
  // =========================================================

  const totalCollected = payments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );

  const postedCount = payments.filter(
    (payment) => payment.status === 'Posted'
  ).length;

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold text-[#05445E]">
            Repayments Log
          </h1>

          <p className="text-sm text-slate-500">
            Record loan installment payments and track repayment activity
          </p>
        </div>

        <button
          onClick={() => {
            setError('');
            setSuccessMessage('');
            setIsModalOpen(true);
          }}
          disabled={loans.length === 0}
          className="flex items-center gap-2 bg-[#189AB4] hover:bg-[#05445E] disabled:bg-slate-300 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-colors"
        >
          <Plus size={18} />
          Record Payment
        </button>

      </div>

      {/* MESSAGES */}

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3">
          <AlertCircle size={20} />
          <span className="text-sm font-medium">
            {error}
          </span>

          <button
            onClick={() => setError('')}
            className="ml-auto"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3">
          <CheckCircle2 size={20} />

          <span className="text-sm font-medium">
            {successMessage}
          </span>

          <button
            onClick={() => setSuccessMessage('')}
            className="ml-auto"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* SUMMARY */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs uppercase text-slate-400 font-bold">
            Payments
          </p>

          <p className="text-2xl font-black text-[#05445E] mt-2">
            {payments.length}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs uppercase text-slate-400 font-bold">
            Collected
          </p>

          <p className="text-2xl font-black text-emerald-600 mt-2">
            {formatMoney(totalCollected)}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs uppercase text-slate-400 font-bold">
            Posted
          </p>

          <p className="text-2xl font-black text-[#189AB4] mt-2">
            {postedCount}
          </p>
        </div>

      </div>

      {/* REPAYMENT REGISTER */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

        <div className="flex items-center gap-4 p-4 bg-teal-50 border border-teal-100 rounded-xl text-teal-800 mb-5">

          <Receipt
            size={24}
            className="text-[#189AB4]"
          />

          <div>
            <h4 className="font-bold text-sm text-[#05445E]">
              Live Repayment Register
            </h4>

            <p className="text-xs text-slate-600">
              Payments below are loaded directly from the Peak Lenders backend.
            </p>
          </div>

        </div>

        {loading ? (

          <div className="flex justify-center items-center py-16 text-slate-500">

            <Loader2
              size={28}
              className="animate-spin mr-3 text-[#189AB4]"
            />

            Loading repayments...

          </div>

        ) : payments.length === 0 ? (

          <div className="text-center py-16">

            <Receipt
              size={40}
              className="mx-auto text-slate-300 mb-3"
            />

            <p className="font-semibold text-slate-600">
              No repayments recorded yet.
            </p>

            <p className="text-sm text-slate-400 mt-1">
              Record the first repayment using the button above.
            </p>

          </div>

        ) : (

          <div className="divide-y divide-slate-100">

            {payments.map((payment) => (

              <div
                key={payment.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50 px-3 rounded-xl transition-colors"
              >

                <div>

                  <p className="font-bold text-[#05445E] text-sm">

                    {payment.borrower}

                    <span className="text-[#189AB4] font-mono text-xs ml-2">
                      ({payment.account})
                    </span>

                  </p>

                  <p className="text-xs text-slate-400 mt-1">

                    Payment via

                    <span className="font-medium text-slate-600 ml-1">
                      {payment.method}
                    </span>

                    <span className="mx-2">
                      •
                    </span>

                    Ref:

                    <span className="font-mono ml-1">
                      {payment.ref || '—'}
                    </span>

                  </p>

                  {payment.installmentNo && (
                    <p className="text-xs text-slate-400 mt-1">
                      Installment #{payment.installmentNo}
                    </p>
                  )}

                </div>

                <div className="flex items-center gap-6">

                  <div className="text-right text-xs">

                    <span className="text-slate-400 block">
                      Paid:{' '}
                      <span className="font-mono text-slate-600">
                        {payment.paymentDate}
                      </span>
                    </span>

                    {payment.phone && (
                      <span className="text-slate-400 block mt-1">
                        {payment.phone}
                      </span>
                    )}

                  </div>

                  <span className="font-bold text-emerald-600 text-sm">
                    {formatMoney(Number(payment.amount))}
                  </span>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* RECORD PAYMENT MODAL */}

      {isModalOpen && (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">

          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-5">

            <div className="flex justify-between items-center border-b border-slate-100 pb-3">

              <h3 className="text-xl font-bold text-[#05445E] flex items-center gap-2">

                <Receipt
                  className="text-[#189AB4]"
                  size={22}
                />

                Record Repayment

              </h3>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={handleRecordPayment}
              className="space-y-4"
            >

              {/* LOAN */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Select Loan
                </label>

                <select
                  value={selectedLoanId}
                  onChange={(e) =>
                    setSelectedLoanId(e.target.value)
                  }
                  required
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#189AB4] font-medium text-slate-700"
                >

                  {loans.map((loan) => {

                    const borrower = borrowers.find(
                      (b) => b.id === loan.borrower_id
                    );

                    const name =
                      borrower?.business_name ||
                      `${borrower?.first_name || ''} ${
                        borrower?.last_name || ''
                      }`.trim() ||
                      'Unknown Borrower';

                    return (
                      <option
                        key={loan.id}
                        value={loan.id}
                      >
                        {name} — {loan.loan_number}
                      </option>
                    );
                  })}

                </select>

              </div>

              {/* SELECTED BORROWER */}

              {selectedLoan && (

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">

                  <p className="text-xs uppercase font-bold text-slate-400">
                    Selected Loan
                  </p>

                  <p className="font-bold text-[#05445E] mt-1">
                    {borrowerName}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {selectedLoan.loan_number}
                    {' • '}
                    Principal {formatMoney(
                      Number(selectedLoan.principal)
                    )}
                  </p>

                  {borrowerPhone && (
                    <p className="text-xs text-slate-500 mt-1">
                      {borrowerPhone}
                    </p>
                  )}

                </div>

              )}

              {/* PAYMENT METHOD */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Payment Method
                </label>

                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                >
                  <option value="MTN Mobile Money">
                    MTN Mobile Money
                  </option>

                  <option value="Airtel Money">
                    Airtel Money
                  </option>

                  <option value="Bank Transfer">
                    Bank Transfer
                  </option>

                  <option value="Cash">
                    Cash
                  </option>
                </select>

              </div>

              {/* AMOUNT / REFERENCE */}

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-1">
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
                    placeholder="171561"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  />

                </div>

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Transaction Ref
                  </label>

                  <input
                    type="text"
                    value={ref}
                    onChange={(e) =>
                      setRef(e.target.value)
                    }
                    placeholder="TXN-9921"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  />

                </div>

              </div>

              {/* PAYMENT DATE */}

              <div>

                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">

                  <Calendar
                    size={13}
                    className="text-[#189AB4]"
                  />

                  Payment Date

                </label>

                <input
                  type="date"
                  required
                  value={paymentDate}
                  onChange={(e) =>
                    setPaymentDate(e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                />

              </div>

              {/* ACTIONS */}

              <div className="flex gap-3 pt-3">

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving}
                  className="w-1/2 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || !selectedLoanId}
                  className="w-1/2 py-2.5 bg-[#189AB4] hover:bg-[#05445E] disabled:bg-slate-300 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                >

                  {saving ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Posting...
                    </>
                  ) : (
                    'Save Payment'
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};
