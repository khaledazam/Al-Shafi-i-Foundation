import React from 'react';

const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
    const renderSkeleton = () => {
        if (type === 'card') {
            return (
                <div className="bg-white dark:bg-navy-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-navy-800 shadow-lg animate-pulse">
                    <div className="aspect-square bg-gray-200 dark:bg-navy-800" />
                    <div className="p-6 space-y-4">
                        <div className="h-4 bg-gray-200 dark:bg-navy-800 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 dark:bg-navy-800 rounded w-1/2" />
                        <div className="flex justify-between items-center pt-4">
                            <div className="h-6 bg-gray-200 dark:bg-navy-800 rounded w-1/4" />
                            <div className="h-10 bg-gray-200 dark:bg-navy-800 rounded w-1/3" />
                        </div>
                    </div>
                </div>
            );
        }

        if (type === 'table') {
            return (
                <div className="space-y-4 animate-pulse">
                    {[...Array(count)].map((_, i) => (
                        <div key={i} className="flex gap-4 p-4 border-b border-gray-50 dark:border-navy-800 items-center">
                            <div className="w-12 h-12 bg-gray-200 dark:bg-navy-800 rounded-xl" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-navy-800 rounded w-1/3" />
                                <div className="h-3 bg-gray-200 dark:bg-navy-800 rounded w-1/4" />
                            </div>
                            <div className="w-16 h-6 bg-gray-200 dark:bg-navy-800 rounded-full" />
                        </div>
                    ))}
                </div>
            );
        }

        if (type === 'stats') {
            return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
                    {[...Array(count)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-navy-900 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-navy-800 flex items-center justify-between">
                            <div className="space-y-3 flex-1">
                                <div className="h-3 bg-gray-200 dark:bg-navy-800 rounded w-1/4" />
                                <div className="h-8 bg-gray-200 dark:bg-navy-800 rounded w-1/2" />
                            </div>
                            <div className="w-16 h-16 bg-gray-200 dark:bg-navy-800 rounded-2xl" />
                        </div>
                    ))}
                </div>
            );
        }
    };

    return (
        <div className={type === 'card' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8' : ''}>
            {[...Array(count)].map((_, i) => (
                <React.Fragment key={i}>
                    {renderSkeleton()}
                </React.Fragment>
            ))}
        </div>
    );
};

export default LoadingSkeleton;
