import React from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import { Columns, SplitSquareHorizontal } from 'lucide-react';

const SplitViewControls = () => {
    const {
        splitMode, setSplitMode,
        splitRatio, setSplitRatio,
        splitColor, setSplitColor,
        allColors
    } = useSimulator();

    return (
        <div className="bg-white dark:bg-navy-800 rounded-2xl p-4 border border-gray-100 dark:border-navy-700 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Columns size={20} className="text-secondary-500" />
                    <h3 className="font-bold text-gray-800 dark:text-white">Compare Colors</h3>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={splitMode}
                        onChange={(e) => setSplitMode(e.target.checked)}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-navy-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-secondary-500"></div>
                </label>
            </div>

            {splitMode && (
                <div className="space-y-4 animate-fade-in">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                            Comparison Color
                        </label>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {allColors.slice(0, 20).map(color => (
                                <button
                                    key={`split-${color.id}`}
                                    onClick={() => setSplitColor(color)}
                                    className={`w-8 h-8 rounded-full flex-shrink-0 border-2 transition-all ${splitColor.id === color.id ? 'border-secondary-500 scale-110 shadow-md' : 'border-transparent'}`}
                                    style={{ backgroundColor: color.hex }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Main</span>
                            <span>Split Ratio: {splitRatio}%</span>
                            <span>Compare</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={splitRatio}
                            onChange={(e) => setSplitRatio(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-navy-700 accent-secondary-500"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SplitViewControls;
