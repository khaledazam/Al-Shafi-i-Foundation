import React, { useState, useMemo } from 'react';
import { paintCatalog } from '../../data/paintCatalog';
import { useSimulator } from '../../context/SimulatorContext';
import { Search, Grid, List as ListIcon } from 'lucide-react';

const categories = ['All', 'Warm', 'Cool', 'Neutral', 'Pastel', 'Bold'];

const PaintCatalog = () => {
    const { handleColorSelect, selectedColor } = useSimulator();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

    // Filter Logic
    const filteredPaints = useMemo(() => {
        return paintCatalog.filter(paint => {
            const matchesCategory = activeCategory === 'All' || paint.category === activeCategory;
            const searchTermLower = searchTerm.toLowerCase();
            const matchesSearch =
                paint.name.toLowerCase().includes(searchTermLower) ||
                paint.nameAr.includes(searchTerm) ||
                paint.id.toLowerCase().includes(searchTermLower);

            return matchesCategory && matchesSearch;
        });
    }, [searchTerm, activeCategory]);

    return (
        <div className="flex flex-col h-full bg-white dark:bg-navy-900 rounded-xl overflow-hidden">
            {/* Header: Search & Filter */}
            <div className="p-4 border-b border-gray-100 dark:border-navy-800 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search paint (e.g. 'Ocean', 'Blue', 'P-101')"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    />
                </div>

                {/* Categories Scrollable */}
                <div className="flex space-x-2 overflow-x-auto pb-2 custom-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`
                                whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all
                                ${activeCategory === cat
                                    ? 'bg-primary-500 text-white shadow-md'
                                    : 'bg-gray-100 dark:bg-navy-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-navy-700'
                                }
                            `}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Grid/List */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className={`
                    ${viewMode === 'grid' ? 'grid grid-cols-2 lg:grid-cols-2 gap-3' : 'space-y-2'}
                `}>
                    {filteredPaints.map(paint => (
                        <button
                            key={paint.id}
                            onClick={() => handleColorSelect(paint)}
                            className={`
                                group relative overflow-hidden rounded-xl border transition-all duration-200 text-left
                                ${selectedColor?.id === paint.id
                                    ? 'ring-2 ring-primary-500 border-primary-500 shadow-lg scale-[1.02]'
                                    : 'border-gray-100 dark:border-navy-700 hover:border-gray-300 dark:hover:border-navy-600 hover:shadow-md'
                                }
                                ${viewMode === 'list' ? 'flex items-center space-x-3 p-2' : 'flex flex-col'}
                            `}
                        >
                            {/* Color Preview */}
                            <div
                                className={`
                                    ${viewMode === 'list' ? 'w-12 h-12 rounded-lg' : 'w-full h-24'}
                                `}
                                style={{ backgroundColor: paint.hex }}
                            />

                            {/* Paint Info */}
                            <div className={`
                                ${viewMode === 'list' ? 'flex-1' : 'p-3'}
                            `}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-tight">
                                            {paint.name}
                                        </p>
                                        <p className="text-xs text-secondary-500 font-arabic mt-0.5">
                                            {paint.nameAr}
                                        </p>
                                    </div>
                                    {selectedColor?.id === paint.id && (
                                        <div className="w-2 h-2 rounded-full bg-primary-500" />
                                    )}
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-[10px] font-mono text-gray-400 bg-gray-100 dark:bg-navy-800 px-1.5 py-0.5 rounded">
                                        {paint.id}
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {filteredPaints.length === 0 && (
                    <div className="text-center py-10 text-gray-400">
                        <p>No paints found.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
                            className="text-primary-500 text-sm mt-2 hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>

            <div className="p-2 border-t border-gray-100 dark:border-navy-800 text-center text-xs text-gray-400">
                Found {filteredPaints.length} colors
            </div>
        </div>
    );
};

export default PaintCatalog;
