import React from 'react';
import { useSimulator } from '../../context/SimulatorContext';

const finishes = [
    { id: 'matte', label: 'Matte' },
    { id: 'semi-gloss', label: 'Semi-Gloss' },
    { id: 'glossy', label: 'Glossy' },
];

const FinishSelector = () => {
    const { activeFinish, handleFinishSelect } = useSimulator();

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Finish</h3>
            <div className="flex bg-gray-100 dark:bg-navy-800 p-1 rounded-xl">
                {finishes.map((f) => (
                    <button
                        key={f.id}
                        onClick={() => handleFinishSelect(f.id)}
                        className={`
                            flex-1 py-2 text-xs font-medium rounded-lg transition-all duration-300
                            ${activeFinish === f.id
                                ? 'bg-white dark:bg-navy-700 text-primary-500 shadow-sm'
                                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                            }
                        `}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Visual Cue / Legend */}
            <div className="flex justify-between px-2 pt-1">
                {finishes.map((f) => (
                    <div key={f.id} className="flex flex-col items-center space-y-1">
                        <div
                            className="w-4 h-4 rounded-full border border-gray-200 dark:border-navy-600"
                            style={{
                                background: '#e5e7eb',
                                filter: f.id === 'glossy' ? 'brightness(1.2)' : 'none',
                                boxShadow: f.id === 'glossy'
                                    ? 'inset -2px -2px 4px rgba(0,0,0,0.1), inset 2px 2px 4px rgba(255,255,255,0.8)'
                                    : f.id === 'semi-gloss'
                                        ? 'inset -1px -1px 2px rgba(0,0,0,0.05), inset 1px 1px 2px rgba(255,255,255,0.4)'
                                        : 'none'
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FinishSelector;
