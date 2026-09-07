import { useEffect, useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";
import { api } from "../api/axios";

type Account = {
  id: string;
  account_code: string;
  account_name: string;
  account_type: string;
  description?: string | null;
  balance: number | string;
  status: string;
};

const ACCOUNT_TYPES = [
  "Asset",
  "Liability",
  "Equity",
  "Income",
  "Expense",
];

export const ChartOfAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    code: "",
    name: "",
    type: "",
    category: "",
  });

  const loadAccounts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get<Account[]>("/accounting/accounts");

      setAccounts(response.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Failed to load chart of accounts."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const saveAccount = async () => {
    if (
      !form.code.trim() ||
      !form.name.trim() ||
      !form.type.trim()
    ) {
      setError("Account code, account name and account type are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await api.post("/accounting/accounts", {
        account_code: form.code.trim(),
        account_name: form.name.trim(),
        account_type: form.type.trim(),
        description: form.category.trim() || null,
      });

      setForm({
        code: "",
        name: "",
        type: "",
        category: "",
      });

      setShowModal(false);

      await loadAccounts();
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Failed to create account."
      );
    } finally {
      setSaving(false);
    }
  };

  const formatMoney = (value: number | string) => {
    const amount = Number(value || 0);

    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const normalizeType = (type: string) =>
    type.trim().toLowerCase();

  const countType = (type: string) =>
    accounts.filter(
      (account) =>
        normalizeType(account.account_type) ===
        type.toLowerCase()
    ).length;

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black">
              Chart of Accounts
            </h1>

            <p className="text-slate-500">
              Manage accounting structure and financial accounts
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
            New Account
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 font-semibold">
            {error}
          </div>
        )}

        <div className="grid grid-cols-4 gap-5 mb-8">

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Total Accounts
            </p>

            <h2 className="text-4xl font-black">
              {accounts.length}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Assets
            </p>

            <h2 className="text-4xl font-black text-blue-600">
              {countType("Asset")}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Liabilities
            </p>

            <h2 className="text-4xl font-black text-red-600">
              {countType("Liability")}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Income Accounts
            </p>

            <h2 className="text-4xl font-black text-green-600">
              {countType("Income")}
            </h2>
          </div>

        </div>

        <div className="bg-white border rounded-2xl overflow-hidden">

          <table className="w-full">

            <thead className="bg-slate-100">
              <tr>
                <th className="p-4 text-left">
                  Account Code
                </th>

                <th className="p-4 text-left">
                  Account Name
                </th>

                <th className="p-4 text-left">
                  Type
                </th>

                <th className="p-4 text-left">
                  Description
                </th>

                <th className="p-4 text-left">
                  Balance
                </th>

                <th className="p-4 text-left">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-10 text-center text-slate-500"
                  >
                    Loading accounts...
                  </td>
                </tr>
              ) : accounts.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-10 text-center text-slate-500"
                  >
                    No accounts found.
                  </td>
                </tr>
              ) : (
                accounts.map((account) => (
                  <tr
                    key={account.id}
                    className="border-t"
                  >
                    <td className="p-4 font-bold">
                      {account.account_code}
                    </td>

                    <td className="p-4 font-bold text-blue-700">
                      {account.account_name}
                    </td>

                    <td className="p-4">
                      {account.account_type}
                    </td>

                    <td className="p-4 text-slate-600">
                      {account.description || "—"}
                    </td>

                    <td className="p-4 font-bold">
                      {formatMoney(account.balance)}
                    </td>

                    <td className="p-4">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                        {account.status}
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

            <div className="bg-white rounded-3xl p-8 w-[600px]">

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black">
                  Create Account
                </h2>

                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <Lucide.X size={22} />
                </button>
              </div>

              <div className="space-y-4">

                <input
                  className="border rounded-xl p-3 w-full"
                  placeholder="Account Code"
                  value={form.code}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      code: e.target.value,
                    })
                  }
                />

                <input
                  className="border rounded-xl p-3 w-full"
                  placeholder="Account Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                />

                <select
                  className="border rounded-xl p-3 w-full bg-white"
                  value={form.type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type: e.target.value,
                    })
                  }
                >
                  <option value="">
                    Select account type
                  </option>

                  {ACCOUNT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                <input
                  className="border rounded-xl p-3 w-full"
                  placeholder="Description"
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value,
                    })
                  }
                />

              </div>

              <div className="flex justify-end gap-3 mt-6">

                <button
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                  className="px-5 py-3"
                >
                  Cancel
                </button>

                <button
                  onClick={saveAccount}
                  disabled={saving}
                  className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Account"}
                </button>

              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
};
