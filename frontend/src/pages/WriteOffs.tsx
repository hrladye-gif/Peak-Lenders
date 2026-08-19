import { useEffect, useMemo, useState } from "react";
import { formatMoney } from "../config/regional";
import * as Lucide from "lucide-react";
import { api } from "../api/axios";

type WriteOff = {
  id: string;
  loan: string;
  borrower: string;
  amount: number;
  reason: string;
  officer?: string | null;
  status: string;
  date: string;
};

export const WriteOffs = () => {
  const [showModal, setShowModal] = useState(false);
  const [writeOffs, setWriteOffs] = useState<WriteOff[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [approving, setApproving] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [summary, setSummary] = useState({
    total_cases: 0,
    total_amount: 0,
    pending_cases: 0,
    approved_cases: 0,
  });

  const [form, setForm] = useState({
    loan_id: "",
    amount: "",
    reason: "",
  });

  const loadWriteOffs = async () => {
    setLoading(true);
    setError("");

    try {
      const [casesResponse, summaryResponse] = await Promise.all([
        api.get("/write-offs/"),
        api.get("/write-offs/summary"),
      ]);

      setWriteOffs(casesResponse.data || []);

      setSummary(
        summaryResponse.data || {
          total_cases: 0,
          total_amount: 0,
          pending_cases: 0,
          approved_cases: 0,
        }
      );
    } catch (err: any) {
      console.error("Failed to load write-offs:", err);

      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to load write-offs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWriteOffs();
  }, []);

  const filteredWriteOffs = useMemo(() => {
    return writeOffs.filter((item) => {
      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      const searchText = search.toLowerCase();

      const matchesSearch =
        !searchText ||
        item.id.toLowerCase().includes(searchText) ||
        item.loan.toLowerCase().includes(searchText) ||
        item.borrower.toLowerCase().includes(searchText) ||
        item.reason.toLowerCase().includes(searchText) ||
        (item.officer || "").toLowerCase().includes(searchText);

      return matchesStatus && matchesSearch;
    });
  }, [writeOffs, search, statusFilter]);

  const saveWriteOff = async () => {
    setError("");

    if (!form.loan_id.trim()) {
      setError("Loan ID is required.");
      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      setError("Write-off amount must be greater than zero.");
      return;
    }

    if (!form.reason.trim()) {
      setError("Write-off reason is required.");
      return;
    }

    setSaving(true);

    try {
      await api.post("/write-offs/", {
        loan_id: form.loan_id.trim(),
        amount: Number(form.amount),
        reason: form.reason.trim(),
      });

      setForm({
        loan_id: "",
        amount: "",
        reason: "",
      });

      setShowModal(false);

      await loadWriteOffs();
    } catch (err: any) {
      console.error("Failed to create write-off:", err);

      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to create write-off."
      );
    } finally {
      setSaving(false);
    }
  };

  const approveWriteOff = async (id: string) => {
    setError("");
    setApproving(id);

    try {
      await api.post(`/write-offs/${id}/approve`);
      await loadWriteOffs();
    } catch (err: any) {
      console.error("Failed to approve write-off:", err);

      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to approve write-off."
      );
    } finally {
      setApproving(null);
    }
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setForm({
      loan_id: "",
      amount: "",
      reason: "",
    });
  };

  return (
    <main className="flex-1 min-w-0 overflow-y-auto bg-[#f7f9fb] p-6 lg:p-8">

      {/* ========================================================= */}
      {/* HEADER */}
      {/* ========================================================= */}

      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between mb-8">

        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-11 w-11 rounded-xl bg-[#05445E] flex items-center justify-center text-white shadow-sm">
              <Lucide.FileWarning size={22} />
            </div>

            <div>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-[#004f6e]">
                Write-Offs
              </h1>

              <p className="text-sm text-[#6f88a3] mt-1">
                Manage non-performing loans and write-off approvals
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setError("");
            setShowModal(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#159db5] hover:bg-[#128da4] px-5 py-3 text-sm font-bold text-white shadow-sm transition"
        >
          <Lucide.Plus size={18} />
          New Write-Off
        </button>

      </div>


      {/* ========================================================= */}
      {/* ERROR */}
      {/* ========================================================= */}

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
          <Lucide.AlertCircle size={20} className="mt-0.5 shrink-0" />

          <div className="text-sm font-medium">
            {error}
          </div>

          <button
            onClick={() => setError("")}
            className="ml-auto text-red-400 hover:text-red-700"
          >
            <Lucide.X size={18} />
          </button>
        </div>
      )}


      {/* ========================================================= */}
      {/* KPI CARDS */}
      {/* ========================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Total Cases
              </p>

              <h2 className="text-3xl font-black text-[#004f6e] mt-2">
                {summary.total_cases}
              </h2>

              <p className="text-xs text-[#6f88a3] mt-2">
                All write-off requests
              </p>
            </div>

            <div className="h-11 w-11 rounded-xl bg-[#e8f8fb] text-[#159db5] flex items-center justify-center">
              <Lucide.Files size={21} />
            </div>

          </div>
        </div>


        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Written-Off Amount
              </p>

              <h2 className="text-2xl font-black text-red-600 mt-2">
                {formatMoney(summary.total_amount)}
              </h2>

              <p className="text-xs text-[#6f88a3] mt-2">
                Total requested value
              </p>
            </div>

            <div className="h-11 w-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Lucide.TrendingDown size={21} />
            </div>

          </div>
        </div>


        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Pending Approval
              </p>

              <h2 className="text-3xl font-black text-amber-600 mt-2">
                {summary.pending_cases}
              </h2>

              <p className="text-xs text-[#6f88a3] mt-2">
                Awaiting authorization
              </p>
            </div>

            <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Lucide.Clock3 size={21} />
            </div>

          </div>
        </div>


        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Approved Cases
              </p>

              <h2 className="text-3xl font-black text-emerald-600 mt-2">
                {summary.approved_cases}
              </h2>

              <p className="text-xs text-[#6f88a3] mt-2">
                Completed write-offs
              </p>
            </div>

            <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Lucide.CircleCheck size={21} />
            </div>

          </div>
        </div>

      </div>


      {/* ========================================================= */}
      {/* TABLE CARD */}
      {/* ========================================================= */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Toolbar */}

        <div className="p-5 border-b border-slate-200">

          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">

            <div>
              <h2 className="text-lg font-black text-[#004f6e]">
                Write-Off Register
              </h2>

              <p className="text-sm text-[#6f88a3] mt-1">
                Review and authorize non-performing loan write-offs
              </p>
            </div>


            <div className="flex flex-col sm:flex-row gap-3">

              <div className="relative">

                <Lucide.Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search write-offs..."
                  className="w-full sm:w-64 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#159db5] focus:ring-2 focus:ring-[#159db5]/20"
                />

              </div>


              <div className="relative">

                <Lucide.Filter
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-9 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-[#159db5] focus:ring-2 focus:ring-[#159db5]/20"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                </select>

                <Lucide.ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />

              </div>

            </div>

          </div>

        </div>


        {/* Table */}

        {loading ? (

          <div className="py-20 flex flex-col items-center justify-center">

            <div className="h-10 w-10 rounded-full border-4 border-slate-200 border-t-[#159db5] animate-spin" />

            <p className="text-sm text-[#6f88a3] mt-4">
              Loading write-offs...
            </p>

          </div>

        ) : filteredWriteOffs.length === 0 ? (

          <div className="py-20 px-6 flex flex-col items-center justify-center text-center">

            <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
              <Lucide.FileWarning size={28} />
            </div>

            <h3 className="text-lg font-bold text-slate-800">
              {writeOffs.length === 0
                ? "No write-off cases"
                : "No matching write-offs"}
            </h3>

            <p className="text-sm text-[#6f88a3] max-w-md mt-2">
              {writeOffs.length === 0
                ? "There are currently no write-off requests for your institution."
                : "Try changing your search or status filter."}
            </p>

            {writeOffs.length === 0 && (
              <button
                onClick={() => {
                  setError("");
                  setShowModal(true);
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#159db5] hover:bg-[#128da4] px-5 py-2.5 text-sm font-bold text-white"
              >
                <Lucide.Plus size={17} />
                Create First Write-Off
              </button>
            )}

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1050px]">

              <thead className="bg-slate-50 border-b border-slate-200">

                <tr>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#6f88a3]">
                    Reference
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#6f88a3]">
                    Loan
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#6f88a3]">
                    Borrower
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-[#6f88a3]">
                    Amount
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#6f88a3]">
                    Reason
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#6f88a3]">
                    Officer
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#6f88a3]">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-[#6f88a3]">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {filteredWriteOffs.map((item) => (

                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 transition"
                  >

                    <td className="px-5 py-4">

                      <div className="font-bold text-[#004f6e]">
                        WO-{item.id.slice(0, 8)}
                      </div>

                      <div className="text-xs text-slate-400 mt-1">
                        {item.date}
                      </div>

                    </td>


                    <td className="px-5 py-4">

                      <span className="font-semibold text-slate-700">
                        {item.loan}
                      </span>

                    </td>


                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="h-9 w-9 rounded-full bg-[#05445E] text-white flex items-center justify-center text-xs font-bold">
                          {item.borrower
                            .split(" ")
                            .map((name) => name[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>

                        <span className="font-semibold text-slate-700">
                          {item.borrower}
                        </span>

                      </div>

                    </td>


                    <td className="px-5 py-4 text-right">

                      <span className="font-black text-red-600">
                        {formatMoney(item.amount)}
                      </span>

                    </td>


                    <td className="px-5 py-4">

                      <span className="text-sm text-slate-600">
                        {item.reason}
                      </span>

                    </td>


                    <td className="px-5 py-4">

                      <span className="text-sm text-slate-600">
                        {item.officer || "—"}
                      </span>

                    </td>


                    <td className="px-5 py-4">

                      {item.status === "Approved" ? (

                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                          <Lucide.CircleCheck size={14} />
                          Approved
                        </span>

                      ) : (

                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                          <Lucide.Clock3 size={14} />
                          Pending
                        </span>

                      )}

                    </td>


                    <td className="px-5 py-4 text-right">

                      {item.status === "Pending" ? (

                        <button
                          onClick={() => approveWriteOff(item.id)}
                          disabled={approving === item.id}
                          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 px-3.5 py-2 text-xs font-bold text-white transition"
                        >
                          {approving === item.id ? (
                            <>
                              <Lucide.Loader2
                                size={14}
                                className="animate-spin"
                              />
                              Approving...
                            </>
                          ) : (
                            <>
                              <Lucide.Check size={14} />
                              Approve
                            </>
                          )}
                        </button>

                      ) : (

                        <span className="text-xs font-semibold text-slate-400">
                          Completed
                        </span>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* ========================================================= */}
      {/* NEW WRITE-OFF MODAL */}
      {/* ========================================================= */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl">

            <div className="flex items-start justify-between border-b border-slate-200 p-6">

              <div>

                <div className="flex items-center gap-3">

                  <div className="h-10 w-10 rounded-xl bg-[#e8f8fb] text-[#159db5] flex items-center justify-center">
                    <Lucide.FileWarning size={20} />
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-[#004f6e]">
                      New Write-Off
                    </h2>

                    <p className="text-sm text-[#6f88a3] mt-1">
                      Submit a loan for write-off approval
                    </p>
                  </div>

                </div>

              </div>

              <button
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <Lucide.X size={20} />
              </button>

            </div>


            <div className="p-6 space-y-5">

              <div>

                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Loan ID
                </label>

                <div className="relative">

                  <Lucide.CreditCard
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={form.loan_id}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        loan_id: e.target.value,
                      })
                    }
                    placeholder="Enter loan ID"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-sm outline-none focus:border-[#159db5] focus:ring-2 focus:ring-[#159db5]/20"
                  />

                </div>

                <p className="text-xs text-slate-400 mt-1.5">
                  Use the loan's unique system ID.
                </p>

              </div>


              <div>

                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Write-Off Amount
                </label>

                <div className="relative">

                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    Ksh
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={form.amount}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        amount: e.target.value,
                      })
                    }
                    placeholder="0.00"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-14 pr-4 py-3 text-sm outline-none focus:border-[#159db5] focus:ring-2 focus:ring-[#159db5]/20"
                  />

                </div>

              </div>


              <div>

                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Reason
                </label>

                <textarea
                  value={form.reason}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      reason: e.target.value,
                    })
                  }
                  placeholder="Explain why this loan should be written off..."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#159db5] focus:ring-2 focus:ring-[#159db5]/20"
                />

              </div>


              <div className="rounded-xl border border-[#bceaf1] bg-[#e8f8fb] p-4">

                <div className="flex gap-3">

                  <Lucide.Info
                    size={18}
                    className="mt-0.5 shrink-0 text-[#159db5]"
                  />

                  <p className="text-xs leading-5 text-[#00627d]">
                    New write-offs are created as <strong>Pending</strong>.
                    Approval will update the loan status and post the
                    corresponding accounting journal entry.
                  </p>

                </div>

              </div>

            </div>


            <div className="flex justify-end gap-3 border-t border-slate-200 p-6">

              <button
                onClick={closeModal}
                disabled={saving}
                className="rounded-xl px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={saveWriteOff}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-[#159db5] hover:bg-[#128da4] disabled:opacity-50 px-5 py-3 text-sm font-bold text-white shadow-sm transition"
              >
                {saving ? (
                  <>
                    <Lucide.Loader2 size={17} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Lucide.Save size={17} />
                    Submit Write-Off
                  </>
                )}
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
};
