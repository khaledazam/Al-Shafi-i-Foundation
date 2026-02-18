import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import { FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import adminService from '../../utils/adminService';
import ProductTable from '../../components/admin/ProductTable';
import ProductForm from '../../components/admin/ProductForm';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Pagination & Filter State
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [category, setCategory] = useState('All');

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: 10,
                category: category === 'All' ? '' : category
            };
            const res = await adminService.get('/products', { params });
            setProducts(res.data.data);
            setTotalPages(Math.ceil(res.data.pagination.total / 10));
        } catch (error) {
            toast.error('Failed to fetch inventory');
        } finally {
            setLoading(false);
        }
    }, [page, category]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleFormSubmit = async () => {
        // Form submission is now handled internally by ProductForm using fetch
        // as per requirements. We just need to refresh and close.
        setShowModal(false);
        fetchProducts();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await adminService.delete(`/products/${id}`);
                toast.success('Product removed');
                fetchProducts();
            } catch (error) {
                toast.error('Deletion failed');
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-navy-950">
            <Sidebar />
            <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-navy-950 dark:text-white tracking-tight">
                            Inventory <span className="text-primary-500">Control</span>
                        </h1>
                        <p className="text-gray-500 font-medium">Manage your digital swatch library and stock.</p>
                    </div>
                    <button
                        onClick={() => { setEditingProduct(null); setShowModal(true); }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl flex items-center gap-3 transition-all"
                    >
                        <FaPlus /> New SWATCH
                    </button>
                </header>

                <ProductTable
                    products={products}
                    totalPages={totalPages}
                    currentPage={page}
                    onPageChange={setPage}
                    onEdit={(p) => { setEditingProduct(p); setShowModal(true); }}
                    onDelete={handleDelete}
                    category={category}
                    onCategoryChange={(cat) => { setCategory(cat); setPage(1); }}
                />

                <ProductForm
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleFormSubmit}
                    initialData={editingProduct}
                />

                {loading && (
                    <div className="fixed inset-0 bg-white/50 dark:bg-navy-950/50 flex items-center justify-center z-[110]">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductManagement;
