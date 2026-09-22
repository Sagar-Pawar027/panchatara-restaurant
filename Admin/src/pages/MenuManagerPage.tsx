import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  UtensilsCrossed,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  Sparkles,
  Flame,
  Leaf,
  Filter,
  RefreshCw,
  X,
} from 'lucide-react';
import {
  getMenuItems,
  createMenuItem,
  toggleMenuItemStock,
  updateMenuItem,
  deleteMenuItem,
  AdminMenuItem,
} from '../services/api.ts';
import { MenuManagerShimmer } from '../components/AdminShimmer.tsx';

const CATEGORIES = [
  'All',
  'Starters & Tandoor',
  'Main Course (Paneer & Gravies)',
  'Dal & Rice',
  'Breads & Tandoori Roti',
  'Desserts & Beverages',
];

export function MenuManagerPage() {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // TanStack Query for Menu items
  const { data: items = [], isLoading: loading, refetch } = useQuery({
    queryKey: ['admin-menu'],
    queryFn: getMenuItems,
  });

  // TanStack Mutations
  const toggleStockMutation = useMutation({
    mutationFn: (id: string) => toggleMenuItemStock(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMenuItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async ({ id, data }: { id?: string; data: Partial<AdminMenuItem> }) => {
      if (id) {
        return await updateMenuItem(id, data);
      } else {
        return await createMenuItem(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setIsModalOpen(false);
    },
  });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminMenuItem | null>(null);
  const [formName, setFormName] = useState('');
  const [formHindiName, setFormHindiName] = useState('');
  const [formCategory, setFormCategory] = useState(CATEGORIES[1]);
  const [formPrice, setFormPrice] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSpiceLevel, setFormSpiceLevel] = useState(1);
  const [formIsSignature, setFormIsSignature] = useState(false);
  const [formDietary, setFormDietary] = useState<string[]>(['veg', 'jain-available']);

  const openAddModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormHindiName('');
    setFormCategory(CATEGORIES[1]);
    setFormPrice('350');
    setFormDescription('');
    setFormSpiceLevel(1);
    setFormIsSignature(false);
    setFormDietary(['veg', 'jain-available']);
    setIsModalOpen(true);
  };

  const openEditModal = (item: AdminMenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormHindiName(item.hindiName || '');
    setFormCategory(item.category || CATEGORIES[1]);
    setFormPrice(item.price.replace('₹', ''));
    setFormDescription(item.description || '');
    setFormSpiceLevel(item.spiceLevel || 1);
    setFormIsSignature(Boolean(item.isSignature));
    setFormDietary(item.dietary || ['veg']);
    setIsModalOpen(true);
  };

  const handleToggleStock = (id: string) => {
    toggleStockMutation.mutate(id);
  };

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the menu?`)) return;
    deleteMutation.mutate(id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPrice) return;

    const payload: Partial<AdminMenuItem> = {
      name: formName,
      hindiName: formHindiName,
      category: formCategory,
      price: formPrice.startsWith('₹') ? formPrice : `₹${formPrice}`,
      description: formDescription,
      spiceLevel: Number(formSpiceLevel),
      isSignature: formIsSignature,
      dietary: formDietary,
      isAvailable: true,
    };

    saveMutation.mutate({
      id: editingItem ? (editingItem._id || editingItem.id) : undefined,
      data: payload,
    });
  };

  // Filtered list
  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.hindiName && item.hindiName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return <MenuManagerShimmer />;
  }

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <h1 className="font-editorial-display text-2xl font-bold text-[#FAF7F2]">
            Menu Inventory &amp; Stock Manager
          </h1>
          <p className="text-xs text-white/60 mt-1">
            Toggle in-stock status instantly, adjust prices, and add signature culinary creations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
            title="Refresh list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={openAddModal}
            className="px-4 py-2.5 bg-[#C5A880] hover:bg-[#B39366] text-[#12110F] text-xs font-semibold tracking-wider uppercase rounded-lg transition-all shadow flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Dish</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative md:col-span-1">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dish by name, ingredients..."
            className="w-full pl-10 pr-4 py-2 bg-[#181614] border border-white/10 rounded-lg text-xs text-[#FAF7F2] placeholder-white/30 focus:outline-none focus:border-[#C5A880]"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="md:col-span-2 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#C5A880] text-[#12110F] font-semibold'
                  : 'bg-[#181614] text-white/70 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Table / Cards */}
      {filteredItems.length === 0 ? (
        <div className="py-16 text-center bg-[#181614] rounded-xl border border-white/10 p-6 space-y-3">
          <UtensilsCrossed className="w-8 h-8 text-white/20 mx-auto" />
          <p className="text-xs text-white/50">No dishes match the selected filter criteria.</p>
        </div>
      ) : (
        <div className="bg-[#181614] border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/40 text-white/50 uppercase tracking-wider text-[10px] border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Dish Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock Status</th>
                  <th className="py-3 px-4">Dietary</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredItems.map((item) => {
                  const id = item._id || item.id!;
                  const inStock = item.isAvailable !== false;

                  return (
                    <tr key={id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#FAF7F2] flex items-center gap-2">
                          <span>{item.name}</span>
                          {item.isSignature && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/30 font-medium uppercase">
                              Signature
                            </span>
                          )}
                        </div>
                        {item.hindiName && (
                          <div className="text-[11px] text-white/40">{item.hindiName}</div>
                        )}
                        <div className="text-[11px] text-white/50 line-clamp-1 max-w-sm mt-0.5">
                          {item.description}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-white/70">
                        <span className="px-2 py-0.5 bg-white/5 rounded border border-white/10 text-[11px]">
                          {item.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-[#C5A880]">
                        {item.price}
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleStock(id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                            inStock
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                              : 'bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25'
                          }`}
                          title="Click to toggle availability"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${inStock ? 'bg-emerald-400' : 'bg-red-400'}`} />
                          <span>{inStock ? 'In Stock' : 'Sold Out'}</span>
                        </button>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 flex-wrap">
                          {item.dietary?.includes('jain-available') && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500/10 text-amber-300 border border-amber-500/20">
                              Jain Available
                            </span>
                          )}
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                            100% Pure Veg
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 rounded bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors"
                            title="Edit details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(id, item.name)}
                            className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                            title="Remove dish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Dish Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#181614] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="font-editorial-display text-lg font-bold text-[#FAF7F2]">
                {editingItem ? 'Edit Culinary Dish' : 'Add New Menu Item'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-white/70 block">
                    Dish Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Malai Kofta Angari"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-white/70 block">
                    Name (Hindi Script)
                  </label>
                  <input
                    type="text"
                    value={formHindiName}
                    onChange={(e) => setFormHindiName(e.target.value)}
                    placeholder="e.g. मलाई कोफ्ता अंगारी"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-white/70 block">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c} className="bg-[#181614] text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-white/70 block">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="395"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-white/70 block">
                  Description &amp; Ingredients
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Fresh cottage cheese dumplings simmered in rich cashew tomato gravy with aromatic spices..."
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80">
                  <input
                    type="checkbox"
                    checked={formIsSignature}
                    onChange={(e) => setFormIsSignature(e.target.checked)}
                    className="rounded text-[#C5A880] focus:ring-0"
                  />
                  <span>Mark as Chef's Signature Dish</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80">
                  <input
                    type="checkbox"
                    checked={formDietary.includes('jain-available')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormDietary([...formDietary, 'jain-available']);
                      } else {
                        setFormDietary(formDietary.filter((d) => d !== 'jain-available'));
                      }
                    }}
                    className="rounded text-[#C5A880] focus:ring-0"
                  />
                  <span>Jain Friendly Option Available</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 text-xs rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-5 py-2 bg-[#C5A880] hover:bg-[#B39366] text-[#12110F] font-semibold text-xs rounded-lg transition-colors shadow disabled:opacity-50"
                >
                  {saveMutation.isPending ? 'Saving...' : (editingItem ? 'Save Changes' : 'Create Dish')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
