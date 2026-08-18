import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";
import { getCurrency, formatMoney } from "../config/regional";

export const Loans = () => {
  const [search, setSearch] = useState("");

  const [loans, setLoans] = useState(() => {
    const saved = localStorage.getItem("active-loans");

    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "LN-0001",
            borrower: "John Doe",
            phone: "+256700000001",
            branch: "Kampala",
            product: "Business Loan",
            currency: getCurrency(),
            amount: 5000000,
            balance: 4200000,
            installment: 470000,
            nextDue: "15 Aug 2026",
            officer: "Sarah",
            risk: "Low",
            status: "Current",
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem("active-loans", JSON.stringify(loans));
  }, [loans]);

  const filtered = useMemo(() => {
    return loans.filter((l: any) =>
      Object.values(l)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [loans, search]);

  const totalPortfolio = loans.reduce(
    (a: number, b: any) => a + Number(b.balance),
    0
  );

  const totalDisbursed = loans.reduce(
    (a: number, b: any) => a + Number(b.amount),
    0
  );

  const Stat = ({
    title,
    value,
    color,
    icon,
  }: any) => (
    <div className="bg-white rounded-3xl border border-blue-100 shadow-sm p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs uppercase font-bold text-slate-500">
            {title}
          </p>

          <h2 className={`text-4xl font-black mt-3 ${color}`}>
            {value}
          </h2>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50">

      <Sidebar />

      <div className="flex-1 overflow-y-auto p-8">

        <div className="flex justify-between items-center mb-8">

          <div>

            <h1 className="text-4xl font-black">
              Active Loans
            </h1>

            <p className="text-slate-500">
              Monitor all disbursed loans
            </p>

          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2">

            <Lucide.Download size={18} />

            Export Portfolio

          </button>

        </div>

        <div className="grid grid-cols-5 gap-5 mb-8">

          <Stat
            title="Active Loans"
            value={loans.length}
            color="text-blue-600"
            icon={<Lucide.Briefcase />}
          />

          <Stat
            title="Portfolio"
            value={totalPortfolio.toLocaleString()}
            color="text-green-600"
            icon={<Lucide.Banknote />}
          />

          <Stat
            title="Disbursed"
            value={totalDisbursed.toLocaleString()}
            color="text-purple-600"
            icon={<Lucide.Wallet />}
          />

          <Stat
            title="Current"
            value={loans.filter((l:any)=>l.status==="Current").length}
            color="text-emerald-600"
            icon={<Lucide.CheckCircle />}
          />

          <Stat
            title="At Risk"
            value={loans.filter((l:any)=>l.risk!=="Low").length}
            color="text-red-600"
            icon={<Lucide.AlertTriangle />}
          />

        </div>

        <div className="bg-white rounded-3xl border border-blue-100 shadow-sm overflow-hidden">

          <div className="p-6 border-b flex justify-between items-center">

            <div>

              <h2 className="text-xl font-black">
                Loan Portfolio
              </h2>

              <p className="text-sm text-slate-500">
                Search and manage active loans
              </p>

            </div>

            <div className="relative">

              <Lucide.Search
                className="absolute left-3 top-3 text-slate-400"
                size={18}
              />

              <input
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                placeholder="Search..."
                className="pl-10 pr-4 py-3 rounded-xl border w-80"
              />

            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50 text-xs uppercase text-slate-500">

                <tr>

                  <th className="p-4 text-left">Loan No</th>

                  <th className="p-4 text-left">Borrower</th>

                  <th className="p-4 text-left">Branch</th>

                  <th className="p-4 text-left">Product</th>

                  <th className="p-4 text-left">Amount</th>

                  <th className="p-4 text-left">Outstanding</th>

                  <th className="p-4 text-left">Installment</th>

                  <th className="p-4 text-left">Next Due</th>

                  <th className="p-4 text-left">Officer</th>

                  <th className="p-4 text-left">Risk</th>

                  <th className="p-4 text-left">Status</th>

                  <th className="p-4 text-left"></th>

                </tr>

              </thead>

              <tbody>

                {filtered.map((loan:any)=>(

                  <tr
                    key={loan.id}
                    className="border-t hover:bg-blue-50"
                  >

                    <td className="p-4 font-mono">
                      {loan.id}
                    </td>

                    <td className="p-4">

                      <div className="font-bold text-blue-700">
                        {loan.borrower}
                      </div>

                      <div className="text-xs text-slate-500">
                        {loan.phone}
                      </div>

                    </td>

                    <td className="p-4">
                      {loan.branch}
                    </td>

                    <td className="p-4">
                      {loan.product}
                    </td>

                    <td className="p-4 font-bold">
                      {loan.currency} {loan.amount.toLocaleString()}
                    </td>

                    <td className="p-4 font-bold text-red-600">
                      {loan.currency} {loan.balance.toLocaleString()}
                    </td>

                    <td className="p-4">
                      {loan.currency} {loan.installment.toLocaleString()}
                    </td>

                    <td className="p-4">
                      {loan.nextDue}
                    </td>

                    <td className="p-4">
                      {loan.officer}
                    </td>

                    <td className="p-4">

                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        loan.risk==="Low"
                        ? "bg-green-100 text-green-700"
                        : loan.risk==="Medium"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                      }`}>
                        {loan.risk}
                      </span>

                    </td>

                    <td className="p-4">

                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                        {loan.status}
                      </span>

                    </td>

                    <td className="p-4">

                      <button className="text-blue-600 font-bold flex items-center gap-1">

                        <Lucide.Eye size={16}/>

                        View

                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
};
