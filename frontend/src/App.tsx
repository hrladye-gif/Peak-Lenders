import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Dashboard } from './pages/Dashboard';
import { Notifications } from './pages/Notifications';
import { ActivityFeed } from './pages/ActivityFeed';
import { BorrowerDetail } from './pages/customers/BorrowerDetail';
// Customers
import { Borrowers } from './pages/customers/Borrowers';
import { Groups } from './pages/customers/Groups';
import { GroupDetail } from './pages/customers/GroupDetail';

// Loans
import { Applications } from './pages/loans/Applications';
import { Loans } from './pages/loans/Loans';
import { LoanProducts } from './pages/loans/LoanProducts';
import { Repayments } from './pages/loans/Repayments';
import { Collections } from './pages/loans/Collections';
import { WriteOffs } from './pages/loans/WriteOffs';

// Savings
import { SavingsProducts } from './pages/savings/SavingsProducts';
import { Accounts } from './pages/savings/Accounts';
import { Deposits } from './pages/savings/Deposits';
import { Withdrawals } from './pages/savings/Withdrawals';

// Accounting
import { ChartOfAccounts } from './pages/accounting/ChartOfAccounts';
import { JournalEntries } from './pages/accounting/JournalEntries';
import { GeneralLedger } from './pages/accounting/GeneralLedger';

// Reports
import { FinancialStatements } from './pages/reports/FinancialStatements';
import { PARAndAging } from './pages/reports/PARAndAging';

// Admin
import { UsersRoles } from './pages/admin/UsersRoles';
import { Branches } from './pages/admin/Branches';
import { Settings } from './pages/admin/Settings';

// Auth
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/activity-feed" element={<ActivityFeed />} />
          
          {/* Customers */}
          <Route path="/borrowers" element={<Borrowers />} />
          <Route path="/borrowers/:borrowerId" element={<BorrowerDetail />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/:groupId" element={<GroupDetail />} />

          {/* Loans */}
          <Route path="/applications" element={<Applications />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/loan-products" element={<LoanProducts />} />
          <Route path="/repayments" element={<Repayments />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/writeoffs" element={<WriteOffs />} />

          {/* Savings */}
          <Route path="/savings/products" element={<SavingsProducts />} />
          <Route path="/savings/accounts" element={<Accounts />} />
          <Route path="/savings/deposits" element={<Deposits />} />
          <Route path="/savings/withdrawals" element={<Withdrawals />} />

          {/* Accounting */}
          <Route path="/accounting/chart-of-accounts" element={<ChartOfAccounts />} />
          <Route path="/accounting/journal" element={<JournalEntries />} />
          <Route path="/accounting/ledger" element={<GeneralLedger />} />

          {/* Reports */}
          <Route path="/reports/par-aging" element={<PARAndAging />} />
          <Route path="/reports/financial" element={<FinancialStatements />} />

          {/* Admin */}
          <Route path="/admin/users" element={<UsersRoles />} />
          <Route path="/admin/branches" element={<Branches />} />
          <Route path="/admin/settings" element={<Settings />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
