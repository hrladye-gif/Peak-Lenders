import {
  Users,
  Wallet,
  Landmark,
  AlertTriangle,
  FileText,
  Receipt,
  PiggyBank,
  UserPlus
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="page">
      <div className="stats">

        <div className="stat-card">
          <Users size={15} />
          <h6>Total Borrowers</h6>
          <p>0</p>
          <small>All registered borrowers</small>
        </div>

        <div className="stat-card">
          <Wallet size={15} />
          <h6>Active Loans</h6>
          <p>0</p>
          <small>Currently active loans</small>
        </div>

        <div className="stat-card">
          <Landmark size={15} />
          <h6>Loan Portfolio</h6>
          <p>0 UGX</p>
          <small>Total portfolio value</small>
        </div>

        <div className="stat-card">
          <AlertTriangle size={15} />
          <h6>Outstanding</h6>
          <p>0 UGX</p>
          <small>Total outstanding amount</small>
        </div>

      </div>

      <div className="dashboard-grid">

        <div className="panel">

          <div className="panel-header">

            <h3>Portfolio Overview</h3>

            <select>
              <option>This Month</option>
            </select>

          </div>

          <div className="placeholder-chart">
            Chart Area
          </div>

        </div>

        <div className="panel">

          <h3>Quick Actions</h3>

          <div className="quick-actions">

            <div className="quick-action">
              <h4>New Loan Application</h4>
              <p>Create a new loan application</p>
            </div>

            <div className="quick-action">
              <h4>Record Repayment</h4>
              <p>Record a loan repayment</p>
            </div>

            <div className="quick-action">
              <h4>New Savings Account</h4>
              <p>Open a new savings account</p>
            </div>

            <div className="quick-action">
              <h4>Add New Borrower</h4>
              <p>Register a new borrower</p>
            </div>

            <div className="quick-action">
              <h4>Journal Entry</h4>
              <p>Create a journal entry</p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}