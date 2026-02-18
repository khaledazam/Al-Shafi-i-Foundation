import React, { useState, useEffect } from 'react';
import { FaTimes, FaPalette } from 'react-icons/fa';
import api from '../../utils/api';

const ProductForm = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        name: { en: '', ar: '' },
        description: { en: '', ar: '' },
        category: 'Paint',
        hexCode: '#f43f5e',
        rgbValues: { r: 244, g: 63, b: 94 },
        isActive: true,
        price: 0,
        stock: 0
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                isActive: initialData.isActive === 'true' || initialData.isActive === true
            });
            setImagePreview(initialData.image || '');
        } else {
            resetForm();
        }
        setError(null);
    }, [initialData, isOpen]);

    const resetForm = () => {
        setFormData({
            name: { en: '', ar: '' },
            description: { en: '', ar: '' },
            category: 'Paint',
            hexCode: '#f43f5e',
            rgbValues: { r: 244, g: 63, b: 94 },
            isActive: true,
            price: 0,
            stock: 0
        });
        setImageFile(null);
        setImagePreview('');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('File too large (max 5MB)');
                return;
            }
            if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                setError('Invalid file type');
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
            setError(null);
        }
    };

    const handleNestedChange = (parent, field, value) => {
        setFormData(prev => ({
            ...prev,
            [parent]: { ...prev[parent], [field]: value }
        }));
    };

    const handleHexChange = (e) => {
        const hex = e.target.value;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        setFormData(prev => ({
            ...prev,
            hexCode: hex,
            rgbValues: { r, g, b }
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            setError(null);
            setLoading(true);

            if (!formData.name.en || !formData.hexCode || !formData.category) {
                setError('Please fill in required fields');
                setLoading(false);
                return;
            }

            const data = new FormData();
            data.append('name', JSON.stringify(formData.name));
            data.append('description', JSON.stringify(formData.description));
            data.append('category', formData.category);
            data.append('hexCode', formData.hexCode);
            data.append('rgbValues', JSON.stringify(formData.rgbValues));
            data.append('isActive', formData.isActive ? 'true' : 'false');
            data.append('price', formData.price);
            data.append('stock', formData.stock);

            if (imageFile) {
                data.append('image', imageFile);
            }

            console.log('📤 Submitting...');

            let response;
            if (initialData) {
                response = await api.put(`/products/${initialData._id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                response = await api.post('/products', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            console.log('✅ Success:', response.data);

            resetForm();
            onClose();

            // Notify parent
            if (onSubmit) {
                onSubmit(response.data.data);
            }

        } catch (err) {
            console.error('❌ Error:', err);
            setError(err.response?.data?.error || err.message || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-navy-900 rounded-2xl w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-navy-900 dark:text-white">
                            {initialData ? 'Edit Product' : 'Add Product'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-navy-800 rounded-full"
                        >
                            <FaTimes className="text-gray-400 text-xl" />
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6">
                            ❌ {error}
                        </div>
                    )}

                    <form onSubmit={handleFormSubmit} className="space-y-6">
                        {/* Image */}
                        <div className="flex flex-col items-center gap-4">
                            <label className="relative group cursor-pointer">
                                <div className="w-40 h-40 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-navy-700 flex items-center justify-center group-hover:border-blue-500 transition-colors bg-gray-50 dark:bg-navy-800">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center">
                                            <FaPalette className="mx-auto text-4xl text-gray-300 mb-2" />
                                            <span className="text-xs font-bold uppercase text-gray-400">Add Photo</span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />
                            </label>
                        </div>

                        {/* Name */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400">Name (EN) *</label>
                                <input
                                    type="text"
                                    value={formData.name.en}
                                    onChange={e => handleNestedChange('name', 'en', e.target.value)}
                                    className="w-full mt-2 p-2 bg-gray-50 dark:bg-navy-800 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                    placeholder="Product name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400 block text-right">الاسم (AR) *</label>
                                <input
                                    type="text"
                                    value={formData.name.ar}
                                    onChange={e => handleNestedChange('name', 'ar', e.target.value)}
                                    className="w-full mt-2 p-2 bg-gray-50 dark:bg-navy-800 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:text-white text-right"
                                    placeholder="اسم المنتج"
                                    dir="rtl"
                                    required
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400">Description</label>
                                <textarea
                                    value={formData.description.en}
                                    onChange={e => handleNestedChange('description', 'en', e.target.value)}
                                    className="w-full mt-2 p-2 bg-gray-50 dark:bg-navy-800 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:text-white min-h-20"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400 block text-right">الوصف</label>
                                <textarea
                                    value={formData.description.ar}
                                    onChange={e => handleNestedChange('description', 'ar', e.target.value)}
                                    className="w-full mt-2 p-2 bg-gray-50 dark:bg-navy-800 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:text-white text-right min-h-20"
                                    dir="rtl"
                                />
                            </div>
                        </div>

                        {/* Price & Stock */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400">Price *</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full mt-2 p-2 bg-gray-50 dark:bg-navy-800 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400">Stock</label>
                                <input
                                    type="number"
                                    value={formData.stock}
                                    onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                    className="w-full mt-2 p-2 bg-gray-50 dark:bg-navy-800 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Category & Color */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2">
                                <label className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400">Category *</label>
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full mt-2 p-2 bg-gray-50 dark:bg-navy-800 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                    required
                                >
                                    <option value="Paint">Paint</option>
                                    <option value="Wallpaper">Wallpaper</option>
                                    <option value="Decor">Decor</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400 block">Color</label>
                                <input
                                    type="color"
                                    value={formData.hexCode}
                                    onChange={handleHexChange}
                                    className="w-full mt-2 h-10 rounded-lg cursor-pointer border"
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Saving...' : (initialData ? 'Update' : 'Create')}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="px-6 py-3 bg-gray-200 dark:bg-navy-800 text-gray-700 dark:text-gray-300 rounded-lg font-bold hover:bg-gray-300 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductForm;