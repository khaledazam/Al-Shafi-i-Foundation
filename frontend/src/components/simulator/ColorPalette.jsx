import React from 'react';

const ColorPalette = ({ colors, selectedColor, onSelect, onHover, onReset }) => {
    return (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-4xl">
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-2xl flex items-center gap-6 overflow-x-auto no-scrollbar">
                <div className="flex-shrink-0 pr-4 border-r border-white/10">
                    <h3 className="text-white/50 text-[10px] uppercase tracking-[0.2em] font-semibold mb-1">Curation</h3>
                    <p className="text-white text-sm font-serif italic">The Silk Collection</p>
                </div>

                <div className="flex gap-4 items-center">
                    {colors.map((color, index) => (
                        <div
                            key={index}
                            className="group relative flex flex-col items-center gap-2 cursor-pointer"
                            onClick={() => onSelect(color)}
                            onMouseEnter={() => onHover(color)}
                            onMouseLeave={() => onHover(null)}
                        >
                            <div
                                className={`w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center
                                    ${selectedColor.hex === color.hex ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'border-transparent group-hover:border-white/50'}
                                `}
                            >
                                <div
                                    className="w-10 h-10 rounded-full shadow-inner"
                                    style={{ backgroundColor: color.hex }}
                                />
                            </div>

                            {/* Tooltip-like label */}
                            <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                <div className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 whitespace-nowrap">
                                    <p className="text-white text-[10px] font-medium tracking-wider uppercase">{color.name}</p>
                                    <p className="text-gray-400 text-[8px] text-center">{color.hex}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="ml-auto pl-4 border-l border-white/10">
                    <button
                        onClick={onReset}
                        className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-widest font-medium"
                    >
                        Default
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ColorPalette;
