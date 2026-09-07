import React, { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  UserPlus,
  Search,
  Mail,
  MoreVertical,
  X,
  Loader2,
  Eye,
  Pencil,
  Power,
} from "lucide-react";
import { api } from "../../api/axios";

type User = {
  id: string;
  tenant_id: string;
  branch_id?: string | null;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  role: string;
  role_id?: string | null;
  branch?: string | null;
  status: string;
  is_active: boolean;
};

type Branch = {
  id: string;
  name: string;
  code: string;
  address?: string | null;
};

type Role = {
  id: string;
  tenant_id: string;
  name: string;
  code: string;
  description?: string | null;
  is_system: boolean;
};

export const UsersRoles = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [menuUserId, setMenuUserId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role_id: "",
    branch_id: "",
    password: "",
  });

  const getTenantId = () => {
    try {
      const stored = localStorage.getItem("user");

      if (!stored) return null;

      const user = JSON.parse(stored);

      return user.tenant_id || null;
    } catch {
      return null;
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const usersResponse = await api.get("/users/");
      setUsers(usersResponse.data || []);

      const tenantId = getTenantId();

      if (tenantId) {
        const branchesResponse = await api.get(`/branches/${tenantId}`);
        setBranches(branchesResponse.data || []);
      }
    } catch (err: any) {
      console.error(err);

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

  const filteredUsers = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    if (!query) return users;

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        (user.branch || "").toLowerCase().includes(query)
    );
  }, [users, searchTerm]);

  const openAddModal = () => {
    setSelectedUser(null);

    setForm({
      first_name: "",
      last_name: "",
      email: "",
      role_id: roles[0]?.id || "",
      branch_id: "",
      password: "",
    });

    setError("");
    setIsModalOpen(true);
    setMenuUserId(null);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);

    setForm({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role_id: user.role_id || "",
      branch_id: user.branch_id || "",
      password: "",
    });

    setError("");
    setIsModalOpen(true);
    setMenuUserId(null);
  };

  const saveUser = async () => {
    setError("");

    if (!form.first_name.trim() || !form.last_name.trim()) {
      setError("First name and last name are required.");
      return;
    }

    if (!form.email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!form.role_id.trim()) {
      setError("Role is required.");
      return;
    }

    if (!selectedUser && form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSaving(true);

    try {
      if (selectedUser) {
        const response = await api.patch(`/users/${selectedUser.id}`, {
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          email: form.email.trim(),
          role_id: form.role_id,
          branch_id: form.branch_id || "",
        });

        setUsers((current) =>
          current.map((user) =>
            user.id === selectedUser.id ? response.data : user
          )
        );
      } else {
        const response = await api.post("/users/", {
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          email: form.email.trim(),
          password: form.password,
          role_id: form.role_id,
          branch_id: form.branch_id || null,
        });

        setUsers((current) => [response.data, ...current]);
      }

      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to save user."
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (user: User) => {
    setActionLoading(user.id);
    setMenuUserId(null);
    setError("");

    try {
      const response = await api.patch(`/users/${user.id}/status`);

      setUsers((current) =>
        current.map((item) =>
          item.id === user.id ? response.data : item
        )
      );
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to update user status."
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen relative">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#05445E]">
            Users & Permissions
          </h1>

          <p className="text-sm text-slate-500">
            Manage system users, access control, and role assignments
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#189AB4] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md hover:bg-[#05445E] transition-colors cursor-pointer"
        >
          <UserPlus size={16} />
          Add New User
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div className="relative w-72">
            <Search
              className="absolute left-3 top-2.5 text-slate-400"
              size={16}
            />

            <input
              type="text"
              placeholder="Search user name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#189AB4] w-full"
            />
          </div>

          <div className="text-xs text-slate-500">
            {loading ? "Loading..." : `${filteredUsers.length} users`}
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-slate-500 text-sm">
              <Loader2
                className="animate-spin mx-auto mb-3"
                size={24}
              />
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-16 text-center">
              <ShieldCheck
                className="mx-auto mb-3 text-slate-300"
                size={36}
              />

              <p className="font-bold text-slate-600">
                No users found
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Try another search or add a new user.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                  <th className="p-3 font-bold">User Name</th>
                  <th className="p-3 font-bold">Role</th>
                  <th className="p-3 font-bold">Assigned Branch</th>
                  <th className="p-3 font-bold">Status</th>
                  <th className="p-3 font-bold text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="p-3">
                      <p className="font-bold text-slate-800">
                        {user.name}
                      </p>

                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Mail size={11} />
                        {user.email}
                      </p>
                    </td>

                    <td className="p-3 font-medium text-[#05445E]">
                      <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-800 border border-sky-200 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                        <ShieldCheck size={12} />
                        {user.role}
                      </span>
                    </td>

                    <td className="p-3 text-slate-600 font-medium">
                      {user.branch || "All Branches"}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          user.is_active
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-red-100 text-red-800 border border-red-300"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="p-3 text-center relative">
                      {actionLoading === user.id ? (
                        <Loader2
                          size={17}
                          className="animate-spin mx-auto text-[#189AB4]"
                        />
                      ) : (
                        <button
                          onClick={() =>
                            setMenuUserId(
                              menuUserId === user.id
                                ? null
                                : user.id
                            )
                          }
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer"
                        >
                          <MoreVertical size={16} />
                        </button>
                      )}

                      {menuUserId === user.id && (
                        <div className="absolute right-3 top-10 z-30 w-44 bg-white border border-slate-200 rounded-xl shadow-xl text-left py-1">
                          <button
                            onClick={() => {
                              setViewUser(user);
                              setMenuUserId(null);
                            }}
                            className="w-full px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 text-slate-700"
                          >
                            <Eye size={14} />
                            View User
                          </button>

                          <button
                            onClick={() => openEditModal(user)}
                            className="w-full px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 text-slate-700"
                          >
                            <Pencil size={14} />
                            Edit User
                          </button>

                          <button
                            onClick={() => toggleStatus(user)}
                            className={`w-full px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 ${
                              user.is_active
                                ? "text-red-600"
                                : "text-emerald-600"
                            }`}
                          >
                            <Power size={14} />
                            {user.is_active
                              ? "Deactivate"
                              : "Activate"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-[#05445E] text-base">
                  {selectedUser
                    ? "Edit User"
                    : "Add New Staff Member"}
                </h3>

                <p className="text-[11px] text-slate-400 mt-1">
                  {selectedUser
                    ? "Update user access and assignment"
                    : "Create a new system user"}
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    First Name
                  </label>

                  <input
                    value={form.first_name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        first_name: e.target.value,
                      })
                    }
                    placeholder="David"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Last Name
                  </label>

                  <input
                    value={form.last_name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        last_name: e.target.value,
                      })
                    }
                    placeholder="Kato"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Email Address
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  placeholder="d.kato@peaklenders.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              {!selectedUser && (
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Temporary Password
                  </label>

                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        password: e.target.value,
                      })
                    }
                    placeholder="Minimum 8 characters"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Assign Role
                </label>

                <select
                  value={form.role_id}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      role_id: e.target.value,
                    })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Assigned Branch
                </label>

                <select
                  value={form.branch_id}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      branch_id: e.target.value,
                    })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="">All Branches</option>

                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={saveUser}
                disabled={saving}
                className="px-4 py-2 bg-[#189AB4] text-white rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-60 flex items-center gap-2"
              >
                {saving && (
                  <Loader2 size={14} className="animate-spin" />
                )}

                {saving
                  ? "Saving..."
                  : selectedUser
                  ? "Save Changes"
                  : "Save User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW USER MODAL */}
      {viewUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-[#05445E] text-base">
                  User Details
                </h3>

                <p className="text-[11px] text-slate-400">
                  {viewUser.id}
                </p>
              </div>

              <button
                onClick={() => setViewUser(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 mt-5 text-xs">
              <div>
                <p className="text-slate-400">Full Name</p>
                <p className="font-bold text-slate-800 mt-1">
                  {viewUser.name}
                </p>
              </div>

              <div>
                <p className="text-slate-400">Email</p>
                <p className="font-semibold text-slate-700 mt-1">
                  {viewUser.email}
                </p>
              </div>

              <div>
                <p className="text-slate-400">Role</p>
                <p className="font-semibold text-[#05445E] mt-1">
                  {viewUser.role}
                </p>
              </div>

              <div>
                <p className="text-slate-400">Assigned Branch</p>
                <p className="font-semibold text-slate-700 mt-1">
                  {viewUser.branch || "All Branches"}
                </p>
              </div>

              <div>
                <p className="text-slate-400">Status</p>
                <p
                  className={`font-bold mt-1 ${
                    viewUser.is_active
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {viewUser.status}
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setViewUser(null)}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
