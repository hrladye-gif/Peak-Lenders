import { formatMoney, getCurrency } from "../../config/regional";
import React, { useEffect, useState } from 'react';
import { api } from '../../api/axios';
import { FileSpreadsheet, Download, Calendar, DollarSign, TrendingUp, Layers } from 'lucide-react';

export const FinancialStatements = () => {
  const [statementType, setStatementType] = useState<'balance' | 'income' | 'cashflow'>('balance');
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    api.get('/accounting/reports/financial-statements')
      .then((res) => setReport(res.data))
      .catch((err) => console.error('Failed to load financial statements:', err));
  }, []);

  const amount = (value: any) => formatMoney(Number(value || 0));

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#05445E]">Financial Statements</h1>
          <p className="text-sm text-slate-500">Comprehensive MFI reporting: Balance Sheet, Income Statement, & Cash Flow</p>
        </div>
        <button className="flex items-center gap-2 bg-[#189AB4] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md hover:bg-[#05445E] transition-colors">
          <Download size={16} /> Export PDF Report
        </button>
      </div>

      {/* Statement Selector Tabs */}
      <div className="flex gap-3 border-b border-slate-200 pb-3">
        <button
          onClick={() => setStatementType('balance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            statementType === 'balance'
              ? 'bg-[#05445E] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers size={16} /> Balance Sheet (BS)
        </button>

        <button
          onClick={() => setStatementType('income')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            statementType === 'income'
              ? 'bg-[#05445E] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <TrendingUp size={16} /> Income Statement (IS)
        </button>

        <button
          onClick={() => setStatementType('cashflow')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            statementType === 'cashflow'
              ? 'bg-[#05445E] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <DollarSign size={16} /> Cash Flow Statement (CF)
        </button>
      </div>

      {/* Main Statement Display Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#189AB4]/10 rounded-xl text-[#189AB4]">
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <h2 className="font-bold text-[#05445E] text-lg">
                {statementType === 'balance' && 'Statement of Financial Position (Balance Sheet)'}
                {statementType === 'income' && 'Statement of Comprehensive Income (Profit & Loss)'}
                {statementType === 'cashflow' && 'Statement of Cash Flows'}
              </h2>
              <p className="text-xs text-slate-400">As of {new Date().toLocaleDateString()} • Reporting Currency: {getCurrency()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
            <Calendar size={14} className="text-[#189AB4]" /> Live Financial Period
          </div>
        </div>

        {/* FINANCIAL STATEMENTS */}
        {statementType === 'balance' && (
          <div className="space-y-6">
            {[
              ['Assets', report?.assets || [], 'assets'],
              ['Liabilities', report?.liabilities || [], 'liabilities'],
              ['Equity', report?.equity || [], 'equity'],
            ].map(([title, items, key]: any) => (
              <div key={key}>
                <h3 className="font-bold text-[#05445E] text-xs uppercase tracking-wider bg-slate-100 p-2.5 rounded-lg mb-3">
                  {title}
                </h3>
                <div className="space-y-2.5 text-xs text-slate-700 px-3">
                  {items.map((item: any) => (
                    <div key={item.code} className="flex justify-between">
                      <span>{item.code} - {item.name}</span>
                      <span className="font-mono font-semibold">{amount(item.amount)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold border-t border-slate-200 pt-3 text-[#05445E] text-sm">
                    <span>Total {title}</span>
                    <span className="font-mono">
                      {amount(report?.totals?.[key])}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between font-bold border-t-2 border-slate-300 pt-3 text-[#05445E] text-sm">
              <span>Total Liabilities & Equity</span>
              <span className="font-mono">
                {amount(report?.total_liabilities_equity)}
              </span>
            </div>
          </div>
        )}

        {statementType === 'income' && (
          <div className="space-y-6">
            {[
              ['Operating Revenue', report?.income || [], 'income'],
              ['Operating Expenses', report?.expenses || [], 'expenses'],
            ].map(([title, items, key]: any) => (
              <div key={key}>
                <h3 className="font-bold text-[#05445E] text-xs uppercase tracking-wider bg-slate-100 p-2.5 rounded-lg mb-3">
                  {title}
                </h3>
                <div className="space-y-2.5 text-xs text-slate-700 px-3">
                  {items.map((item: any) => (
                    <div key={item.code} className="flex justify-between">
                      <span>{item.code} - {item.name}</span>
                      <span className="font-mono font-semibold">{amount(item.amount)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold border-t border-slate-200 pt-3 text-[#05445E] text-sm">
                    <span>Total {title}</span>
                    <span className="font-mono">
                      {amount(report?.totals?.[key])}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <div className="p-4 bg-[#05445E]/5 rounded-xl flex justify-between items-center text-sm font-bold text-[#05445E]">
              <span>Net Profit / Surplus</span>
              <span className="font-mono text-base text-teal-700">
                {amount(report?.net_income)}
              </span>
            </div>
          </div>
        )}

        {statementType === 'cashflow' && (
          <div className="p-6 bg-slate-50 rounded-xl text-sm text-slate-600">
            <p className="font-semibold text-[#05445E] mb-2">
              Cash Flow Statement
            </p>
            <p>
              Cash flow reporting will be calculated from posted journal
              entries and cash/bank accounts.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
