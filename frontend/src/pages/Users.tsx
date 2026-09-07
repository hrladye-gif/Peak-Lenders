import { useEffect, useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";
import { api } from "../api/axios";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  branch?: string | null;
  branch_id?: string | null;
  status: string;
  is_active: boolean;
};

type Branch = {
  id: string;
  name: string;
  code: string;
};

export const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "",
    branch_id: "",
  });

  const getTenantId = (): string | null => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    try {
      const user = JSON.parse(storedUser);
      return user.tenant_id || null;
    } catch {
      return null;
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const tenantId = getTenantId();

      if (!tenantId) {
        throw new Error(
          "Your login session does not contain a tenant ID. Please log out and log in again."
        );
      }

      const [usersResponse, branchesResponse] = await Promise.all([
        api.get("/users/"),
        api.get(`/branches/${tenantId}`),
      ]);

      setUsers(usersResponse.data || []);
      setBranches(branchesResponse.data || []);
    } catch (err: any) {
      console.error("Failed to load users:", err);

      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setForm({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      role: "",
      branch_id: "",
    });
  };

  const addUser = async () => {
    setError("");

    if (!form.first_name.trim()) {
      setError("First name is required.");
      return;
    }

    if (!form.last_name.trim()) {
      setError("Last name is required.");
      return;
    }

    if (!form.email.trim()) {
      setError("Email is required.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!form.role.trim()) {
      setError("Role is required.");
      return;
    }

    setSaving(true);

    try {
      await api.post("/users/", {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role.trim(),
        branch_id: form.branch_id || null,
      });

      resetForm();
      setShowModal(false);

      await loadData();
    } catch (err: any) {
      console.error("Failed to create user:", err);

      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to create user."
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (user: User) => {
    setError("");

    try {
      await api.patch(`/users/${user.id}/status`);
      await loadData();
    } catch (err: any) {
      console.error("Failed to update user:", err);

      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to update user."
      );
    }
  };

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const roles = new Set(
    users.map((user) => user.role)
  ).size;

  const branchAccess = new Set(
    users
      .map((user) => user.branch_id || user.branch)
      .filter(Boolean)
  ).size;

  return (
    <div className="flex h-screen bg-slate-50">

      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">

        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-4xl font-black">
              Users
            </h1>

            <p className="text-slate-500">
              Manage system users and access accounts
            </p>
          </div>

          <button
            onClick={() => {
              setError("");
              resetForm();
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            <Lucide.UserPlus size={18} />
            New User
          </button>

        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-4 gap-5 mb-8">

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Total Users
            </p>

            <h2 className="text-4xl font-black">
              {loading ? "..." : users.length}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Active Users
            </p>

            <h2 className="text-4xl font-black text-green-600">
              {loading ? "..." : activeUsers}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Roles
            </p>

            <h2 className="text-4xl font-black text-blue-600">
              {loading ? "..." : roles}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Branch Access
            </p>

            <h2 className="text-4xl font-black">
              {loading ? "..." : branchAccess}
            </h2>
          </div>

        </div>

        <div className="bg-white border rounded-2xl overflow-hidden">

          {loading ? (

            <div className="p-12 text-center text-slate-500">
              Loading users...
            </div>

          ) : users.length === 0 ? (

            <div className="p-12 text-center">

              <Lucide.Users
                size={42}
                className="mx-auto mb-4 text-slate-300"
              />

              <h3 className="text-xl font-bold text-slate-700">
                No users yet
              </h3>

              <p className="text-slate-500 mt-2">
                Create your first system user.
              </p>

            </div>

          ) : (

            <table className="w-full">

              <thead className="bg-slate-100">

                <tr>
                  <th className="p-4 text-left">ID</th>
                  <th className="p-4 text-left">User</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Role</th>
                  <th className="p-4 text-left">Branch</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Action</th>
                </tr>

              </thead>

              <tbody>

                {users.map((user) => (

                  <tr
                    key={user.id}
                    className="border-t"
                  >

                    <td className="p-4 font-bold">
                      {user.id}
                    </td>

                    <td className="p-4 font-bold text-blue-700">
                      {user.name}
                    </td>

                    <td className="p-4">
                      {user.email}
                    </td>

                    <td className="p-4">
                      {user.role}
                    </td>

                    <td className="p-4">
                      {user.branch || "Unassigned"}
                    </td>

                    <td className="p-4">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.status}
                      </span>

                    </td>

                    <td className="p-4">

                      <button
                        onClick={() => toggleStatus(user)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold ${
                          user.status === "Active"
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-green-50 text-green-600 hover:bg-green-100"
                        }`}
                      >
                        {user.status === "Active"
                          ? "Deactivate"
                          : "Activate"}
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

        {showModal && (

          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-3xl p-8 w-[650px]">

              <h2 className="text-2xl font-black mb-6">
                New User
              </h2>

              <div className="grid grid-cols-2 gap-4">

                <input
                  className="border rounded-xl p-3 w-full"
                  placeholder="First Name"
                  value={form.first_name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      first_name: e.target.value,
                    })
                  }
                />

                <input
                  className="border rounded-xl p-3 w-full"
                  placeholder="Last Name"
                  value={form.last_name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      last_name: e.target.value,
                    })
                  }
                />

                <input
                  className="border rounded-xl p-3 w-full col-span-2"
                  placeholder="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                />

                <input
                  className="border rounded-xl p-3 w-full col-span-2"
                  placeholder="Temporary Password"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                />

                <select
                  className="border rounded-xl p-3 w-full"
                  value={form.role}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      role: e.target.value,
                    })
                  }
                >
                  <option value="">Select Role</option>
                  <option value="admin">Administrator</option>
                  <option value="branch_manager">Branch Manager</option>
                  <option value="loan_officer">Loan Officer</option>
                  <option value="cashier">Cashier</option>
                  <option value="accountant">Accountant</option>
                  <option value="collections_officer">
                    Collections Officer
                  </option>
                </select>

                <select
                  className="border rounded-xl p-3 w-full"
                  value={form.branch_id}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      branch_id: e.target.value,
                    })
                  }
                >
                  <option value="">Unassigned Branch</option>

                  {branches.map((branch) => (
                    <option
                      key={branch.id}
                      value={branch.id}
                    >
                      {branch.name}
                    </option>
                  ))}

                </select>

              </div>

              <div className="flex justify-end gap-3 mt-6">

                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-5 py-3"
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  onClick={addUser}
                  disabled={saving}
                  className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save User"}
                </button>

              </div>

            </div>

          </div>

        )}

      </main>

    </div>
  );
};
