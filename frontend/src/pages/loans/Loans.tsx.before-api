import React, { useState } from 'react';
import { Plus, Wallet, FileText, Calendar, ArrowUpRight, X, ChevronRight, AlertCircle, Percent, Download, CheckCircle2 } from 'lucide-react';

interface MonthlyPerformance {
  month: string;
  beginningBalance: number;
  interestAccrued: number;
  penalty: number;
  paymentMade: number;
  endingBalance: number;
}

interface LoanItem {
  id: string;
  loanId: string;
  borrowerName: string;
  principal: number;
  remainingBalance: number;
  issueDate: string;
  dueDate: string;
  status: 'Active' | 'Fully Paid' | 'Overdue';
  interestType: 'Flat Rate' | 'Reducing Balance' | 'Compound Interest' | 'Zero Interest';
  interestRate: number;
  performance: MonthlyPerformance[];
}

export const Loans = () => {
  const [loans, setLoans] = useState<LoanItem[]>([
    {
      id: '1',
      loanId: 'LN-8801',
      borrowerName: 'Robert Musoke',
      principal: 5000000,
      remainingBalance: 2100000,
      issueDate: '2026-07-01',
      dueDate: '2027-01-01',
      status: 'Active',
      interestType: 'Reducing Balance',
      interestRate: 5,
      performance: [
        { month: 'July 2026', beginningBalance: 5000000, interestAccrued: 225000, penalty: 0, paymentMade: 1000000, endingBalance: 4225000 },
        { month: 'August 2026', beginningBalance: 4225000, interestAccrued: 190125, penalty: 0, paymentMade: 1500000, endingBalance: 2915125 },
        { month: 'September 2026', beginningBalance: 2915125, interestAccrued: 131180, penalty: 0, paymentMade: 946305, endingBalance: 2100000 },
      ]
    },
    {
      id: '2',
      loanId: 'LN-8802',
      borrowerName: 'Grace Namubiru',
      principal: 2500000,
      remainingBalance: 800000,
      issueDate: '2026-06-15',
      dueDate: '2026-07-15',
      status: 'Overdue',
      interestType: 'Flat Rate',
      interestRate: 4,
      performance: [
        { month: 'June 2026', beginningBalance: 2500000, interestAccrued: 125000, penalty: 0, paymentMade: 1000000, endingBalance: 1625000 },
        { month: 'July 2026', beginningBalance: 1625000, interestAccrued: 81250, penalty: 25000, paymentMade: 931250, endingBalance: 800000 },
      ]
    },
    {
      id: '3',
      loanId: 'LN-8799',
      borrowerName: 'Wandegeya Women Farmers',
      principal: 8500000,
      remainingBalance: 0,
      issueDate: '2026-01-10',
      dueDate: '2026-07-10',
      status: 'Fully Paid',
      interestType: 'Compound Interest',
      interestRate: 6,
      performance: [
        { month: 'January 2026', beginningBalance: 8500000, interestAccrued: 425000, penalty: 0, paymentMade: 1500000, endingBalance: 7425000 },
        { month: 'February 2026', beginningBalance: 7425000, interestAccrued: 371250, penalty: 0, paymentMade: 1500000, endingBalance: 6296250 },
      ]
    }
  ]);

  const [registeredBorrowersAndGroups] = useState<string[]>([
    'Robert Musoke',
    'Grace Namubiru',
    'Wandegeya Women Farmers',
    'Sarah Kigozi',
    'Kampala Boda SACCO',
    'John Okello',
    'Nakawa Traders Group'
  ]);

  const [selectedStatement, setSelectedStatement] = useState<LoanItem | null>(null);
  const [isStatementOpen, setIsStatementOpen] = useState(false);
  const [isDisburseOpen, setIsDisburseOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [exportNotification, setExportNotification] = useState('');

  // Disburse Form States
  const [borrowerName, setBorrowerName] = useState(registeredBorrowersAndGroups[0]);
  const [principal, setPrincipal] = useState('');
  const [interestType, setInterestType] = useState<'Flat Rate' | 'Reducing Balance' | 'Compound Interest' | 'Zero Interest'>('Reducing Balance');
  const [interestRate, setInterestRate] = useState('5');
  const [durationMonths, setDurationMonths] = useState('6');

  // Auto-check and roll dates for overdue loans on load
  React.useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setLoans(prevLoans => prevLoans.map(loan => {
      if (loan.status === 'Active' && loan.dueDate < today) {
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        return {
          ...loan,
          status: 'Overdue',
          issueDate: today,
          dueDate: nextMonth.toISOString().split('T')[0]
        };
      }
      return loan;
    }));
  }, []);

  const openStatement = (loan: LoanItem) => {
    setSelectedStatement(loan);
    setIsStatementOpen(true);
  };

  const handleDisburseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!borrowerName || !principal) return;

    const parsedPrincipal = parseFloat(principal);
    const parsedRate = parseFloat(interestRate) || 0;
    const today = new Date();
    const dueDateObj = new Date();
    dueDateObj.setMonth(dueDateObj.getMonth() + parseInt(durationMonths || '6'));

    const newLoanId = `LN-${Math.floor(1000 + Math.random() * 9000)}`;

    const newLoanItem: LoanItem = {
      id: Date.now().toString(),
      loanId: newLoanId,
      borrowerName,
      principal: parsedPrincipal,
      remainingBalance: parsedPrincipal,
      issueDate: today.toISOString().split('T')[0],
      dueDate: dueDateObj.toISOString().split('T')[0],
      status: 'Active',
      interestType,
      interestRate: parsedRate,
      performance: [
        {
          month: today.toLocaleString('default', { month: 'long', year: 'numeric' }),
          beginningBalance: parsedPrincipal,
          interestAccrued: Math.round(parsedPrincipal * (parsedRate / 100)),
          penalty: 0,
          paymentMade: 0,
          endingBalance: parsedPrincipal
        }
      ]
    };

    setLoans([newLoanItem, ...loans]);
    setIsDisburseOpen(false);
    setSuccessMessage(`Loan ${newLoanId} successfully disbursed to ${borrowerName}!`);

    // Reset Form
    setPrincipal('');
    setInterestRate('5');
    setInterestType('Reducing Balance');
    setDurationMonths('6');

    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleExportCSV = () => {
    if (!selectedStatement) return;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `Loan Statement - ${selectedStatement.borrowerName} (${selectedStatement.loanId})\r\n`;
    csvContent += `Interest Type,${selectedStatement.interestType} (${selectedStatement.interestRate}%)\r\n`;
    csvContent += `Principal,${selectedStatement.principal}\r\n`;
    csvContent += `Remaining Balance,${selectedStatement.remainingBalance}\r\n\r\n`;
    csvContent += "Month,Start Balance,Interest Accrued,Penalty,Payment Made,Ending Balance\r\n";

    selectedStatement.performance.forEach(row => {
      csvContent += `${row.month},${row.beginningBalance},${row.interestAccrued},${row.penalty},${row.paymentMade},${row.endingBalance}\r\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedStatement.loanId}_statement.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotification('Statement exported successfully as CSV!');
    setTimeout(() => setExportNotification(''), 4000);
  };

  return (
    <div className="p-8 w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Disbursed Loans</h1>
          <p className="text-xs text-slate-500 mt-1">Monitor running portfolios, schedule timelines, and monthly performance breakdown.</p>
        </div>
        <button 
          onClick={() => setIsDisburseOpen(true)}
          className="flex items-center gap-2 bg-[#05445E] hover:bg-[#032d3f] text-white px-4 py-2.5 rounded-xl font-medium text-xs shadow-md transition-all cursor-pointer"
        >
          <Plus size={16} /> Disburse New Loan
        </button>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs flex items-center gap-2 shadow-sm">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <th className="py-3 px-6">Loan ID</th>
              <th className="py-3 px-6">Borrower / Group</th>
              <th className="py-3 px-6">Interest Scheme & Rate</th>
              <th className="py-3 px-6">Principal</th>
              <th className="py-3 px-6">Remaining Balance</th>
              <th className="py-3 px-6">Issue Date</th>
              <th className="py-3 px-6">Due Date</th>
              <th className="py-3 px-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {loans.map((loan) => (
              <tr key={loan.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-4 px-6 font-mono font-bold text-[#189AB4]">{loan.loanId}</td>
                <td className="py-4 px-6">
                  <button 
                    onClick={() => openStatement(loan)}
                    className="font-bold text-slate-800 hover:text-[#189AB4] flex items-center gap-1 transition-colors cursor-pointer text-left"
                  >
                    {loan.borrowerName} <ArrowUpRight size={12} className="text-slate-400" />
                  </button>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium text-[10px]">
                    <Percent size={10} /> {loan.interestType} ({loan.interestRate}%)
                  </span>
                </td>
                <td className="py-4 px-6 font-medium">UGX {loan.principal.toLocaleString()}</td>
                <td className="py-4 px-6 font-bold text-slate-900">UGX {loan.remainingBalance.toLocaleString()}</td>
                <td className="py-4 px-6 text-slate-500 font-mono">{loan.issueDate}</td>
                <td className="py-4 px-6 text-slate-500 font-mono">{loan.dueDate}</td>
                <td className="py-4 px-6">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    loan.status === 'Fully Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    loan.status === 'Overdue' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    'bg-sky-50 text-sky-700 border border-sky-200'
                  }`}>
                    {loan.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Disburse New Loan Modal */}
      {isDisburseOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#05445E]/10 text-[#05445E] flex items-center justify-center">
                  <Wallet size={18} />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Disburse New Loan</h3>
              </div>
              <button 
                onClick={() => setIsDisburseOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleDisburseSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Borrower / Group Name (Select from registry) *</label>
                <select
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                >
                  {registeredBorrowersAndGroups.map((nameOption, idx) => (
                    <option key={idx} value={nameOption}>{nameOption}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Principal Amount (UGX) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 3000000"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Interest Rate Scheme *</label>
                <select
                  value={interestType}
                  onChange={(e: any) => setInterestType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                >
                  <option value="Flat Rate">Flat Rate</option>
                  <option value="Reducing Balance">Reducing Balance</option>
                  <option value="Compound Interest">Compound Interest</option>
                  <option value="Zero Interest">Zero Interest</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Interest Rate (%) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="e.g. 5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration (Months) *</label>
                  <select
                    value={durationMonths}
                    onChange={(e) => setDurationMonths(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  >
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                    <option value="12">12 Months</option>
                    <option value="24">24 Months</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDisburseOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#05445E] hover:bg-[#032d3f] text-white rounded-xl font-medium shadow-md transition-all cursor-pointer"
                >
                  Confirm & Disburse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Statement & Monthly Growth Performance Modal */}
      {isStatementOpen && selectedStatement && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800 text-sm">{selectedStatement.borrowerName}'s Statement</h3>
                  <span className="font-mono text-[10px] bg-[#189AB4]/10 text-[#05445E] px-2 py-0.5 rounded font-bold">
                    {selectedStatement.loanId}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">Comprehensive single-sheet monthly loan growth and performance audit</p>
              </div>
              <button 
                onClick={() => setIsStatementOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
              {exportNotification && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-xl text-xs flex items-center gap-2">
                  <span>{exportNotification}</span>
                </div>
              )}

              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <span className="text-slate-400 uppercase font-bold text-[10px] block">Original Principal</span>
                  <span className="font-bold text-slate-800 text-sm mt-1 block">UGX {selectedStatement.principal.toLocaleString()}</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <span className="text-slate-400 uppercase font-bold text-[10px] block">Current Balance</span>
                  <span className="font-bold text-rose-600 text-sm mt-1 block">UGX {selectedStatement.remainingBalance.toLocaleString()}</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <span className="text-slate-400 uppercase font-bold text-[10px] block">Interest Scheme & Rate</span>
                  <span className="font-bold text-[#05445E] text-sm mt-1 block">{selectedStatement.interestType} ({selectedStatement.interestRate}%)</span>
                </div>
              </div>

              {/* Monthly Performance Growth Breakdown Sheet */}
              <div>
                <h4 className="font-bold text-slate-800 text-xs mb-3 uppercase tracking-wider">Monthly Loan Growth & Performance Breakdown</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">
                        <th className="py-2.5 px-4">Month</th>
                        <th className="py-2.5 px-4">Start Balance</th>
                        <th className="py-2.5 px-4">Interest Accrued</th>
                        <th className="py-2.5 px-4">Penalty</th>
                        <th className="py-2.5 px-4">Payment Made</th>
                        <th className="py-2.5 px-4">Ending Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                      {selectedStatement.performance.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-sans font-bold text-slate-700">{row.month}</td>
                          <td className="py-3 px-4">UGX {row.beginningBalance.toLocaleString()}</td>
                          <td className="py-3 px-4 text-emerald-600">+UGX {row.interestAccrued.toLocaleString()}</td>
                          <td className="py-3 px-4 text-rose-600">+UGX {row.penalty.toLocaleString()}</td>
                          <td className="py-3 px-4 text-sky-600">-UGX {row.paymentMade.toLocaleString()}</td>
                          <td className="py-3 px-4 font-bold text-slate-900">UGX {row.endingBalance.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer with Export Action */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 bg-[#189AB4] hover:bg-[#137a90] text-white px-4 py-2 rounded-xl font-medium transition-colors cursor-pointer"
              >
                <Download size={14} /> Export Statement (CSV)
              </button>
              <button
                onClick={() => setIsStatementOpen(false)}
                className="px-4 py-2 bg-[#05445E] text-white rounded-xl font-medium hover:bg-[#032d3f] transition-colors cursor-pointer"
              >
                Close Statement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loans;
