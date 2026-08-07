import React, { useState } from 'react';
import { Plus, PiggyBank, Percent, Layers, X, CheckCircle2 } from 'lucide-react';

interface SavingsProduct {
  id: string;
  name: string;
  code: string;
  interestRate: number;
  minBalance: number;
  description: string;
}

export const SavingsProducts = () => {
  const [products, setProducts] = useState<SavingsProduct[]>([
    { id: '1', name: 'Regular Savings', code: 'REG-01', interestRate: 4.5, minBalance: 50000, description: 'Standard everyday savings account for individual members.' },
    { id: '2', name: 'Fixed Time Deposit', code: 'FIX-02', interestRate: 10.0, minBalance: 500000, description: 'High-yield locked deposit for terms of 6 to 12 months.' },
    { id: '3', name: 'Junior Savings Club', code: 'JUN-03', interestRate: 6.0, minBalance: 10000, description: 'Designed for children under 18 with high compounding interest.' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [minBalance, setMinBalance] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    const newProduct: SavingsProduct = {
      id: Date.now().toString(),
      name,
      code,
      interestRate: parseFloat(interestRate) || 0,
      minBalance: parseFloat(minBalance) || 0,
      description,
    };

    setProducts([newProduct, ...products]);
    setIsModalOpen(false);
    setSuccessMessage('Savings product created successfully!');

    // Reset form
    setName('');
    setCode('');
    setInterestRate('');
    setMinBalance('');
    setDescription('');

    setTimeout(() => setSuccessMessage(''), 4000);
  };

  return (
    <div className="p-8 w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Savings Products</h1>
          <p className="text-xs text-slate-500 mt-1">Configure interest tiers, minimum thresholds, and deposit terms.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#05445E] hover:bg-[#032d3f] text-white px-4 py-2.5 rounded-xl font-medium text-xs shadow-md transition-all cursor-pointer"
        >
          <Plus size={16} /> Add New Product
        </button>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs flex items-center gap-2 shadow-sm">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full">
            <div>
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#189AB4]/10 text-[#05445E] flex items-center justify-center font-bold">
                  <PiggyBank size={20} />
                </div>
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                  {product.code}
                </span>
              </div>
              <h3 className="font-bold text-slate-800 text-sm mt-4">{product.name}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{product.description}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Interest Rate</span>
                <span className="font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                  <Percent size={12} /> {product.interestRate}% p.a.
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Min Balance</span>
                <span className="font-bold text-slate-700 mt-0.5 block">
                  {product.minBalance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#05445E]/10 text-[#05445E] flex items-center justify-center">
                  <Layers size={18} />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Create Savings Product</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gold Tier Savings"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GLD-04"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Interest Rate (% p.a.)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 7.5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Minimum Operating Balance</label>
                <input
                  type="number"
                  placeholder="e.g. 20000"
                  value={minBalance}
                  onChange={(e) => setMinBalance(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief summary of terms and conditions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189AB4] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#05445E] hover:bg-[#032d3f] text-white rounded-xl font-medium shadow-md transition-all cursor-pointer"
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

export default SavingsProducts;
