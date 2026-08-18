import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Power, X } from 'lucide-react';
import { api } from '../../api/axios';
import { getCurrency, formatMoney } from "../../config/regional";

interface LoanProduct {
  id: string;
  tenant_id: string;
  name: string;
  code: string;
  interest_method: string;
  repayment_frequency: string;
  interest_rate: number;
  min_amount: number;
  max_amount: number;
  max_term_months: number;
  is_active: boolean;
}

interface ProductForm {
  name: string;
  code: string;
  interest_method: string;
  repayment_frequency: string;
  interest_rate: string;
  min_amount: string;
  max_amount: string;
  max_term_months: string;
}

const emptyForm: ProductForm = {
  name: '',
  code: '',
  interest_method: 'DECLINING',
  repayment_frequency: 'MONTHLY',
  interest_rate: '',
  min_amount: '',
  max_amount: '',
  max_term_months: '',
};

export const LoanProducts = () => {
  const [products, setProducts] = useState<LoanProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/loan-products');
      setProducts(response.data || []);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
        'Unable to load loan products.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const updateForm = (
    field: keyof ProductForm,
    value: string
  ) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setSuccess('');
    setShowForm(true);
  };

  const openEdit = (product: LoanProduct) => {
    setEditingId(product.id);

    setForm({
      name: product.name,
      code: product.code,
      interest_method: product.interest_method,
      repayment_frequency: product.repayment_frequency,
      interest_rate: String(product.interest_rate),
      min_amount: String(product.min_amount),
      max_amount: String(product.max_amount),
      max_term_months: String(product.max_term_months),
    });

    setError('');
    setSuccess('');
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const payload = {
        name: form.name,
        code: form.code,
        interest_method: form.interest_method,
        repayment_frequency: form.repayment_frequency,
        interest_rate: Number(form.interest_rate),
        min_amount: Number(form.min_amount),
        max_amount: Number(form.max_amount),
        max_term_months: Number(form.max_term_months),
      };

      if (editingId) {
        await api.put(
          `/loan-products/${editingId}`,
          payload
        );

        setSuccess('Loan product updated successfully.');
      } else {
        await api.post(
          '/loan-products',
          payload
        );

        setSuccess('Loan product created successfully.');
      }

      await loadProducts();
      closeForm();
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
        'Unable to save loan product.'
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (
    product: LoanProduct
  ) => {
    try {
      setError('');
      setSuccess('');

      await api.patch(
        `/loan-products/${product.id}/status`,
        {
          is_active: !product.is_active,
        }
      );

      setSuccess(
        product.is_active
          ? 'Loan product deactivated.'
          : 'Loan product activated.'
      );

      await loadProducts();
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
        'Unable to change product status.'
      );
    }
  };

  const formatMoney = (value: number) =>
    new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: getCurrency(),
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Loan Products
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Configure the loan products available for lending.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#189AB4] text-white font-semibold hover:opacity-90"
        >
          <Plus size={18} />
          New Loan Product
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-200 text-green-700 px-4 py-3">
          {success}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Loading loan products...
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <h2 className="text-lg font-semibold text-slate-700">
              No loan products yet
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Create your first loan product to start issuing loans.
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase">
                    Product
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase">
                    Code
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase">
                    Interest
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase">
                    Amount Range
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase">
                    Maximum Term
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase">
                    Status
                  </th>

                  <th className="text-right px-5 py-4 text-xs font-bold text-slate-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map(product => (
                  <tr
                    key={product.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-800">
                        {product.name}
                      </div>

                      <div className="text-xs text-slate-500">
                        {product.repayment_frequency}
                      </div>
                    </td>

                    <td className="px-5 py-4 font-mono text-sm text-slate-600">
                      {product.code}
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-700">
                        {product.interest_rate}%
                      </div>

                      <div className="text-xs text-slate-500">
                        {product.interest_method}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatMoney(product.min_amount)}
                      {' — '}
                      {formatMoney(product.max_amount)}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {product.max_term_months} months
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                          product.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {product.is_active
                          ? 'Active'
                          : 'Inactive'}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-[#189AB4]"
                          title="Edit"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() => toggleStatus(product)}
                          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                          title={
                            product.is_active
                              ? 'Deactivate'
                              : 'Activate'
                          }
                        >
                          <Power size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between px-6 py-5 border-b">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {editingId
                    ? 'Edit Loan Product'
                    : 'Create Loan Product'}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Define the lending rules for this product.
                </p>
              </div>

              <button
                onClick={closeForm}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
            >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Product Name
                  </label>

                  <input
                    required
                    value={form.name}
                    onChange={e =>
                      updateForm('name', e.target.value)
                    }
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                    placeholder="Business Loan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Product Code
                  </label>

                  <input
                    required
                    value={form.code}
                    onChange={e =>
                      updateForm('code', e.target.value)
                    }
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                    placeholder="BL01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Interest Method
                  </label>

                  <select
                    value={form.interest_method}
                    onChange={e =>
                      updateForm(
                        'interest_method',
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300"
                  >
                    <option value="DECLINING">
                      Declining Balance
                    </option>

                    <option value="FLAT">
                      Flat Rate
                    </option>

                    <option value="COMPOUND">
                      Compound Interest
                    </option>

                    <option value="ZERO">
                      Zero Interest
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Repayment Frequency
                  </label>

                  <select
                    value={form.repayment_frequency}
                    onChange={e =>
                      updateForm(
                        'repayment_frequency',
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300"
                  >
                    <option value="MONTHLY">Monthly</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="BIWEEKLY">Biweekly</option>
                    <option value="DAILY">Daily</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Interest Rate (%)
                  </label>

                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.interest_rate}
                    onChange={e =>
                      updateForm(
                        'interest_rate',
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Maximum Term (months)
                  </label>

                  <input
                    required
                    type="number"
                    min="1"
                    value={form.max_term_months}
                    onChange={e =>
                      updateForm(
                        'max_term_months',
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Minimum Amount
                  </label>

                  <input
                    required
                    type="number"
                    min="1"
                    value={form.min_amount}
                    onChange={e =>
                      updateForm(
                        'min_amount',
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Maximum Amount
                  </label>

                  <input
                    required
                    type="number"
                    min="1"
                    value={form.max_amount}
                    onChange={e =>
                      updateForm(
                        'max_amount',
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300"
                  />
                </div>

              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-[#189AB4] text-white font-semibold disabled:opacity-50"
                >
                  {saving
                    ? 'Saving...'
                    : editingId
                      ? 'Update Product'
                      : 'Create Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};
