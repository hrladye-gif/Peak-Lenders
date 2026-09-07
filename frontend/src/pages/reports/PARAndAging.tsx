import { formatMoney } from "../../config/regional";
import React, { useEffect, useState } from 'react';
import { api } from '../../api/axios';
import { AlertTriangle, Download, Filter, Search, ShieldAlert, ArrowUpRight, TrendingDown } from 'lucide-react';

export const PARAndAging = () => {
  const [selectedBand, setSelectedBand] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/accounting/reports/par-aging')
      .then((res) => setReport(res.data))
      .catch((err) => console.error('Failed to load PAR report:', err))
      .finally(() => setLoading(false));
  }, []);

  const agingBands = [
    { label: 'Current (On-Time)', range: '0 Days', color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
    { label: 'PAR 1 - 30 Days', range: '1-30 Days', color: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' },
    { label: 'PAR 31 - 60 Days', range: '31-60 Days', color: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-50' },
    { label: 'PAR 61 - 90 Days', range: '61-90 Days', color: 'bg-rose-500', text: 'text-rose-700', bg: 'bg-rose-50' },
    { label: 'PAR 90+ Days (Default)', range: '90+ Days', color: 'bg-red-700', text: 'text-red-800', bg: 'bg-red-50' },
  ];

  const loans = report?.loans || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAR 1-30':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'PAR 31-60':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'PAR 61-90':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'PAR 90+':
        return 'bg-red-100 text-red-900 border-red-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#05445E]">Portfolio at Risk (PAR) & Aging</h1>
          <p className="text-sm text-slate-500">Loan portfolio quality breakdown, delinquency tracking & aging buckets</p>
        </div>
        <button className="flex items-center gap-2 bg-[#189AB4] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md hover:bg-[#05445E] transition-colors">
          <Download size={16} /> Export Aging Report
        </button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Outstanding Portfolio</p>
          <p className="text-2xl font-bold text-[#05445E]">{formatMoney(Number(report?.total_outstanding || 0))}</p>
          <span className="text-xs text-slate-500 font-medium">{report?.total_loans || 0} Total Active Loans</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex justify-between items-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total PAR (&gt;30 Days)</p>
            <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg"><AlertTriangle size={16} /></span>
          </div>
          <p className="text-2xl font-bold text-rose-600">{Number(report?.par_percentage || 0).toFixed(1)}%</p>
          <span className="text-xs text-rose-600 font-semibold flex items-center gap-1">
            <TrendingDown size={14} /> {formatMoney(Number(report?.total_overdue || 0))} at risk
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex justify-between items-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">PAR &gt;30 Days</p>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg"><ShieldAlert size={16} /></span>
          </div>
          <p className="text-2xl font-bold text-amber-600">
            {Number(report?.par30_percentage || 0).toFixed(1)}%
          </p>
          <span className="text-xs text-slate-500 font-medium">
            {formatMoney(Number(report?.par30_overdue || 0))} over 30 days
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recorded Loss Provision</p>
          <p className="text-2xl font-bold text-[#05445E]">
            {formatMoney(Number(report?.recorded_provision || 0))}
          </p>
          <span className="text-xs text-slate-500 font-medium">
            Posted to account 5100
          </span>
        </div>
      </div>

      {/* Portfolio Aging Buckets */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="font-bold text-[#05445E] text-base">Portfolio Aging Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {agingBands.map((band, idx) => (
            <div key={idx} className={`${band.bg} p-4 rounded-xl border border-slate-100 space-y-2`}>
              <div className="flex justify-between items-center text-xs">
                <span className={`font-bold ${band.text}`}>{band.label}</span>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-800">
                  {formatMoney(
                    Number(
                      report?.aging_totals?.[
                        band.range === '0 Days' ? 'Current' :
                        band.range === '1-30 Days' ? 'PAR 1-30' :
                        band.range === '31-60 Days' ? 'PAR 31-60' :
                        band.range === '61-90 Days' ? 'PAR 61-90' : 'PAR 90+'
                      ] || 0
                    )
                  )}
                </p>
                <p className="text-xs text-slate-500 font-semibold">
                  {report?.total_outstanding
                    ? (
                        Number(
                          report?.aging_totals?.[
                            band.range === '0 Days' ? 'Current' :
                            band.range === '1-30 Days' ? 'PAR 1-30' :
                            band.range === '31-60 Days' ? 'PAR 31-60' :
                            band.range === '61-90 Days' ? 'PAR 61-90' : 'PAR 90+'
                          ] || 0
                        )
                        / Number(report.total_outstanding) * 100
                      ).toFixed(1)
                    : '0.0'}% of Portfolio
                </p>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div className={`${band.color} h-1.5 rounded-full`} style={{
                  width: `${
                    report?.total_outstanding
                      ? (
                          loans
                            .filter((loan: any) => loan.band === (
                              band.range === '0 Days' ? 'Current' :
                              band.range === '1-30 Days' ? 'PAR 1-30' :
                              band.range === '31-60 Days' ? 'PAR 31-60' :
                              band.range === '61-90 Days' ? 'PAR 61-90' : 'PAR 90+'
                            ))
                            .reduce((sum: number, loan: any) => sum + Number(loan.outstanding || 0), 0)
                          / Number(report.total_outstanding) * 100
                        ).toFixed(1)
                      : 0
                  }%`
                }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delinquent Loan Accounts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h2 className="font-bold text-[#05445E] text-lg">Delinquent Loan Register</h2>
            <p className="text-xs text-slate-400">Detailed list of loans currently past due</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search borrower or loan ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#189AB4] w-64"
              />
            </div>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
              <Filter size={14} className="text-slate-400" />
              <select
                value={selectedBand}
                onChange={(e) => setSelectedBand(e.target.value)}
                className="bg-transparent focus:outline-none text-slate-700 font-medium"
              >
                <option value="all">All PAR Bands</option>
                <option value="PAR 1-30">PAR 1 - 30 Days</option>
                <option value="PAR 31-60">PAR 31 - 60 Days</option>
                <option value="PAR 61-90">PAR 61 - 90 Days</option>
                <option value="PAR 90+">PAR 90+ Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                <th className="p-3 font-bold">Loan ID</th>
                <th className="p-3 font-bold">Borrower Name</th>
                <th className="p-3 font-bold">Product Type</th>
                <th className="p-3 font-bold">Loan Officer</th>
                <th className="p-3 font-bold text-right">Outstanding Principal</th>
                <th className="p-3 font-bold text-right">Overdue Amount</th>
                <th className="p-3 font-bold text-center">Days Overdue</th>
                <th className="p-3 font-bold text-center">Aging Band</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    Loading PAR report...
                  </td>
                </tr>
              ) : loans
                .filter((loan: any) =>
                  `${loan.loan_id} ${loan.borrower_name || ''}`
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .filter((loan: any) =>
                  selectedBand === 'all' || loan.band === selectedBand
                )
                .map((loan: any) => (
                <tr key={loan.loan_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-mono font-bold text-[#05445E]">{loan.loan_id}</td>
                  <td className="p-3 font-semibold text-slate-800">{loan.borrower_name || 'Unknown borrower'}</td>
                  <td className="p-3 text-slate-500">{loan.product_name || 'Unknown product'}</td>
                  <td className="p-3 text-slate-500">{loan.loan_officer || 'Not assigned'}</td>
                  <td className="p-3 font-mono text-right font-semibold">{formatMoney(Number(loan.outstanding || 0))}</td>
                  <td className="p-3 font-mono text-right font-bold text-rose-600">{formatMoney(Number(loan.overdue || 0))}</td>
                  <td className="p-3 font-mono text-center font-bold text-amber-700">{loan.days_overdue} days</td>
                  <td className="p-3 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(loan.status)}`}>
                      {loan.band}
                    </span>
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
