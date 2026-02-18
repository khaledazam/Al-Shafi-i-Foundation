import React, { useRef } from 'react';
import { paintCatalog } from '../../data/paintCatalog';
import { useSimulator } from '../../context/SimulatorContext';

const ColorBar = () => {
    const { handleColorSelect, selectedColor } = useSimulator();
    const scrollRef = useRef(null);

    // Sort by Hue for gradient effect
    const sortedPaints = [...paintCatalog].sort((a, b) => {
        // Simple hex sort approximation or category grouping
        // For now, let's keep category grouping or just ID order if it matches the "rainbow" expectation
        // or actually implement a hue sort?
        // Let's stick to the list we have, it's roughly grouped.
        return 0;
    });

    return (
        <div className="w-full bg-white dark:bg-navy-900 border-b border-gray-200 dark:border-navy-700 shadow-sm relative z-50">
            <div
                ref={scrollRef}
                className="flex overflow-x-auto py-4 px-4 space-x-3 custom-scrollbar scroll-smooth"
                style={{ scrollBehavior: 'smooth' }}
            >
                {sortedPaints.map((paint) => (
                    <button
                        key={paint.id}
                        onClick={() => handleColorSelect(paint)}
                        className={`
                            group flex-shrink-0 relative transition-all duration-200
                            ${selectedColor?.id === paint.id ? 'transform scale-110' : 'hover:scale-105'}
                        `}
                        title={`${paint.name} (${paint.nameAr})`}
                    >
                        <div
                            className={`
                                w-10 h-10 md:w-12 md:h-12 rounded-lg shadow-sm border-2 
                                ${selectedColor?.id === paint.id
                                    ? 'border-black dark:border-white shadow-md'
                                    : 'border-transparent group-hover:border-gray-300 dark:group-hover:border-navy-500'
                                }
                            `}
                            style={{ backgroundColor: paint.hex }}
                        />
                        {/* Tooltip on Hover */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 bg-black/80 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            {paint.name}
                        </div>
                    </button>
                ))}
            </div>
            {/* Scroll indicators could go here */}
        </div>
    );
};

export default ColorBar;
