import React, { memo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaStar, FaEye, FaSwatchbook, FaTag } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../utils/api';

const ProductCard = memo(({ product }) => {
    const { language, t } = useLanguage();
    const [discount, setDiscount] = useState(null);
    const [loading, setLoading] = useState(true);

    // Localization helper
    const getName = () => language === 'ar' ? product?.name?.ar : product?.name?.en;
    const getDesc = () => language === 'ar' ? product?.description?.ar : product?.description?.en;

    const inStock = product?.stock > 0;

    // Fetch discount for this product
    useEffect(() => {
        const fetchDiscount = async () => {
            try {
                const response = await api.get('/discounts');

                if (response.data?.success && response.data?.data) {
                    // Find discount for this product
                    const productDiscount = response.data.data.find(d =>
                        d.productId?._id === product._id &&
                        d.isActive &&
                        new Date(d.startDate) <= new Date() &&
                        new Date(d.endDate) >= new Date()
                    );

                    setDiscount(productDiscount || null);
                }
            } catch (error) {
                console.error('Error fetching discount:', error);
                setDiscount(null);
            } finally {
                setLoading(false);
            }
        };

        if (product?._id) {
            fetchDiscount();
        }
    }, [product?._id]);

    // Calculate discounted price
    const originalPrice = product?.price || 0;
    const discountedPrice = discount
        ? originalPrice * (1 - discount.discountPercent / 100)
        : originalPrice;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            whileHover={{ y: -10 }}
            className="group bg-white dark:bg-navy-900 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-navy-800 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
        >
            {/* Image Section */}
            <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-navy-800">
                {product?.image ? (
                    <motion.img
                        whileHover={{ scale: 1.15 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        src={product.image}
                        alt={getName() || 'Product Image'}
                        loading="lazy"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                        <FaSwatchbook size={64} />
                    </div>
                )}

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-navy-950/60 opacity-0 group-hover:opacity-100 backdrop-blur-sm transition-all duration-500 flex items-center justify-center gap-4">
                    <button className="w-12 h-12 bg-white text-navy-950 rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl">
                        <FaEye />
                    </button>
                    <button
                        disabled={!inStock}
                        className={`w-12 h-12 ${inStock ? 'bg-primary-500 text-white' : 'bg-gray-400 text-gray-200 cursor-not-allowed'} rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl`}
                    >
                        <FaShoppingCart />
                    </button>
                </div>

                {/* Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg ${product?.category === 'Paint' ? 'bg-emerald-500 text-white' :
                        product?.category === 'Wallpaper' ? 'bg-purple-500 text-white' :
                            'bg-amber-500 text-white'
                        }`}>
                        {t(product?.category === 'Paint' ? 'طلاء' : product?.category === 'Wallpaper' ? 'ورق حائط' : 'ديكور', product?.category)}
                    </span>

                    {/* Discount Badge */}
                    {!loading && discount && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="px-4 py-2 rounded-xl bg-red-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1"
                        >
                            <FaTag size={10} />
                            {discount.discountPercent}% {t('خصم', 'off')}
                        </motion.span>
                    )}

                    {!inStock && (
                        <span className="px-4 py-2 rounded-xl bg-red-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                            {t('نفدت الكمية', 'Sold Out')}
                        </span>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-8 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                        <h3 className="text-xl font-black text-navy-950 dark:text-white group-hover:text-primary-500 transition-colors line-clamp-1 leading-tight">
                            {getName() || t('منتج بدون اسم', 'Untitled Product')}
                        </h3>
                        {product?.hexCode && (
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: product.hexCode }} />
                                {product.hexCode}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                        <FaStar size={12} />
                        <span className="text-xs font-black">4.9</span>
                    </div>
                </div>

                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-8 font-medium">
                    {getDesc() || t('لا يوجد وصف متاح.', 'No description available.')}
                </p>

                <div className="mt-auto flex items-center justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                            {t('السعر', 'Price')}
                        </p>

                        {discount ? (
                            <div className="flex items-center gap-2">
                                {/* Original Price (Strikethrough) */}
                                <p className="text-sm font-black text-gray-400 line-through">
                                    ج.م{originalPrice.toLocaleString()}
                                </p>
                                {/* Discounted Price */}
                                <motion.p
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    className="text-2xl font-black text-red-500 tracking-tight"
                                >
                                    ج.م{discountedPrice.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </motion.p>
                            </div>
                        ) : (
                            <p className="text-2xl font-black text-primary-500 tracking-tight">
                                ج.م{originalPrice.toLocaleString()}
                            </p>
                        )}
                    </div>
                    {/* <button
                        disabled={!inStock}
                        className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg ${inStock
                            ? 'bg-navy-950 dark:bg-white text-white dark:text-navy-950 hover:bg-primary-500 dark:hover:bg-primary-500 hover:text-white'
                            : 'bg-gray-100 dark:bg-navy-800 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {inStock ? t('أضف للسلة', 'Add to cart') : t('قائمة الانتظار', 'Waitlist')}
                    </button> */}
                </div>
            </div>
        </motion.div>
    );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;