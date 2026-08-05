import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Notifications } from './pages/Notifications';
import { ActivityFeed } from './pages/ActivityFeed';
import { Tenants } from './pages/Tenants';
import { Branches } from './pages/Branches';
import { Users } from './pages/Users';
import { Borrowers } from './pages/Borrowers';
import { Groups } from './pages/Groups';
import { GroupDetails } from './pages/GroupDetails';
import { Guarantors } from './pages/Guarantors';
import { Applications } from './pages/Applications';
import { Loans} from './pages/Loans';
import { Repayments} from './pages/Repayments';
import { Collections} from './pages/Collections';
import { WriteOffs} from './pages/WriteOffs';
import { Products } from './pages/Products';
import { Accounts } from './pages/Accounts';
import { Deposits } from './pages/Deposits';
import { Withdrawals } from './pages/Withdrawals';
import { ChartOfAccounts } from './pages/ChartOfAccounts';
import { JournalEntries } from './pages/JournalEntries';
import { GeneralLedger } from './pages/GeneralLedger';
import { TrialBalance } from './pages/TrialBalance';
import { IncomeStatement } from './pages/IncomeStatement';
import { BalanceSheet } from './pages/BalanceSheet';
import { PortfolioReports } from './pages/PortfolioReports';
import { FinancialReports } from './pages/FinancialReports';
import { BranchReports } from './pages/BranchReports';
import { Institution } from './pages/Institution';
import { RolesPermissions } from './pages/RolesPermissions';
import { AuditTrail } from './pages/AuditTrail';
import { SystemSettings } from './pages/SystemSettings';
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex h-screen items-center justify-center font-bold text-2xl text-slate-400">
    {title} Coming Soon...
  </div>
);

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/activity-feed" element={<ActivityFeed />} />
      <Route path="/tenants" element={<Tenants />} />
      <Route path="/branches" element={<Branches />} />
      <Route element={<Users />} path="/users" />
      <Route element={<Borrowers />} path="/borrowers" />
      <Route element={<Groups />} path="/groups" />
      <Route path="/groups/:id" element={<GroupDetails />} />
      <Route path="/guarantors" element={<Guarantors />} />
      <Route path="/applications" element={<Applications />} />
      <Route path="/loans" element={<Loans />} />
      <Route path="/repayments" element={<Repayments />} />
      <Route path="/collections" element={<Collections />} />
      <Route path="/writeoffs" element={<WriteOffs />} />
      <Route path="/products" element={<Products />} />
      <Route path="/accounts" element={<Accounts />} />
      <Route path="/deposits" element={<Deposits />} />
      <Route path="/withdrawals" element={<Withdrawals />} />
      <Route path="/chart-of-accounts" element={<ChartOfAccounts />} />
      <Route path="/journal-entries" element={<JournalEntries />} />
      <Route path="/general-ledger" element={<GeneralLedger />} />
      <Route path="/trial-balance" element={<TrialBalance />} />
      <Route path="/income-statement" element={<IncomeStatement />} />
      <Route path="/balance-sheet" element={<BalanceSheet />} />
      <Route path="/portfolio-reports" element={<PortfolioReports />} />
      <Route path="/financial-reports" element={<FinancialReports />} />
      <Route path="/branch-reports" element={<BranchReports />} />
      <Route path="/institution" element={<Institution />} />
      <Route path="/branches" element={<Branches />} />
      <Route path="/tenants" element={<Tenants />} />
      <Route path="/users" element={<Users />} />
      <Route path="/roles-permissions" element={<RolesPermissions />} />
      <Route path="/audit-trail" element={<AuditTrail />} />
      <Route path="/system-settings" element={<SystemSettings />} />
    </Routes>
  </BrowserRouter>
);