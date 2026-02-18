import React, { useState } from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import { ArrowLeft, RotateCcw, Camera, Moon, Sun, Copy, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import ColorBar from './ColorBar';
import FinishSelector from './FinishSelector';
import SmartColorUpload from './SmartColorUpload';
import SplitViewControls from './SplitViewControls';
import LightingControls from './LightingControls';
import TextureSelector from './TextureSelector';

const Controls = () => {
    const { resetColors, selectedColor, theme, toggleTheme } = useSimulator();
    const navigate = useNavigate();
    const [isCapturing, setIsCapturing] = useState(false);
    const [showSmartUpload, setShowSmartUpload] = useState(false);

    const handleSnapshot = async () => {
        const roomElement = document.querySelector('.room-capture-target');
        if (!roomElement) return;

        setIsCapturing(true);
        try {
            const canvas = await html2canvas(roomElement, {
                scale: 2,
                useCORS: true,
                backgroundColor: null,
            });

            const link = document.createElement('a');
            link.download = `lego-room-${selectedColor?.id || 'design'}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Snapshot failed:', error);
        } finally {
            setIsCapturing(false);
        }
    };

    const copyColorCode = () => {
        if (selectedColor) {
            navigator.clipboard.writeText(selectedColor.hex);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-navy-900 shadow-xl lg:shadow-none">
            {/* Top Bar: Color Palette (Sticky) */}
            <div className="border-b border-gray-100 dark:border-navy-800 bg-white dark:bg-navy-950 z-20">
                <div className="px-6 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-light tracking-tight text-gray-900 dark:text-white">
                            Modern<span className="font-semibold">Interior</span>
                        </h2>
                        <p className="text-xs text-gray-400 uppercase tracking-widest mt-0.5">Professional Paint Simulator</p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <button onClick={toggleTheme} className="p-2 text-gray-400 hover:text-yellow-500 transition-colors rounded-full hover:bg-gray-50 dark:hover:bg-navy-800">
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-full hover:bg-gray-50 dark:hover:bg-navy-800"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    </div>
                </div>
                <ColorBar />
            </div>

            {/* Middle: Selected Info & Finishes */}
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                <div className="bg-gray-50 dark:bg-navy-800 rounded-2xl p-6 flex flex-col items-center text-center shadow-inner border border-gray-100 dark:border-navy-700">
                    <div
                        className="w-24 h-24 rounded-2xl border-4 border-white dark:border-navy-600 shadow-lg mb-4 transform transition-transform hover:scale-105"
                        style={{ backgroundColor: selectedColor?.hex }}
                    />
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                        {selectedColor?.name || 'Pick a Color!'}
                    </h3>
                    <p className="text-lg text-secondary-500 font-arabic mb-3">
                        {selectedColor?.nameAr || 'اختر لوناً'}
                    </p>

                    {selectedColor && (
                        <div
                            onClick={copyColorCode}
                            className="cursor-pointer px-4 py-2 bg-white dark:bg-navy-700 rounded-full border border-gray-200 dark:border-navy-600 flex items-center space-x-2 hover:border-primary-500 transition-colors"
                        >
                            <code className="text-sm font-mono text-gray-600 dark:text-gray-300">{selectedColor.hex}</code>
                            <Copy size={14} className="text-gray-400" />
                        </div>
                    )}
                </div>

                <div className="bg-white dark:bg-navy-800 rounded-2xl p-4 border border-gray-100 dark:border-navy-700">
                    <FinishSelector />
                </div>

                {/* Advanced Controls */}
                <div className="space-y-4">
                    <SplitViewControls />
                    <LightingControls />
                    <TextureSelector />
                </div>
            </div>

            {/* Bottom: Actions */}
            <div className="p-4 bg-gray-50 dark:bg-navy-950 border-t border-gray-200 dark:border-navy-800">
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={resetColors}
                        className="py-3 px-4 rounded-xl text-sm font-bold text-red-500 bg-white border border-red-100 hover:bg-red-50 transition-colors shadow-sm"
                    >
                        Reset
                    </button>
                    <button
                        onClick={handleSnapshot}
                        disabled={isCapturing}
                        className="py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg transform transition-transform active:scale-95 flex items-center justify-center space-x-2"
                    >
                        <Camera size={18} />
                        <span>Snapshot</span>
                    </button>
                    <button
                        onClick={() => setShowSmartUpload(true)}
                        className="col-span-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg transform transition-transform active:scale-95 flex items-center justify-center space-x-2"
                    >
                        <Zap size={18} className="fill-current" />
                        <span>Smart Color AI</span>
                    </button>
                </div>
            </div>

            {/* Smart Upload Modal */}
            {showSmartUpload && <SmartColorUpload onClose={() => setShowSmartUpload(false)} />}
        </div>
    );
};

export default Controls;
