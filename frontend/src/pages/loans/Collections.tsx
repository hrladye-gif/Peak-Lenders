import React, { useState } from 'react';
import { AlertTriangle, PhoneCall, Send, X, MessageSquare, CheckCircle } from 'lucide-react';

interface OverdueAccount {
  id: string;
  borrower: string;
  account: string;
  phone: string;
  daysOverdue: number;
  balance: string;
}

export const Collections = () => {
  const [overdueList] = useState<OverdueAccount[]>([
    {
      id: '1',
      borrower: 'David Ochieng',
      account: 'LN-8750',
      phone: '+256 772 987654',
      daysOverdue: 18,
      balance: 'UGX 1,200,000',
    },
    {
      id: '2',
      borrower: 'Nakawa Traders Group',
      account: 'LN-8712',
      phone: '+256 701 445566',
      daysOverdue: 22,
      balance: 'UGX 3,400,000',
    },
  ]);

  // Modal State
  const [selectedBorrower, setSelectedBorrower] = useState<OverdueAccount | null>(null);
  const [actionType, setActionType] = useState<'sms' | 'call' | 'note'>('sms');
  const [message, setMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleOpenModal = (account: OverdueAccount) => {
    setSelectedBorrower(account);
    setMessage(`Dear ${account.borrower}, your loan repayment for ${account.account} of ${account.balance} is overdue by ${account.daysOverdue} days. Please clear it immediately to avoid penalties.`);
    setSentSuccess(false);
  };

  const handleSendAction = (e: React.FormEvent) => {
    e.preventDefault();
    setSentSuccess(true);
    setTimeout(() => {
      setSelectedBorrower(null);
      setSentSuccess(false);
    }, 1500);
  };

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-[#05445E]">Collections & Arrears</h1>
        <p className="text-sm text-slate-500">Monitor overdue loans and follow up on PAR (Portfolio at Risk) schedules</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        {/* Warning Banner */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
          <AlertTriangle size={22} className="text-amber-600 shrink-0" />
          <p className="text-xs text-amber-800 font-semibold">
            {overdueList.length} Loan accounts are currently overdue by more than 15 days. Immediate recovery action recommended.
          </p>
        </div>

        {/* List of Overdue Accounts */}
        <div className="divide-y divide-slate-100">
          {overdueList.map((item) => (
            <div key={item.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50 px-3 rounded-xl transition-colors">
              <div>
                <p className="font-bold text-[#05445E] text-base">
                  {item.borrower} <span className="text-[#189AB4] font-mono text-sm">({item.account})</span>
                </p>
                <p className="text-xs text-rose-500 font-medium mt-0.5">
                  Overdue by {item.daysOverdue} Days • Balance: {item.balance}
                </p>
              </div>

              <button
                onClick={() => handleOpenModal(item)}
                className="flex items-center gap-2 px-4 py-2 bg-[#189AB4] hover:bg-[#05445E] text-white text-xs font-semibold rounded-xl shadow-sm transition-colors w-fit"
              >
                <PhoneCall size={14} /> Contact Borrower
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Modal */}
      {selectedBorrower && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xl font-bold text-[#05445E]">Contact {selectedBorrower.borrower}</h3>
                <p className="text-xs text-slate-500">{selectedBorrower.phone} • {selectedBorrower.account}</p>
              </div>
              <button onClick={() => setSelectedBorrower(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            {sentSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle size={48} className="text-emerald-500 mx-auto animate-bounce" />
                <h4 className="font-bold text-lg text-[#05445E]">Communication Sent!</h4>
                <p className="text-xs text-slate-500">Log entry recorded for repayment recovery.</p>
              </div>
            ) : (
              <form onSubmit={handleSendAction} className="space-y-4">
                {/* Action Type Tabs */}
                <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setActionType('sms')}
                    className={`py-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
                      actionType === 'sms' ? 'bg-white text-[#05445E] shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    <MessageSquare size={13} /> SMS Reminder
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionType('call')}
                    className={`py-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
                      actionType === 'call' ? 'bg-white text-[#05445E] shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    <PhoneCall size={13} /> Log Call
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionType('note')}
                    className={`py-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
                      actionType === 'note' ? 'bg-white text-[#05445E] shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    Note
                  </button>
                </div>

                {/* Message / Details Area */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {actionType === 'sms' ? 'SMS Message Body' : actionType === 'call' ? 'Call Summary' : 'Internal Note'}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBorrower(null)}
                    className="w-1/2 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 bg-[#189AB4] hover:bg-[#05445E] text-white rounded-xl font-semibold transition-colors text-xs flex items-center justify-center gap-1.5"
                  >
                    <Send size={14} /> Send & Log
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
