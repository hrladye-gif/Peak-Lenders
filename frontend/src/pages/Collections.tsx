import { useEffect, useMemo, useState } from "react";
import * as Lucide from "lucide-react";
import { api } from "../api/axios";
import { formatMoney } from "../config/regional";

type CollectionCase = {
  id: string;
  loan_id: string;
  borrower_id: string;
  loanNo: string;
  borrower: string;
  phone?: string | null;
  branch?: string | null;
  officer?: string | null;
  arrears: number;
  days: number;
  action: string;
  outcome?: string | null;
  nextVisit?: string | null;
  status: string;
};

type CollectionSummary = {
  total_due: number;
  total_paid: number;
  overdue_amount: number;
  overdue_count: number;
};

type FormState = {
  loanNo: string;
  action: string;
  outcome: string;
  notes: string;
  nextVisit: string;
};

const severity = (days: number) => {
  if (days >= 90) {
    return {
      label: "Critical",
      className: "bg-red-100 text-red-700 border-red-200",
      icon: <Lucide.AlertTriangle size={14} />,
    };
  }

  if (days >= 60) {
    return {
      label: "Severe",
      className: "bg-orange-100 text-orange-700 border-orange-200",
      icon: <Lucide.AlertCircle size={14} />,
    };
  }

  if (days >= 30) {
    return {
      label: "High",
      className: "bg-amber-100 text-amber-700 border-amber-200",
      icon: <Lucide.Clock3 size={14} />,
    };
  }

  return {
    label: "Early",
    className: "bg-sky-100 text-sky-700 border-sky-200",
    icon: <Lucide.Info size={14} />,
  };
};

