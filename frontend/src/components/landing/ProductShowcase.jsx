import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../utils/api';
import ProductCard from './ProductCard';
import ProductFilter from './ProductFilter';
import LoadingSkeleton from '../common/LoadingSkeleton';
import Pagination from '../common/Pagination';
import { FaBoxOpen } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';

const ProductShowcase = () => {
    const { t } = useLanguage();
    const [searchParams, setSearchParams] = useSearchParams();

    // State from URL
    const page = parseInt(searchParams.get('page')) || 1;
    const category = searchParams.get('category') || 'All';
    const search = searchParams.get('search') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const sort = searchParams.get('sort') || 'newest';
    const limit = 12;

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalProducts, setTotalProducts] = useState(0);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                page,
                limit,
                category: category === 'All' ? undefined : category,
                search: search || undefined,
                minPrice: minPrice || undefined,
                maxPrice: maxPrice || undefined,
                sort
            };

            const res = await api.get('/products', { params });
            if (res.data.success) {
                setProducts(res.data.data);
                setTotalProducts(res.data.pagination.totalProducts);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError(t('حدث خطأ أثناء تحميل المجموعة. يرجى المحاولة مرة أخرى.', 'We encountered an error loading the collection. Please try again.'));
        } finally {
            setLoading(false);
        }
    }, [page, category, search, minPrice, maxPrice, sort, t]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleFilterChange = useCallback((key, value) => {
        const newParams = new URLSearchParams(searchParams);

        if (key === 'reset') {
            setSearchParams({});
            return;
        }

        if (value && value !== 'All') {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }

        // Reset to page 1 on any filter change
        if (key !== 'page') {
            newParams.delete('page');
        }

        setSearchParams(newParams);
    }, [searchParams, setSearchParams]);

    const handlePageChange = useCallback((newPage) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', newPage);
        setSearchParams(newParams);

        // Luxury scroll to top of catalog
        const element = document.getElementById('catalog');
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    }, [searchParams, setSearchParams]);

    // Current filters for the Filter component
    const currentFilters = useMemo(() => ({
        page,
        category,
        search,
        minPrice,
        maxPrice,
        sort
    }), [page, category, search, minPrice, maxPrice, sort]);

    return (
        <section id="catalog" className="py-24 px-6 bg-white dark:bg-navy-950 transition-colors duration-500 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <ProductFilter
                    filters={currentFilters}
                    onFilterChange={handleFilterChange}
                    totalFound={totalProducts}
                />

                {error ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                            <FaBoxOpen size={32} />
                        </div>
                        <h3 className="text-xl font-black mb-2">{t('خطأ في المزامنة', 'Sync Error')}</h3>
                        <p className="text-gray-500 mb-8">{error}</p>
                        <button
                            onClick={fetchProducts}
                            className="bg-primary-500 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                        >
                            {t('إعادة المحاولة', 'Retry Loading')}
                        </button>
                    </div>
                ) : (
                    <>
                        {loading ? (
                            <LoadingSkeleton type="card" count={8} />
                        ) : products.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <FaBoxOpen size={64} className="text-gray-200 mb-6" />
                                <h3 className="text-2xl font-black text-gray-400">{t('لا توجد عينات مطابقة', 'No matching swatches')}</h3>
                                <p className="text-gray-500 max-w-sm mx-auto mt-2">
                                    {t('قم بتعديل الفلاتر أو ابحث عن شيء آخر.', 'Adjust your filters or try searching for something else.')}
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
                                    {products.map(product => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                <Pagination
                                    currentPage={page}
                                    totalCount={totalProducts}
                                    pageSize={limit}
                                    onPageChange={handlePageChange}
                                    className="py-8"
                                />
                            </>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default ProductShowcase;