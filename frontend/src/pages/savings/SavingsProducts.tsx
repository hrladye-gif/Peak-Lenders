import React, { useState, useEffect } from 'react';
import { Plus, PiggyBank, X, CheckCircle2 } from 'lucide-react';
import { api } from '../../api/axios';

interface SavingsProduct {
  id: string;
  name: string;
  code: string;
  interest_rate: number;
  minimum_balance: number;
  is_active: boolean;
}

export const SavingsProducts = () => {
  const [products, setProducts] = useState<SavingsProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [minBalance, setMinBalance] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await api.get('/savings/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch savings products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !code) return;

    try {
      await api.post('/savings/products', {
        name,
        code,
        interest_rate: parseFloat(interestRate) || 0,
        minimum_balance: parseFloat(minBalance) || 0,
        is_active: true,
      });

      setSuccessMessage('Savings product created successfully!');
      setIsModalOpen(false);
      setName('');
      setCode('');
      setInterestRate('');
      setMinBalance('');

      fetchProducts();

      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (error) {
      console.error('Failed to create savings product', error);
    }
  };

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#05445E]">
            Savings Products
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Configure interest rates and rules for member savings.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#189AB4] hover:bg-[#05445E] text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="p-4 bg-[#D4F1F4] border border-[#75D1DF] text-[#05445E] rounded-xl flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      {/* Products */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center text-slate-500">
          Loading savings products...
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
          <div className="mx-auto w-fit p-4 bg-[#D4F1F4] text-[#05445E] rounded-2xl">
            <PiggyBank className="w-8 h-8" />
          </div>

          <h3 className="mt-4 text-lg font-bold text-[#05445E]">
            No Savings Products
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Create your first savings product to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 bg-[#D4F1F4] text-[#05445E] rounded-xl">
                  <PiggyBank className="w-6 h-6" />
                </div>

                <span className="text-xs font-semibold px-3 py-1.5 bg-slate-100 text-[#05445E] rounded-full">
                  {product.code}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#05445E]">
                  {product.name}
                </h3>

                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      product.is_active
                        ? 'bg-[#D4F1F4] text-[#05445E]'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {product.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 block text-xs font-semibold uppercase">
                    Interest Rate
                  </span>

                  <span className="font-bold text-[#05445E] text-lg">
                    {product.interest_rate}%
                  </span>

                  <span className="block text-xs text-slate-400">
                    per annum
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-xs font-semibold uppercase">
                    Min Balance
                  </span>

                  <span className="font-bold text-[#05445E] text-lg">
                    {Number(product.minimum_balance).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">

            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#05445E]">
                  New Savings Product
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Configure a new savings product.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-[#05445E] hover:bg-[#D4F1F4] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">

              <div>
                <label className="block text-sm font-semibold text-[#05445E]">
                  Product Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189AB4] focus:border-[#189AB4]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#05445E]">
                  Product Code
                </label>

                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full mt-1 px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189AB4] focus:border-[#189AB4]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#05445E]">
                  Interest Rate (% p.a.)
                </label>

                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="w-full mt-1 px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189AB4] focus:border-[#189AB4]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#05445E]">
                  Minimum Balance
                </label>

                <input
                  type="number"
                  value={minBalance}
                  onChange={(e) => setMinBalance(e.target.value)}
                  className="w-full mt-1 px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189AB4] focus:border-[#189AB4]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-300 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#189AB4] hover:bg-[#05445E] text-white rounded-xl font-semibold shadow-sm transition-colors"
                >
                  Save Product
                </button>

              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
