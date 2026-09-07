import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Search,
} from 'lucide-react';

import { api } from '../../api/axios';
import { formatMoney } from "../../config/regional";

interface Application {
  id: string;
  application_number: string;
  borrower_id: string;
  branch_id?: string | null;
  loan_product_id?: string | null;
  amount: number;
  term_months: number;
  purpose?: string | null;
  status: string;
  submitted_at: string;
}

export const Applications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState('');

  const loadApplications = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/applications');

      setApplications(response.data || []);
    } catch (err: any) {
      console.error('Failed to load applications:', err);

      setError(
        err.response?.data?.detail ||
        'Failed to load loan applications.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleStatusChange = async (
    id: string,
    newStatus: 'APPROVED' | 'REJECTED'
  ) => {
    setProcessing(id);
    setError('');

    try {
      const response = await api.patch(
        `/applications/${id}/status`,
        {
          status: newStatus,
        }
      );

      setApplications((prev) =>
        prev.map((application) =>
          application.id === id
            ? response.data
            : application
        )
      );
    } catch (err: any) {
      console.error(
        'Failed to update application:',
        err
      );

      setError(
        err.response?.data?.detail ||
        'Failed to update application status.'
      );
    } finally {
      setProcessing(null);
    }
  };

  const filteredApplications = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return applications;
    }

    return applications.filter((application) =>
      [
        application.application_number,
        application.borrower_id,
        application.purpose || '',
        application.status,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }, [applications, search]);

  const formatAmount = (amount: number) => formatMoney(amount);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-GB');
  };

  const formatStatus = (status: string) => {
    if (status === 'APPROVED') return 'Approved';
    if (status === 'REJECTED') return 'Rejected';
    return 'Pending';
  };

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">

      <div>
        <h1 className="text-3xl font-bold text-[#05445E]">
          Loan Applications
        </h1>

        <p className="text-sm text-slate-500">
          Review, risk-assess, and process incoming loan applications
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-4 text-sm">
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
              placeholder="Search applications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
                <th className="p-4">Date Submitted</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {loading ? (

                <tr>
                  <td
                    colSpan={8}
                    className="p-10 text-center text-slate-400"
                  >
                    Loading applications...
                  </td>
                </tr>

              ) : filteredApplications.length === 0 ? (

                <tr>
                  <td
                    colSpan={8}
                    className="p-10 text-center text-slate-400"
                  >
                    No loan applications yet
                  </td>
                </tr>

              ) : (

                filteredApplications.map((application) => {

                  const status =
                    formatStatus(application.status);

                  return (
                    <tr
                      key={application.id}
                      className="hover:bg-slate-50 transition-colors"
                    >

                      <td className="p-4 font-mono font-bold text-[#189AB4]">
                        {application.application_number}
                      </td>

                      <td className="p-4 font-bold text-[#05445E]">
                        {application.borrower_id}
                      </td>

                      <td className="p-4 font-bold text-slate-800">
                        {formatAmount(application.amount)}
                      </td>

                      <td className="p-4 text-slate-600">
                        {application.term_months} Months
                      </td>

                      <td className="p-4 text-slate-500 text-xs">
                        {application.purpose || '—'}
                      </td>

                      <td className="p-4 text-slate-500 text-xs">
                        {formatDate(application.submitted_at)}
                      </td>

                      <td className="p-4">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            status === 'Approved'
                              ? 'bg-teal-50 text-teal-700 border border-teal-200'
                              : status === 'Rejected'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {status}
                        </span>

                      </td>

                      <td className="p-4 text-center">

                        {status === 'Pending' ? (

                          <div className="flex justify-center gap-2">

                            <button
                              disabled={processing === application.id}
                              onClick={() =>
                                handleStatusChange(
                                  application.id,
                                  'APPROVED'
                                )
                              }
                              className="px-3 py-1 bg-[#189AB4] hover:bg-[#05445E] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                            >
                              <CheckCircle2 size={14} />
                              Approve
                            </button>

                            <button
                              disabled={processing === application.id}
                              onClick={() =>
                                handleStatusChange(
                                  application.id,
                                  'REJECTED'
                                )
                              }
                              className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                            >
                              <XCircle size={14} />
                              Reject
                            </button>

                          </div>

                        ) : (

                          <span className="text-xs text-slate-400 italic">
                            Processed
                          </span>

                        )}

                      </td>

                    </tr>
                  );
                })
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};
