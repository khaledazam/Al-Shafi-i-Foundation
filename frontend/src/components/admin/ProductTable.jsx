import React from 'react';
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight, FaImage } from 'react-icons/fa';

const ProductTable = ({ products, totalPages, currentPage, onPageChange, onEdit, onDelete, category, onCategoryChange }) => {
    return (
        <div className="bg-white dark:bg-navy-900 rounded-3xl shadow-xl overflow-hidden">
            {/* Toolbar */}
            <div className="p-6 border-b border-gray-100 dark:border-navy-800 flex flex-wrap items-center justify-between gap-4">
                <h3 className="text-xl font-bold">Product Inventory</h3>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500">Filter:</span>
                    <select
                        value={category}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="bg-gray-50 dark:bg-navy-800 border-none rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="All">All Categories</option>
                        <option value="Paint">Paint</option>
                        <option value="Wallpaper">Wallpaper</option>
                        <option value="Decor">Decor</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-navy-800 border-b border-gray-100 dark:border-navy-800">
                        <tr>
                            <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Product</th>
                            <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Category</th>
                            <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Color Spec</th>
                            <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Price</th>
                            <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Stock</th>
                            <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Created By</th>
                            <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-navy-800">
                        {products.map((p) => (
                            <tr key={p._id} className="hover:bg-gray-50/50 dark:hover:bg-navy-800/50 transition-colors">
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        {p.image ? (
                                            <img src={p.image} alt={p.name.en} className="w-12 h-12 rounded-xl object-cover shadow-sm border border-gray-100 dark:border-navy-700" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-navy-800 flex items-center justify-center text-gray-400">
                                                <FaImage size={20} />
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-bold text-navy-900 dark:text-white">{p.name.en}</p>
                                            <p className="text-xs text-secondary-500" dir="rtl">{p.name.ar}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-[10px] font-black uppercase">
                                        {p.category}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg shadow-sm border border-gray-100 dark:border-navy-700" style={{ backgroundColor: p.hexCode }} />
                                        <div className="text-[10px] font-mono">
                                            <p className="font-bold">{p.hexCode}</p>
                                            <p className="text-gray-400">RGB({p.rgbValues.r}, {p.rgbValues.g}, {p.rgbValues.b})</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <p className="text-sm font-bold text-primary-600 dark:text-primary-400">ج.م {p.price}</p>
                                </td>
                                <td className="p-6">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${p.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                        {p.stock} units
                                    </span>
                                </td>
                                <td className="p-6">
                                    <p className="text-sm font-medium">{p.createdBy?.fullName || 'System'}</p>
                                </td>
                                <td className="p-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => onEdit(p)} className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 transition-colors">
                                            <FaEdit size={14} />
                                        </button>
                                        <button onClick={() => onDelete(p._id)} className="p-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 transition-colors">
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="p-6 bg-gray-50 dark:bg-navy-800/30 flex items-center justify-between border-t border-gray-100 dark:border-navy-800">
                <p className="text-sm text-gray-500">
                    Page <span className="font-bold text-navy-900 dark:text-white">{currentPage}</span> of <span className="font-bold text-navy-900 dark:text-white">{totalPages}</span>
                </p>
                <div className="flex gap-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => onPageChange(currentPage - 1)}
                        className="p-2 rounded-lg border border-gray-200 dark:border-navy-700 disabled:opacity-30 hover:bg-white dark:hover:bg-navy-800 transition-colors"
                    >
                        <FaChevronLeft size={14} />
                    </button>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => onPageChange(currentPage + 1)}
                        className="p-2 rounded-lg border border-gray-200 dark:border-navy-700 disabled:opacity-30 hover:bg-white dark:hover:bg-navy-800 transition-colors"
                    >
                        <FaChevronRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductTable;
