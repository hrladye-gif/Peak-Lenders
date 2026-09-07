import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";
import { api } from "../api/axios";

type Account = {
  id: string;
  account_code: string;
  account_name: string;
  account_type: string;
  balance: number;
  status: string;
};

type JournalLine = {
  id: string;
  account_id: string;
  account_code: string;
  account_name: string;
  debit: number;
  credit: number;
};

type JournalEntry = {
  id: string;
  entry_date: string;
  reference_no: string | null;
  description: string | null;
  source_module: string | null;
  lines: JournalLine[];
};

type FormState = {
  entry_date: string;
  reference_no: string;
  description: string;
  debit_account_id: string;
  credit_account_id: string;
  amount: string;
};

const today = new Date().toISOString().slice(0, 10);

export const JournalEntries = () => {
  const [showModal, setShowModal] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<FormState>({
    entry_date: today,
    reference_no: "",
    description: "",
    debit_account_id: "",
    credit_account_id: "",
    amount: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [journalResponse, accountsResponse] = await Promise.all([
        api.get<JournalEntry[]>("/accounting/journal"),
        api.get<Account[]>("/accounting/accounts"),
      ]);

      setEntries(journalResponse.data || []);
      setAccounts(
        (accountsResponse.data || []).filter(
          (account) => account.status !== "Inactive"
        )
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to load accounting data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const flattenedEntries = useMemo(() => {
    return entries.map((entry) => {
      const debitLine =
        entry.lines.find((line) => Number(line.debit) > 0) ||
        entry.lines[0];

      const creditLine =
        entry.lines.find((line) => Number(line.credit) > 0) ||
        entry.lines[1];

      const amount = entry.lines.reduce(
        (sum, line) => sum + Number(line.debit || 0),
        0
      );

      return {
        ...entry,
        debitName: debitLine?.account_name || "—",
        creditName: creditLine?.account_name || "—",
        amount,
      };
    });
  }, [entries]);

  const totalValue = useMemo(
    () =>
      flattenedEntries.reduce(
        (sum, entry) => sum + Number(entry.amount || 0),
        0
      ),
    [flattenedEntries]
  );

  const resetForm = () => {
    setForm({
      entry_date: today,
      reference_no: "",
      description: "",
      debit_account_id: "",
      credit_account_id: "",
      amount: "",
    });
  };

  const closeModal = () => {
    if (saving) return;
    setShowModal(false);
    resetForm();
  };

  const saveEntry = async () => {
    setError("");

    const amount = Number(form.amount);

    if (!form.entry_date) {
      setError("Entry date is required.");
      return;
    }

    if (!form.debit_account_id || !form.credit_account_id) {
      setError("Select both a debit and credit account.");
      return;
    }

    if (form.debit_account_id === form.credit_account_id) {
      setError("Debit and credit accounts must be different.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    try {
      setSaving(true);

      await api.post("/accounting/journal", {
        entry_date: form.entry_date,
        reference_no: form.reference_no.trim() || null,
        description: form.description.trim() || null,
        source_module: "MANUAL",
        lines: [
          {
            account_id: form.debit_account_id,
            debit: amount,
            credit: 0,
          },
          {
            account_id: form.credit_account_id,
            debit: 0,
            credit: amount,
          },
        ],
      });

      closeModal();
      await loadData();
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to create journal entry."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black">Journal Entries</h1>
            <p className="text-slate-500">
              Record and manage accounting transactions
            </p>
          </div>

          <button
            onClick={() => {
              setError("");
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            <Lucide.Plus size={18} />
            New Journal Entry
          </button>
        </div>

        {error && !showModal && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-4 gap-5 mb-8">
          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">Total Entries</p>
            <h2 className="text-4xl font-black">
              {loading ? "—" : entries.length}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">Posted</p>
            <h2 className="text-4xl font-black text-green-600">
              {loading ? "—" : entries.length}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">Drafts</p>
            <h2 className="text-4xl font-black text-amber-600">0</h2>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">Value</p>
            <h2 className="text-4xl font-black">
              {loading
                ? "—"
                : totalValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
            </h2>
          </div>
        </div>

        <div className="bg-white border rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-4 text-left">Reference</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-left">Debit</th>
                <th className="p-4 text-left">Credit</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-500">
                    Loading journal entries...
                  </td>
                </tr>
              ) : flattenedEntries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-500">
                    No journal entries found.
                  </td>
                </tr>
              ) : (
                flattenedEntries.map((entry) => (
                  <tr key={entry.id} className="border-t">
                    <td className="p-4 font-bold">
                      {entry.reference_no || "—"}
                    </td>

                    <td className="p-4">
                      {new Date(entry.entry_date).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      {entry.description || "—"}
                    </td>

                    <td className="p-4 text-blue-700 font-bold">
                      {entry.debitName}
                    </td>

                    <td className="p-4 text-red-700 font-bold">
                      {entry.creditName}
                    </td>

                    <td className="p-4 font-bold">
                      {Number(entry.amount).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        Posted
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 w-[650px] max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black">
                  New Journal Entry
                </h2>

                <button
                  onClick={closeModal}
                  disabled={saving}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <Lucide.X size={22} />
                </button>
              </div>

              {error && (
                <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Entry Date
                  </label>
                  <input
                    type="date"
                    value={form.entry_date}
                    className="border rounded-xl p-3 w-full"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        entry_date: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Reference
                  </label>
                  <input
                    value={form.reference_no}
                    className="border rounded-xl p-3 w-full"
                    placeholder="e.g. MANUAL-001"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        reference_no: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Description
                  </label>
                  <input
                    value={form.description}
                    className="border rounded-xl p-3 w-full"
                    placeholder="Transaction description"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Debit Account
                  </label>
                  <select
                    value={form.debit_account_id}
                    className="border rounded-xl p-3 w-full"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        debit_account_id: e.target.value,
                      })
                    }
                  >
                    <option value="">Select debit account</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.account_code} — {account.account_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Credit Account
                  </label>
                  <select
                    value={form.credit_account_id}
                    className="border rounded-xl p-3 w-full"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        credit_account_id: e.target.value,
                      })
                    }
                  >
                    <option value="">Select credit account</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.account_code} — {account.account_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.amount}
                    className="border rounded-xl p-3 w-full"
                    placeholder="0.00"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        amount: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-7">
                <button
                  onClick={closeModal}
                  disabled={saving}
                  className="px-5 py-3"
                >
                  Cancel
                </button>

                <button
                  onClick={saveEntry}
                  disabled={saving}
                  className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50"
                >
                  {saving && <Lucide.Loader2 size={18} className="animate-spin" />}
                  {saving ? "Posting..." : "Post Entry"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
