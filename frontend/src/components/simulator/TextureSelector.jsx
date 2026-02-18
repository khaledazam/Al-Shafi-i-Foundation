import React from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import { Circle, Sparkles, Layers, Box } from 'lucide-react';

const TextureSelector = () => {
    const { textureMode, setTextureMode } = useSimulator();

    const textures = [
        { id: 'matte', label: 'Matte', className: 'bg-gray-200' },
        { id: 'glossy', label: 'Glossy', className: 'bg-gradient-to-tr from-gray-300 to-white' },
        { id: 'semi-gloss', label: 'Satin', className: 'bg-gray-300' },
        { id: 'concrete', label: 'Concrete', className: 'bg-[url("https://www.transparenttextures.com/patterns/concrete-wall.png")] bg-gray-400' },
        { id: 'velvet', label: 'Velvet', className: 'bg-red-900 shadow-inner' }, // Visual Approx
    ];

    return (
        <div className="bg-white dark:bg-navy-800 rounded-2xl p-4 border border-gray-100 dark:border-navy-700">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Material Finish</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                {textures.map((tex) => (
                    <button
                        key={tex.id}
                        onClick={() => setTextureMode(tex.id)}
                        className={`flex-shrink-0 flex flex-col items-center gap-2 group`}
                    >
                        <div
                            className={`w-12 h-12 rounded-full border-2 transition-all shadow-sm ${tex.className}
                                ${textureMode === tex.id ? 'border-primary-500 scale-110 ring-2 ring-primary-500/20' : 'border-gray-200 dark:border-navy-600 opacity-70 hover:opacity-100'}
                            `}
                        />
                        <span className={`text-[10px] font-medium ${textureMode === tex.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`}>
                            {tex.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TextureSelector;