export const Collections = () => {
  const [collections, setCollections] = useState<CollectionCase[]>([]);
  const [summary, setSummary] = useState<CollectionSummary>({
    total_due: 0,
    total_paid: 0,
    overdue_amount: 0,
    overdue_count: 0,
  });

  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CollectionCase | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState<FormState>({
    loanNo: "",
    action: "Phone Call",
    outcome: "",
    notes: "",
    nextVisit: "",
  });

  const getTenantId = (): string | null => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) return null;

    try {
      const user = JSON.parse(storedUser);
      return user?.tenant_id || null;
    } catch {
      return null;
    }
  };

  const loadCollections = async () => {
    setLoading(true);
    setError("");

    try {
      const tenantId = getTenantId();

      if (!tenantId) {
        throw new Error(
          "Your login session does not contain a tenant ID. Please log out and log in again."
        );
      }

      const [casesResponse, summaryResponse] = await Promise.all([
        api.get(`/collections/${tenantId}`),
        api.get(`/collections/summary/${tenantId}`),
      ]);

      setCollections(casesResponse.data || []);
      setSummary(
        summaryResponse.data || {
          total_due: 0,
          total_paid: 0,
          overdue_amount: 0,
          overdue_count: 0,
        }
      );
    } catch (err: any) {
      console.error("Failed to load collections:", err);

      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to load collections."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return collections.filter((item) => {
      const matchesSearch =
        !query ||
        [
          item.id,
          item.loanNo,
          item.borrower,
          item.phone,
          item.branch,
          item.officer,
          item.action,
          item.outcome,
          item.status,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query);

      const itemSeverity = severity(item.days).label;

      const matchesSeverity =
        severityFilter === "All" || itemSeverity === severityFilter;

      return matchesSearch && matchesSeverity;
    });
  }, [collections, search, severityFilter]);

  const openCollection = (item?: CollectionCase) => {
    setError("");
    setSuccess("");

    if (item) {
      setSelectedCase(item);

      setForm({
        loanNo: item.loanNo,
        action: item.action || "Phone Call",
        outcome: item.outcome || "",
        notes: "",
        nextVisit: item.nextVisit || "",
      });
    } else {
      setSelectedCase(null);

      setForm({
        loanNo: "",
        action: "Phone Call",
        outcome: "",
        notes: "",
        nextVisit: "",
      });
    }

    setShowModal(true);
  };

  const saveCollection = async () => {
    setError("");
    setSuccess("");

    const tenantId = getTenantId();

    if (!tenantId) {
      setError("No tenant ID found. Please log in again.");
      return;
    }

    if (!form.loanNo.trim()) {
      setError("Please select an overdue loan.");
      return;
    }

    const matchingCase =
      selectedCase ||
      collections.find(
        (item) =>
          item.loanNo.toLowerCase() === form.loanNo.trim().toLowerCase()
      );

    if (!matchingCase) {
      setError("The selected loan is not in the current collection register.");
      return;
    }

    if (!form.action.trim()) {
      setError("Collection action is required.");
      return;
    }

    try {
      setSaving(true);

      await api.post(`/collections/${tenantId}/activities`, {
        loan_id: matchingCase.loan_id,
        borrower_id: matchingCase.borrower_id,
        action: form.action,
        outcome: form.outcome.trim() || null,
        notes: form.notes.trim() || null,
        next_visit: form.nextVisit || null,
        status: "Pending",
      });

      setShowModal(false);
      setSelectedCase(null);

      setForm({
        loanNo: "",
        action: "Phone Call",
        outcome: "",
        notes: "",
        nextVisit: "",
      });

      setSuccess("Collection activity recorded successfully.");

      await loadCollections();
    } catch (err: any) {
      console.error("Failed to save collection activity:", err);

      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to record collection activity."
      );
    } finally {
      setSaving(false);
    }
  };

  const recoveryRate =
    summary.total_due > 0
      ? Math.min((summary.total_paid / summary.total_due) * 100, 100)
      : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6 lg:p-8 max-w-[1800px] mx-auto">

        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-2xl bg-[#05445E] flex items-center justify-center shadow-sm">
                <Lucide.HandCoins className="text-white" size={22} />
              </div>

              <div>
                <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                  Collections
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Manage overdue loans and recovery activities
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={loadCollections}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:border-[#189AB4] hover:text-[#05445E] transition disabled:opacity-50"
            >
              <Lucide.RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              onClick={() => openCollection()}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#05445E] hover:bg-[#032d3d] text-white font-bold shadow-sm transition"
            >
              <Lucide.Plus size={18} />
              Record Activity
            </button>
          </div>
        </div>

        {/* ALERTS */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            <Lucide.AlertCircle size={20} className="mt-0.5 shrink-0" />
            <div className="font-medium">{error}</div>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700">
            <Lucide.CheckCircle2 size={20} className="mt-0.5 shrink-0" />
            <div className="font-medium">{success}</div>
          </div>
        )}

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500 font-black">
                  Collection Cases
                </p>

                <p className="text-3xl font-black text-slate-900 mt-3">
                  {summary.overdue_count.toLocaleString()}
                </p>

                <p className="text-sm text-slate-500 mt-2">
                  Active overdue installments
                </p>
              </div>

              <div className="w-11 h-11 rounded-2xl bg-[#E8F7FA] flex items-center justify-center">
                <Lucide.BriefcaseBusiness
                  size={21}
                  className="text-[#189AB4]"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500 font-black">
                  Overdue Amount
                </p>

                <p className="text-2xl lg:text-3xl font-black text-red-600 mt-3">
                  {formatMoney(summary.overdue_amount)}
                </p>

                <p className="text-sm text-slate-500 mt-2">
                  Current outstanding arrears
                </p>
              </div>

              <div className="w-11 h-11 rounded-2xl bg-red-50 flex items-center justify-center">
                <Lucide.TriangleAlert
                  size={21}
                  className="text-red-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500 font-black">
                  Amount Paid
                </p>

                <p className="text-2xl lg:text-3xl font-black text-[#05445E] mt-3">
                  {formatMoney(summary.total_paid)}
                </p>

                <p className="text-sm text-slate-500 mt-2">
                  Payments recorded to date
                </p>
              </div>

              <div className="w-11 h-11 rounded-2xl bg-[#E8F7FA] flex items-center justify-center">
                <Lucide.BadgeCheck
                  size={21}
                  className="text-[#189AB4]"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="w-full">
                <p className="text-xs uppercase tracking-wider text-slate-500 font-black">
                  Recovery Progress
                </p>

                <div className="flex items-end gap-2 mt-3">
                  <p className="text-3xl font-black text-[#05445E]">
                    {recoveryRate.toFixed(1)}%
                  </p>

                  <span className="text-sm text-slate-500 mb-1">
                    collected
                  </span>
                </div>

                <div className="mt-3 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#189AB4] rounded-full transition-all"
                    style={{ width: `${recoveryRate}%` }}
                  />
                </div>
              </div>

              <div className="w-11 h-11 rounded-2xl bg-[#E8F7FA] flex items-center justify-center shrink-0">
                <Lucide.TrendingUp
                  size={21}
                  className="text-[#189AB4]"
                />
              </div>
            </div>
          </div>

        </div>

        {/* REGISTER */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="p-5 lg:p-6 border-b border-slate-200">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Collection Register
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Live overdue accounts requiring recovery action
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">

                <div className="relative">
                  <Lucide.Search
                    size={17}
                    className="absolute left-3.5 top-3.5 text-slate-400"
                  />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search borrower, loan, branch..."
                    className="w-full sm:w-80 pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#189AB4]/30 focus:border-[#189AB4] text-sm"
                  />
                </div>

                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#189AB4]/30"
                >
                  <option value="All">All Severity</option>
                  <option value="Early">Early</option>
                  <option value="High">High</option>
                  <option value="Severe">Severe</option>
                  <option value="Critical">Critical</option>
                </select>

              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center text-slate-500">
              <Lucide.Loader2
                size={30}
                className="animate-spin text-[#189AB4] mb-3"
              />
              <p className="font-semibold">
                Loading collection register...
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-14 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-3xl bg-[#E8F7FA] flex items-center justify-center mb-4">
                <Lucide.ShieldCheck
                  size={30}
                  className="text-[#189AB4]"
                />
              </div>

              <h3 className="text-lg font-black text-slate-900">
                {collections.length === 0
                  ? "No overdue collection cases"
                  : "No matching cases"}
              </h3>

              <p className="text-sm text-slate-500 mt-2 max-w-md">
                {collections.length === 0
                  ? "There are currently no overdue installments requiring collection action."
                  : "Try changing your search or severity filter."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1200px]">

                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-4 text-left text-[11px] uppercase tracking-wider text-slate-500 font-black">
                      Case
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] uppercase tracking-wider text-slate-500 font-black">
                      Borrower
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] uppercase tracking-wider text-slate-500 font-black">
                      Loan
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] uppercase tracking-wider text-slate-500 font-black">
                      Branch
                    </th>

                    <th className="px-5 py-4 text-right text-[11px] uppercase tracking-wider text-slate-500 font-black">
                      Arrears
                    </th>

                    <th className="px-5 py-4 text-center text-[11px] uppercase tracking-wider text-slate-500 font-black">
                      Aging
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] uppercase tracking-wider text-slate-500 font-black">
                      Last Action
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] uppercase tracking-wider text-slate-500 font-black">
                      Outcome
                    </th>

                    <th className="px-5 py-4 text-center text-[11px] uppercase tracking-wider text-slate-500 font-black">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-[11px] uppercase tracking-wider text-slate-500 font-black">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filtered.map((item) => {
                    const level = severity(item.days);

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/80 transition"
                      >

                        <td className="px-5 py-5">
                          <span className="font-mono text-xs font-bold text-[#05445E]">
                            {item.id}
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#E8F7FA] flex items-center justify-center shrink-0">
                              <Lucide.UserRound
                                size={18}
                                className="text-[#05445E]"
                              />
                            </div>

                            <div>
                              <p className="font-bold text-slate-900">
                                {item.borrower || "Unknown borrower"}
                              </p>

                              {item.phone && (
                                <p className="text-xs text-slate-500 mt-1">
                                  {item.phone}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <p className="font-bold text-[#05445E]">
                            {item.loanNo}
                          </p>

                          <p className="text-xs text-slate-500 mt-1">
                            Loan account
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex items-center gap-2 text-sm text-slate-700">
                            <Lucide.MapPin size={15} className="text-[#189AB4]" />
                            {item.branch || "Unassigned"}
                          </div>
                        </td>

                        <td className="px-5 py-5 text-right">
                          <p className="font-black text-red-600">
                            {formatMoney(item.arrears)}
                          </p>

                          <p className="text-xs text-slate-500 mt-1">
                            outstanding
                          </p>
                        </td>

                        <td className="px-5 py-5 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-black ${level.className}`}
                            >
                              {level.icon}
                              {level.label}
                            </span>

                            <span className="text-xs font-bold text-slate-600">
                              {item.days} days
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <Lucide.PhoneCall
                              size={15}
                              className="text-[#189AB4]"
                            />
                            {item.action || "Not recorded"}
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <p className="max-w-[190px] truncate text-sm text-slate-600">
                            {item.outcome || "No outcome recorded"}
                          </p>
                        </td>

                        <td className="px-5 py-5 text-center">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-black">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            {item.status || "Pending"}
                          </span>
                        </td>

                        <td className="px-5 py-5 text-right">
                          <button
                            onClick={() => openCollection(item)}
                            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#E8F7FA] text-[#05445E] hover:bg-[#189AB4] hover:text-white font-bold text-xs transition"
                          >
                            <Lucide.MessageSquarePlus size={15} />
                            Record
                          </button>
                        </td>

                      </tr>
                    );
                  })}

                </tbody>
              </table>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="px-5 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-xs font-semibold text-slate-500">
                Showing{" "}
                <span className="text-slate-800">
                  {filtered.length}
                </span>{" "}
                of{" "}
                <span className="text-slate-800">
                  {collections.length}
                </span>{" "}
                collection cases
              </p>

              <p className="text-xs text-slate-500">
                Data is calculated from live loan schedules and repayments.
              </p>
            </div>
          )}

        </div>
      </div>

      {/* COLLECTION ACTIVITY MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">

          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">

            <div className="px-6 py-5 bg-[#05445E] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Lucide.HandCoins size={20} />
                </div>

                <div>
                  <h2 className="text-xl font-black">
                    Record Collection Activity
                  </h2>

                  <p className="text-xs text-white/70 mt-1">
                    Record a real recovery action against an overdue loan
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="w-9 h-9 rounded-xl hover:bg-white/10 flex items-center justify-center transition"
              >
                <Lucide.X size={20} />
              </button>
            </div>

            <div className="p-6">

              {selectedCase ? (
                <div className="mb-6 rounded-2xl border border-[#BDEAF1] bg-[#F2FCFD] p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                    <div>
                      <p className="text-[10px] uppercase font-black tracking-wider text-slate-500">
                        Loan
                      </p>
                      <p className="font-black text-[#05445E] mt-1">
                        {selectedCase.loanNo}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase font-black tracking-wider text-slate-500">
                        Borrower
                      </p>
                      <p className="font-bold text-slate-900 mt-1">
                        {selectedCase.borrower}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase font-black tracking-wider text-slate-500">
                        Arrears
                      </p>
                      <p className="font-black text-red-600 mt-1">
                        {formatMoney(selectedCase.arrears)}
                      </p>
                    </div>

                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <label className="block text-xs uppercase tracking-wider font-black text-slate-500 mb-2">
                    Overdue Loan
                  </label>

                  <select
                    value={form.loanNo}
                    onChange={(e) => {
                      const item = collections.find(
                        (c) => c.loanNo === e.target.value
                      );

                      setSelectedCase(item || null);

                      setForm((current) => ({
                        ...current,
                        loanNo: e.target.value,
                      }));
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#189AB4]/30 focus:border-[#189AB4]"
                  >
                    <option value="">Select overdue loan</option>

                    {collections.map((item) => (
                      <option key={item.id} value={item.loanNo}>
                        {item.loanNo} — {item.borrower} —{" "}
                        {formatMoney(item.arrears)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>
                  <label className="block text-xs uppercase tracking-wider font-black text-slate-500 mb-2">
                    Collection Action
                  </label>

                  <select
                    value={form.action}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        action: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#189AB4]/30 focus:border-[#189AB4]"
                  >
                    <option>Phone Call</option>
                    <option>SMS Reminder</option>
                    <option>Field Visit</option>
                    <option>Demand Letter</option>
                    <option>Legal Action</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-black text-slate-500 mb-2">
                    Next Visit
                  </label>

                  <input
                    type="date"
                    value={form.nextVisit}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        nextVisit: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#189AB4]/30 focus:border-[#189AB4]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wider font-black text-slate-500 mb-2">
                    Outcome
                  </label>

                  <input
                    value={form.outcome}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        outcome: e.target.value,
                      })
                    }
                    placeholder="e.g. Borrower contacted and payment promised"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#189AB4]/30 focus:border-[#189AB4]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wider font-black text-slate-500 mb-2">
                    Notes
                  </label>

                  <textarea
                    value={form.notes}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        notes: e.target.value,
                      })
                    }
                    rows={4}
                    placeholder="Add collection notes, borrower response, agreed follow-up, or other relevant details..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-[#189AB4]/30 focus:border-[#189AB4]"
                  />
                </div>

              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-7 pt-5 border-t border-slate-100">

                <button
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                  className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={saveCollection}
                  disabled={saving}
                  className="px-6 py-3 rounded-xl bg-[#05445E] hover:bg-[#032d3d] text-white font-bold flex items-center justify-center gap-2 transition disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Lucide.Loader2 size={17} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Lucide.Check size={17} />
                      Save Activity
                    </>
                  )}
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
