import React, { useState } from 'react';
import { Receipt, Plus, X, Calendar } from 'lucide-react';

interface Payment {
  id: string;
  borrower: string;
  account: string;
  method: string;
  ref: string;
  amount: string;
  paymentDate: string;
  nextDueDate: string;
}

export const Repayments = () => {
  // Pre-populated borrower/group options for the filter dropdown
  const availableBorrowers = [
    { id: 'b1', name: 'Robert Musoke', account: 'LN-8801', type: 'Individual' },
    { id: 'b2', name: 'Grace Namubiru', account: 'LN-8802', type: 'Individual' },
    { id: 'b3', name: 'Josephine K.', account: 'LN-8803', type: 'Individual' },
    { id: 'g1', name: 'Nakawa Traders SACCO Group', account: 'LN-9001', type: 'Group' },
    { id: 'g2', name: 'Wandegeya Women Farmers', account: 'LN-8799', type: 'Group' },
  ];

  const [payments, setPayments] = useState<Payment[]>([
    {
      id: '1',
      borrower: 'Robert Musoke',
      account: 'LN-8801',
      method: 'MTN Mobile Money',
      ref: 'TXN-9921',
      amount: 'UGX 450,000',
      paymentDate: '2026-08-05',
      nextDueDate: '2026-09-05',
    },
    {
      id: '2',
      borrower: 'Grace Namubiru',
      account: 'LN-8802',
      method: 'Bank Transfer',
      ref: 'BK-4011',
      amount: 'UGX 250,000',
      paymentDate: '2026-08-01',
      nextDueDate: '2026-09-01',
    },
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBorrower, setSelectedBorrower] = useState(availableBorrowers[0].name);
  const [method, setMethod] = useState('MTN Mobile Money');
  const [ref, setRef] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('2026-08-07');
  const [nextDueDate, setNextDueDate] = useState('2026-09-07');

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBorrower || !amount) return;

    // Auto-detect matching loan account ID
    const borrowerObj = availableBorrowers.find((b) => b.name === selectedBorrower);
    const accountId = borrowerObj ? borrowerObj.account : 'LN-8800';

    const newPayment: Payment = {
      id: Date.now().toString(),
      borrower: selectedBorrower,
      account: accountId,
      method,
      ref: ref || `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      amount: `UGX ${Number(amount).toLocaleString()}`,
      paymentDate,
      nextDueDate,
    };

    setPayments([newPayment, ...payments]);
    setRef('');
    setAmount('');
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#05445E]">Repayments Log</h1>
          <p className="text-sm text-slate-500">Record loan installment payments and track schedule updates</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#189AB4] hover:bg-[#05445E] text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-colors"
        >
          <Plus size={18} />
          Record Payment
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-4 p-4 bg-teal-50 border border-teal-100 rounded-xl text-teal-800">
          <Receipt size={24} className="text-[#189AB4]" />
          <div>
            <h4 className="font-bold text-sm text-[#05445E]">Quick Repayment Entry</h4>
            <p className="text-xs text-slate-600">
              Register mobile money, cash, or bank deposit payments for individual borrowers or groups.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {payments.map((p) => (
            <div
              key={p.id}
              className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-2 hover:bg-slate-50 px-3 rounded-xl transition-colors"
            >
              <div>
                <p className="font-bold text-[#05445E] text-sm">
                  {p.borrower} <span className="text-[#189AB4] font-mono text-xs">({p.account})</span>
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Payment via <span className="font-medium text-slate-600">{p.method}</span> • Ref: {p.ref}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right text-xs">
                  <span className="text-slate-400 block">Paid: <span className="font-mono text-slate-600">{p.paymentDate}</span></span>
                  <span className="text-slate-400 block">Next Due: <span className="font-mono text-slate-600">{p.nextDueDate}</span></span>
                </div>
                <span className="font-bold text-emerald-600 text-sm">{p.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Record Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xl font-bold text-[#05445E] flex items-center gap-2">
                <Receipt className="text-[#189AB4]" size={22} /> Record Repayment
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4">
              {/* Borrower / Group Select Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Select Borrower / Group
                </label>
                <select
                  value={selectedBorrower}
                  onChange={(e) => setSelectedBorrower(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#189AB4] font-medium text-slate-700"
                >
                  <optgroup label="Individual Borrowers">
                    {availableBorrowers
                      .filter((b) => b.type === 'Individual')
                      .map((b) => (
                        <option key={b.id} value={b.name}>
                          👤 {b.name} ({b.account})
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Borrower Groups">
                    {availableBorrowers
                      .filter((b) => b.type === 'Group')
                      .map((b) => (
                        <option key={b.id} value={b.name}>
                          👥 {b.name} ({b.account})
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>

              {/* Payment Method */}
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

              {/* Amount & Transaction Ref */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Amount (UGX)</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="450000"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Transaction Ref</label>
                  <input
                    type="text"
                    value={ref}
                    onChange={(e) => setRef(e.target.value)}
                    placeholder="TXN-9921"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  />
                </div>
              </div>

              {/* Payment Date & Next Due Date Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Calendar size={13} className="text-[#189AB4]" /> Payment Date
                  </label>
                  <input
                    type="date"
                    required
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Calendar size={13} className="text-[#189AB4]" /> Next Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={nextDueDate}
                    onChange={(e) => setNextDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
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
                  Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
