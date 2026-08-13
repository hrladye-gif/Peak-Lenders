import React, { useEffect, useState } from 'react';
import { Building2, Plus, MapPin, Users, Phone, X } from 'lucide-react';
import { api } from '../../api/axios';

interface Branch {
  id: string;
  name: string;
  code: string;
  address?: string | null;
}

interface BranchForm {
  name: string;
  code: string;
  address: string;
}

export const Branches = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<BranchForm>({
    name: '',
    code: '',
    address: '',
  });

  const getTenantId = () => {
    const storedUser = localStorage.getItem('user');

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

  const loadBranches = async () => {
    setLoading(true);
    setError('');

    try {
      const tenantId = getTenantId();

      if (!tenantId) {
        throw new Error(
          'Your login session does not contain a tenant ID. Please log out and log in again.'
        );
      }

      const response = await api.get(`/branches/${tenantId}`);

      setBranches(response.data || []);
    } catch (err: any) {
      console.error('Failed to load branches:', err);

      setError(
        err.response?.data?.detail ||
        err.message ||
        'Failed to load branches.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  const openModal = () => {
    setError('');

    setForm({
      name: '',
      code: '',
      address: '',
    });

    setShowModal(true);
  };

  const closeModal = () => {
    if (!saving) {
      setShowModal(false);
    }
  };

  const addBranch = async (e: React.FormEvent) => {
    e.preventDefault();

    const tenantId = getTenantId();

    if (!tenantId) {
      setError(
        'Your login session does not contain a tenant ID. Please log out and log in again.'
      );
      return;
    }

    if (!form.name.trim() || !form.code.trim()) {
      setError('Branch name and branch code are required.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await api.post('/branches/', {
        tenant_id: tenantId,
        name: form.name.trim(),
        code: form.code.trim(),
        address: form.address.trim() || null,
      });

      setShowModal(false);

      setForm({
        name: '',
        code: '',
        address: '',
      });

      await loadBranches();
    } catch (err: any) {
      console.error('Failed to create branch:', err);

      setError(
        err.response?.data?.detail ||
        err.message ||
        'Failed to create branch.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#05445E]">
            Branch Operations
          </h1>

          <p className="text-sm text-slate-500">
            Manage regional branches and organizational hierarchy
          </p>
        </div>

        <button
          type="button"
          onClick={openModal}
          className="flex items-center gap-2 bg-[#189AB4] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md hover:bg-[#05445E] transition-colors"
        >
          <Plus size={16} />
          Add New Branch
        </button>
      </div>

      {/* ERROR */}
      {error && !showModal && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs text-slate-400">
            Total Branches
          </p>

          <p className="text-3xl font-bold text-[#05445E] mt-2">
            {loading ? '...' : branches.length}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs text-slate-400">
            Active Branches
          </p>

          <p className="text-3xl font-bold text-[#189AB4] mt-2">
            {loading ? '...' : branches.length}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs text-slate-400">
            Locations
          </p>

          <p className="text-3xl font-bold text-[#05445E] mt-2">
            {loading
              ? '...'
              : new Set(
                  branches.map((branch) => branch.address).filter(Boolean)
                ).size}
          </p>
        </div>

      </div>

      {/* BRANCHES */}
      {loading ? (

        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500">
          Loading branches...
        </div>

      ) : branches.length === 0 ? (

        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">

          <div className="mx-auto w-16 h-16 rounded-2xl bg-[#189AB4]/10 text-[#189AB4] flex items-center justify-center mb-4">
            <Building2 size={30} />
          </div>

          <h3 className="text-lg font-bold text-[#05445E]">
            No branches yet
          </h3>

          <p className="text-sm text-slate-500 mt-1 mb-5">
            Create your first branch to start managing branch operations.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {branches.map((branch) => (

            <div
              key={branch.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4"
            >

              <div className="flex justify-between items-start border-b border-slate-100 pb-3">

                <div className="flex items-center gap-3">

                  <div className="p-3 bg-[#189AB4]/10 rounded-xl text-[#189AB4]">
                    <Building2 size={22} />
                  </div>

                  <div>

                    <h3 className="font-bold text-[#05445E] text-sm">
                      {branch.name}
                    </h3>

                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      {branch.code}
                    </span>

                  </div>

                </div>

              </div>

              <div className="space-y-2 text-xs text-slate-600">

                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-slate-400" />

                  {branch.address || 'No address provided'}
                </div>

                <div className="flex items-center gap-2">
                  <Users size={14} className="text-slate-400" />

                  Branch operations
                </div>

                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-slate-400" />

                  Contact information not configured
                </div>

              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">

                <span className="text-slate-400">
                  Status:
                </span>

                <span className="font-bold text-green-600">
                  Active
                </span>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* MODAL */}
      {showModal && (

        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">

            <div className="flex items-center justify-between mb-6">

              <div>
                <h2 className="text-2xl font-bold text-[#05445E]">
                  Add New Branch
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Create a branch for your institution
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"
              >
                <X size={20} />
              </button>

            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <form
              onSubmit={addBranch}
              className="space-y-4"
            >

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Branch Name
                </label>

                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g. Kampala Central Branch"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                />

              </div>

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Branch Code
                </label>

                <input
                  type="text"
                  required
                  value={form.code}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      code: e.target.value,
                    })
                  }
                  placeholder="e.g. KLA-01"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                />

              </div>

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Address
                </label>

                <input
                  type="text"
                  value={form.address}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      address: e.target.value,
                    })
                  }
                  placeholder="e.g. Plot 42 Kampala Road"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                />

              </div>

              <div className="flex justify-end gap-3 pt-4">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#189AB4] hover:bg-[#05445E] text-white px-6 py-3 rounded-xl text-sm font-semibold disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Branch'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};
