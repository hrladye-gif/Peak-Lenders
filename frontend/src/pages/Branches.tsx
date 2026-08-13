import { useEffect, useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";
import { api } from "../api/axios";

type Branch = {
  id: string;
  name: string;
  code: string;
  address?: string | null;
};

type User = {
  tenant_id?: string;
};

export const Branches = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    code: "",
    address: "",
  });

  const getTenantId = (): string | null => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    try {
      const user: User = JSON.parse(storedUser);
      return user.tenant_id || null;
    } catch {
      return null;
    }
  };

  const loadBranches = async () => {
    setLoading(true);
    setError("");

    try {
      const tenantId = getTenantId();

      if (!tenantId) {
        throw new Error(
          "Your login session does not contain a tenant ID. Please log out and log in again."
        );
      }

      const response = await api.get(`/branches/${tenantId}`);

      setBranches(response.data || []);
    } catch (err: any) {
      console.error("Failed to load branches:", err);

      setError(
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to load branches."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  const addBranch = async () => {
    setError("");

    if (!form.name.trim()) {
      setError("Branch name is required.");
      return;
    }

    if (!form.code.trim()) {
      setError("Branch code is required.");
      return;
    }

    const tenantId = getTenantId();

    if (!tenantId) {
      setError("No tenant ID found. Please log in again.");
      return;
    }

    setSaving(true);

    try {
      await api.post("/branches/", {
        tenant_id: tenantId,
        name: form.name.trim(),
        code: form.code.trim(),
        address: form.address.trim() || null,
      });

      setForm({
        name: "",
        code: "",
        address: "",
      });

      setShowModal(false);

      await loadBranches();
    } catch (err: any) {
      console.error("Failed to create branch:", err);

      setError(
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to create branch."
      );
    } finally {
      setSaving(false);
    }
  };

  const locationCount = new Set(
    branches
      .map((branch) => branch.address)
      .filter(Boolean)
  ).size;

  return (
    <div className="flex h-screen bg-slate-50">

      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-4xl font-black">
              Branches
            </h1>

            <p className="text-slate-500">
              Manage branches and operational locations
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
            New Branch
          </button>

        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
            {error}
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-3 gap-5 mb-8">

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Total Branches
            </p>

            <h2 className="text-4xl font-black">
              {loading ? "..." : branches.length}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Active
            </p>

            <h2 className="text-4xl font-black text-green-600">
              {loading ? "..." : branches.length}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Locations
            </p>

            <h2 className="text-4xl font-black text-blue-600">
              {loading ? "..." : locationCount}
            </h2>
          </div>

        </div>

        {/* TABLE */}
        <div className="bg-white border rounded-2xl overflow-hidden">

          {loading ? (

            <div className="p-12 text-center text-slate-500">
              Loading branches...
            </div>

          ) : branches.length === 0 ? (

            <div className="p-12 text-center">

              <Lucide.Building2
                size={42}
                className="mx-auto mb-4 text-slate-300"
              />

              <h3 className="text-xl font-bold text-slate-700">
                No branches yet
              </h3>

              <p className="text-slate-500 mt-2">
                Create your first branch to get started.
              </p>

            </div>

          ) : (

            <table className="w-full">

              <thead className="bg-slate-100">

                <tr>

                  <th className="p-4 text-left">
                    Code
                  </th>

                  <th className="p-4 text-left">
                    Branch Name
                  </th>

                  <th className="p-4 text-left">
                    Address
                  </th>

                  <th className="p-4 text-left">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {branches.map((branch) => (

                  <tr
                    key={branch.id}
                    className="border-t"
                  >

                    <td className="p-4 font-bold">
                      {branch.code}
                    </td>

                    <td className="p-4 font-bold text-blue-700">
                      {branch.name}
                    </td>

                    <td className="p-4">
                      {branch.address || "—"}
                    </td>

                    <td className="p-4">

                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        Active
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

        {/* NEW BRANCH MODAL */}
        {showModal && (

          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-3xl p-8 w-[600px]">

              <h2 className="text-2xl font-black mb-6">
                New Branch
              </h2>

              <div className="space-y-4">

                <input
                  className="border rounded-xl p-3 w-full"
                  placeholder="Branch Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                />

                <input
                  className="border rounded-xl p-3 w-full"
                  placeholder="Branch Code e.g. BR-001"
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
                  placeholder="Location / Address"
                  value={form.address}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      address: e.target.value,
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
                  onClick={addBranch}
                  disabled={saving}
                  className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Branch"}
                </button>

              </div>

            </div>

          </div>

        )}

      </main>

    </div>
  );
};
