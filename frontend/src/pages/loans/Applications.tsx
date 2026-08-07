import React, { useState } from 'react';
import { FileText, CheckCircle2, XCircle, Clock, Search, Filter } from 'lucide-react';

interface Application {
  id: string;
  applicant: string;
  amount: string;
  term: string;
  purpose: string;
  dateSubmitted: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export const Applications = () => {
  const [applications, setApplications] = useState<Application[]>([
    { id: 'APP-1029', applicant: 'Robert Musoke', amount: 'UGX 3,500,000', term: '6 Months', purpose: 'Business Expansion', dateSubmitted: '2026-08-05', status: 'Pending' },
    { id: 'APP-1030', applicant: 'Grace Namubiru', amount: 'UGX 1,200,000', term: '3 Months', purpose: 'Stock Purchase', dateSubmitted: '2026-08-06', status: 'Pending' },
    { id: 'APP-1028', applicant: 'Nakawa Traders Group', amount: 'UGX 10,000,000', term: '12 Months', purpose: 'Group Asset Finance', dateSubmitted: '2026-08-02', status: 'Approved' },
  ]);

  const handleStatusChange = (id: string, newStatus: 'Approved' | 'Rejected') => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
  };

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-[#05445E]">Loan Applications</h1>
        <p className="text-sm text-slate-500">Review, risk-assess, and process incoming loan applications</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <div className="relative w-80">
            <Search size={18} className="absolute left-3.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search applications..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-[#05445E]/5 text-[#05445E] uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4">App ID</th>
                <th className="p-4">Applicant</th>
                <th className="p-4">Amount Requested</th>
                <th className="p-4">Term</th>
                <th className="p-4">Purpose</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-mono font-bold text-[#189AB4]">{app.id}</td>
                  <td className="p-4 font-bold text-[#05445E]">{app.applicant}</td>
                  <td className="p-4 font-bold text-slate-800">{app.amount}</td>
                  <td className="p-4 text-slate-600">{app.term}</td>
                  <td className="p-4 text-slate-500 text-xs">{app.purpose}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        app.status === 'Approved'
                          ? 'bg-teal-50 text-teal-700 border border-teal-200'
                          : app.status === 'Rejected'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {app.status === 'Pending' ? (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleStatusChange(app.id, 'Approved')}
                          className="px-3 py-1 bg-[#189AB4] hover:bg-[#05445E] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 size={14} /> Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(app.id, 'Rejected')}
                          className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
