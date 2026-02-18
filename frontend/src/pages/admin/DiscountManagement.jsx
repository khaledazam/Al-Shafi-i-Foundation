import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import { FaPlus, FaEdit, FaTrash, FaPercentage, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const DiscountManagement = () => {
    const [products, setProducts] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingDiscount, setEditingDiscount] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [formData, setFormData] = useState({
        productId: '',
        discountPercent: '',
        startDate: '',
        endDate: '',
        minQuantity: 1,
        isActive: true
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [productsRes, discountsRes] = await Promise.all([
                api.get('/products?limit=100'),
                api.get('/discounts')
            ]);
            setProducts(productsRes.data.data || productsRes.data || []);
            setDiscounts(discountsRes.data.data || discountsRes.data || []);
        } catch (error) {
            toast.error('فشل جلب البيانات');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // فلترة المنتجات حسب البحث
    const filteredProducts = products.filter(product =>
        product.name?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.name?.ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // إيجاد الخصم الخاص بالمنتج (لو موجود)
    const getProductDiscount = (productId) => {
        return discounts.find(d =>
            d.productId?._id === productId || d.productId === productId
        );
    };

    const openModal = (product, discount = null) => {
        setSelectedProduct(product);
        setEditingDiscount(discount);
        setFormData({
            productId: product._id,
            discountPercent: discount ? discount.discountPercent : '',
            startDate: discount ? new Date(discount.startDate).toISOString().split('T')[0] : '',
            endDate: discount ? new Date(discount.endDate).toISOString().split('T')[0] : '',
            minQuantity: discount ? discount.minQuantity : 1,
            isActive: discount ? discount.isActive : true
        });
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingDiscount) {
                await api.put(`/discounts/${editingDiscount._id}`, formData);
                toast.success('تم تحديث الخصم بنجاح');
            } else {
                await api.post('/discounts', formData);
                toast.success('تم إضافة الخصم بنجاح');
            }
            setShowModal(false);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'حدث خطأ');
        }
    };

    const handleDelete = async (discountId) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الخصم؟')) {
            try {
                await api.delete(`/discounts/${discountId}`);
                toast.success('تم حذف الخصم بنجاح');
                fetchData();
            } catch (error) {
                toast.error('فشل حذف الخصم');
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-navy-950">
            <Sidebar />

            <div className="flex-1 p-6 md:p-10 overflow-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-navy-950 dark:text-white mb-2 tracking-tight">
                            إدارة <span className="text-primary-500">الخصومات</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">
                            إضافة وتعديل عروض الخصم على المنتجات مباشرة
                        </p>
                    </div>

                    <div className="relative w-full md:w-80">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="ابحث عن منتج (اسم أو فئة)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-full bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary-500"></div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-max">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-navy-800 border-b border-gray-200 dark:border-navy-700">
                                        <th className="text-left py-5 px-6 font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-300">المنتج</th>
                                        <th className="text-left py-5 px-6 font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-300">السعر</th>
                                        <th className="text-left py-5 px-6 font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-300">الخصم الحالي</th>
                                        <th className="text-center py-5 px-6 font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-300">إجراءات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-navy-800">
                                    {filteredProducts.map((product) => {
                                        const discount = getProductDiscount(product._id);
                                        return (
                                            <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-navy-800/50 transition-colors">
                                                <td className="py-5 px-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 dark:bg-navy-800 flex-shrink-0">
                                                            {product.image ? (
                                                                <img
                                                                    src={product.image}
                                                                    alt={product.name?.en}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/56?text=No+Image'; }}
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-navy-950 dark:text-white">{product.name?.en}</p>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">{product.name?.ar}</p>
                                                            <p className="text-xs text-gray-400">{product.category}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-6">
                                                    <span className="font-bold text-lg text-primary-600">{product.price} ج.م</span>
                                                </td>
                                                <td className="py-5 px-6">
                                                    {discount ? (
                                                        <div className="flex flex-col">
                                                            <span className="text-green-600 font-bold text-xl">{discount.discountPercent}%</span>
                                                            <span className="text-xs text-gray-500">
                                                                حتى {new Date(discount.endDate).toLocaleDateString('ar-EG')}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 italic">لا يوجد خصم حالي</span>
                                                    )}
                                                </td>
                                                <td className="py-5 px-6 text-center">
                                                    <div className="flex justify-center gap-4">
                                                        <button
                                                            onClick={() => openModal(product, discount)}
                                                            className={`p-3 rounded-xl transition-all ${discount
                                                                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 hover:bg-amber-200'
                                                                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 hover:bg-blue-200'
                                                                }`}
                                                            title={discount ? 'تعديل الخصم' : 'إضافة خصم'}
                                                        >
                                                            {discount ? <FaEdit /> : <FaPlus />}
                                                        </button>

                                                        {discount && (
                                                            <button
                                                                onClick={() => handleDelete(discount._id)}
                                                                className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200 rounded-xl transition-all"
                                                                title="حذف الخصم"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="text-center py-24">
                                <p className="text-gray-400 text-xl font-medium">
                                    {searchTerm ? 'لا توجد منتجات مطابقة للبحث' : 'لا توجد منتجات متاحة'}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Modal for Add/Edit Discount */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-navy-900 rounded-2xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold mb-6 text-navy-950 dark:text-white">
                                {editingDiscount ? 'تعديل الخصم' : 'إضافة خصم جديد'}
                            </h2>

                            <div className="mb-6 p-4 bg-gray-50 dark:bg-navy-800 rounded-xl">
                                <p className="font-semibold text-navy-950 dark:text-white">
                                    المنتج المختار: {selectedProduct?.name?.en}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {selectedProduct?.name?.ar} • {selectedProduct?.price} ج.م
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        نسبة الخصم (%)
                                    </label>
                                    <input
                                        type="number"
                                        name="discountPercent"
                                        value={formData.discountPercent}
                                        onChange={handleInputChange}
                                        required
                                        min="1"
                                        max="100"
                                        placeholder="مثال: 25"
                                        className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-navy-800 dark:border-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                            تاريخ البدء
                                        </label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-navy-800 dark:border-navy-700 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                            تاريخ الانتهاء
                                        </label>
                                        <input
                                            type="date"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-navy-800 dark:border-navy-700 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        الحد الأدنى للكمية
                                    </label>
                                    <input
                                        type="number"
                                        name="minQuantity"
                                        value={formData.minQuantity}
                                        onChange={handleInputChange}
                                        required
                                        min="1"
                                        className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-navy-800 dark:border-navy-700 dark:text-white"
                                    />
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 text-primary-500 rounded"
                                    />
                                    <label className="text-gray-700 dark:text-gray-300 font-medium">
                                        تفعيل الخصم الآن
                                    </label>
                                </div>

                                <div className="flex gap-4 mt-8">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-3.5 rounded-xl font-bold transition"
                                    >
                                        {editingDiscount ? 'تحديث الخصم' : 'إضافة الخصم'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3.5 rounded-xl font-bold transition"
                                    >
                                        إلغاء
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiscountManagement;