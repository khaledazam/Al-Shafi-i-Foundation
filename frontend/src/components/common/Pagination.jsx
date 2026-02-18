import React from 'react';
import { usePagination, DOTS } from '../../hooks/usePagination';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';

const Pagination = ({
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className
}) => {
    const { language, t } = useLanguage();
    const paginationRange = usePagination({
        currentPage,
        totalCount,
        siblingCount,
        pageSize
    });

    // If there are less than 2 times in pagination range we shall not render the component
    if (currentPage === 0 || paginationRange.length < 2) {
        return null;
    }

    const onNext = () => {
        onPageChange(currentPage + 1);
    };

    const onPrevious = () => {
        onPageChange(currentPage - 1);
    };

    let lastPage = paginationRange[paginationRange.length - 1];

    return (
        <nav
            className={`flex items-center justify-center gap-2 ${className}`}
            aria-label={t('التنقل بين الصفحات', 'Pagination Navigation')}
        >
            {/* Left navigation arrow */}
            <button
                className="w-10 h-10 md:w-12 md:h-12 rounded-2xl border border-gray-100 dark:border-navy-800 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-navy-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold"
                onClick={onPrevious}
                disabled={currentPage === 1}
                aria-label={t('الصفحة السابقة', 'Previous Page')}
            >
                {language === 'ar' ? <FaChevronRight /> : <FaChevronLeft />}
            </button>

            <div className="flex gap-2">
                {paginationRange.map((pageNumber, index) => {
                    // If the pageItem is a DOT, render the DOTS unicode character
                    if (pageNumber === DOTS) {
                        return (
                            <div
                                key={`dots-${index}`}
                                className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-gray-400 font-bold"
                            >
                                &#8230;
                            </div>
                        );
                    }

                    // Render our Page Pills
                    return (
                        <button
                            key={pageNumber}
                            className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl font-black text-xs md:text-sm transition-all ${pageNumber === currentPage
                                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                                    : 'hover:bg-gray-50 dark:hover:bg-navy-900 border border-gray-100 dark:border-navy-800 text-gray-600 dark:text-gray-400'
                                }`}
                            onClick={() => onPageChange(pageNumber)}
                            aria-current={pageNumber === currentPage ? 'page' : undefined}
                            aria-label={`${t('الصفحة', 'Page')} ${pageNumber}`}
                        >
                            {pageNumber}
                        </button>
                    );
                })}
            </div>

            {/*  Right Navigation arrow */}
            <button
                className="w-10 h-10 md:w-12 md:h-12 rounded-2xl border border-gray-100 dark:border-navy-800 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-navy-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold"
                onClick={onNext}
                disabled={currentPage === lastPage}
                aria-label={t('الصفحة التالية', 'Next Page')}
            >
                {language === 'ar' ? <FaChevronLeft /> : <FaChevronRight />}
            </button>
        </nav>
    );
};

export default Pagination;
