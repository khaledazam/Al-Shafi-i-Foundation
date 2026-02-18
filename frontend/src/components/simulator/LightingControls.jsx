import React from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import { Sun, Moon, Sunset, Monitor } from 'lucide-react';

const LightingControls = () => {
    const { lightingMode, setLightingMode } = useSimulator();

    const modes = [
        { id: 'daylight', label: 'Daylight', icon: Sun },
        { id: 'warm', label: 'Warm', icon: Sunset },
        { id: 'cool', label: 'Cool', icon: Monitor }, // Using Monitor for "Cool/Office" feel
        { id: 'night', label: 'Night', icon: Moon },
    ];

    return (
        <div className="bg-white dark:bg-navy-800 rounded-2xl p-4 border border-gray-100 dark:border-navy-700">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Lighting Environment</h3>
            <div className="grid grid-cols-4 gap-2">
                {modes.map((mode) => (
                    <button
                        key={mode.id}
                        onClick={() => setLightingMode(mode.id)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300
                            ${lightingMode === mode.id
                                ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-700 shadow-sm'
                                : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-navy-750 hover:text-gray-600 dark:hover:text-gray-300'
                            }`}
                    >
                        <mode.icon size={20} className="mb-1" />
                        <span className="text-[10px] font-medium">{mode.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LightingControls;
