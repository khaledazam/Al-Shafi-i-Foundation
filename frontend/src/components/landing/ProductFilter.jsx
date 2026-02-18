import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaSortAmountDown, FaTimes } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';

const ProductFilter = ({ filters, onFilterChange, totalFound }) => {
    const { t } = useLanguage();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [localSearch, setLocalSearch] = useState(filters.search);
    const [localMinPrice, setLocalMinPrice] = useState(filters.minPrice);
    const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice);

    // Sync local state with props when filters change (e.g. reset)
    useEffect(() => {
        setLocalSearch(filters.search);
        setLocalMinPrice(filters.minPrice);
        setLocalMaxPrice(filters.maxPrice);
    }, [filters.search, filters.minPrice, filters.maxPrice]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            onFilterChange('search', localSearch);
        }, 300);
        return () => clearTimeout(timer);
    }, [localSearch, onFilterChange]);

    // Debounce price range
    useEffect(() => {
        const timer = setTimeout(() => {
            onFilterChange('minPrice', localMinPrice);
            onFilterChange('maxPrice', localMaxPrice);
        }, 500);
        return () => clearTimeout(timer);
    }, [localMinPrice, localMaxPrice, onFilterChange]);

    const categories = [
        { label: t('الكل', 'All'), value: 'All' },
        { label: t('طلاء', 'Paint'), value: 'Paint' },
        { label: t('ورق حائط', 'Wallpaper'), value: 'Wallpaper' },
        { label: t('ديكور', 'Decor'), value: 'Decor' }
    ];

    const sortOptions = [
        { label: t('الأحدث أولاً', 'Newest First'), value: 'newest' },
        { label: t('السعر: من الأقل للأعلى', 'Price: Low to High'), value: 'price_asc' },
        { label: t('السعر: من الأعلى للأقل', 'Price: High to Low'), value: 'price_desc' },
        { label: t('الاسم: أ-ي', 'Name: A-Z'), value: 'name_asc' },
        { label: t('المتوفر أولاً', 'In Stock First'), value: 'stock_desc' },
    ];

    const clearFilters = () => {
        setLocalSearch('');
        setLocalMinPrice('');
        setLocalMaxPrice('');
        onFilterChange('reset');
    };

    return (
        <div className="mb-12 space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                {/* Search Bar */}
                <div className="relative w-full md:max-w-md group">
                    <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    <input
                        type="text"
                        placeholder={t('ابحث عن المنتجات أو الرموز...', 'Search for swatches, names, or codes...')}
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        className="w-full bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-800 rounded-2xl py-4 pl-14 pr-6 text-sm font-medium outline-none focus:border-primary-500/50 shadow-sm transition-all"
                    />
                </div>

                <div className="flex gap-4 w-full md:w-auto items-center">
                    <p className="text-sm font-bold text-gray-400 mr-2 whitespace-nowrap">
                        {totalFound} {t('نتائج', 'results')}
                    </p>
                    <button
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-800 px-6 py-4 rounded-2xl font-bold text-sm shadow-sm hover:bg-gray-50 dark:hover:bg-navy-800 transition-all font-primary"
                    >
                        <FaFilter className="text-primary-500" /> {t('الفلاتر', 'Filters')}
                    </button>
                    <div className="relative flex-1 md:flex-none min-w-[160px]">
                        <FaSortAmountDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <select
                            value={filters.sort}
                            onChange={(e) => onFilterChange('sort', e.target.value)}
                            className="w-full appearance-none bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-800 pl-10 pr-10 py-4 rounded-2xl font-bold text-sm shadow-sm outline-none cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-800 transition-all"
                        >
                            {sortOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Expanded Filters */}
            {isMobileOpen && (
                <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-800 rounded-[2.5rem] p-8 mt-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex justify-between items-center mb-8">
                        <h4 className="text-xl font-black tracking-tight">{t('خيارات متقدمة', 'Advanced Selection')}</h4>
                        <button onClick={() => setIsMobileOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-navy-800 rounded-full transition-colors">
                            <FaTimes />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Category Select */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t('الفئة', 'Category')}</label>
                            <div className="flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat.value}
                                        onClick={() => onFilterChange('category', cat.value)}
                                        className={`px-6 py-3 rounded-xl text-xs font-black transition-all ${filters.category === cat.value
                                            ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                                            : 'bg-gray-50 dark:bg-navy-800 text-gray-500 hover:bg-gray-100'
                                            }`}
                                    >
                                        {cat.label.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t('نطاق السعر ($)', 'Price Range ($)')}</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="number"
                                    placeholder={t('الأدنى', 'Min')}
                                    value={localMinPrice}
                                    onChange={(e) => setLocalMinPrice(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-navy-800 rounded-xl px-4 py-3 text-sm font-bold outline-none border border-transparent focus:border-primary-500/30 transition-all font-primary"
                                />
                                <span className="text-gray-300">{t('إلى', 'to')}</span>
                                <input
                                    type="number"
                                    placeholder={t('الأقصى', 'Max')}
                                    value={localMaxPrice}
                                    onChange={(e) => setLocalMaxPrice(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-navy-800 rounded-xl px-4 py-3 text-sm font-bold outline-none border border-transparent focus:border-primary-500/30 transition-all font-primary"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col justify-end">
                            <button
                                onClick={clearFilters}
                                className="w-full py-3 text-primary-500 font-black text-xs uppercase tracking-widest hover:bg-primary-50 dark:hover:bg-primary-900/10 rounded-xl transition-all"
                            >
                                {t('إعادة تعيين كافة المعايير', 'Clear All Parameters')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductFilter;
