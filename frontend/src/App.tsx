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
      <Route path="/applications" element={<Placeholder title="Applications" />} />
      <Route path="/active-loans" element={<Placeholder title="Active Loans" />} />
      <Route path="/repayments" element={<Placeholder title="Repayments" />} />
      <Route path="/collections" element={<Placeholder title="Collections" />} />
      <Route path="/write-offs" element={<Placeholder title="Write-Offs" />} />
      <Route path="/products" element={<Placeholder title="Products" />} />
      <Route path="/accounts" element={<Placeholder title="Accounts" />} />
      <Route path="/deposits" element={<Placeholder title="Deposits" />} />
      <Route path="/withdrawals" element={<Placeholder title="Withdrawals" />} />
      <Route path="/chart-of-accounts" element={<Placeholder title="Chart of Accounts" />} />
      <Route path="/journal-entries" element={<Placeholder title="Journal Entries" />} />
      <Route path="/general-ledger" element={<Placeholder title="General Ledger" />} />
      <Route path="/trial-balance" element={<Placeholder title="Trial Balance" />} />
      <Route path="/income-statement" element={<Placeholder title="Income Statement" />} />
      <Route path="/balance-sheet" element={<Placeholder title="Balance Sheet" />} />
      <Route path="/portfolio-reports" element={<Placeholder title="Portfolio Reports" />} />
      <Route path="/financial-reports" element={<Placeholder title="Financial Reports" />} />
      <Route path="/branch-reports" element={<Placeholder title="Branch Reports" />} />
      <Route path="/institution" element={<Placeholder title="Institution" />} />
      <Route path="/users-&-roles" element={<Placeholder title="Users & Roles" />} />
      <Route path="/system-settings" element={<Placeholder title="System Settings" />} />
    </Routes>
  </BrowserRouter>
);