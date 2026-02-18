import React, { useRef, useState } from 'react';
import { useSimulator } from '../../context/SimulatorContext';

const ColorWheel = () => {
    const { handleColorSelect, selectedColor } = useSimulator();
    const wheelRef = useRef(null);
    const [hoverColor, setHoverColor] = useState(null);

    // Simple robust ID generator to avoid 'uuid' dependency issues
    const generateId = () => `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const handleWheelClick = (e) => {
        if (!wheelRef.current) return;
        const rect = wheelRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        let angle = Math.atan2(y, x) * (180 / Math.PI);
        if (angle < 0) angle += 360;

        // Map angle to HSL
        const hue = angle;
        const hex = hslToHex(hue, 70, 50);

        const newColor = {
            id: generateId(),
            name: 'Custom',
            hex: hex,
            category: 'Custom'
        };

        handleColorSelect(newColor);
    };

    const handleMouseMove = (e) => {
        if (!wheelRef.current) return;
        const rect = wheelRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        let angle = Math.atan2(y, x) * (180 / Math.PI);
        if (angle < 0) angle += 360;

        const hue = angle;
        const hex = hslToHex(hue, 70, 50);
        setHoverColor(hex);
    };

    const handleMouseLeave = () => {
        setHoverColor(null);
    };

    // Helper: HSL to Hex
    const hslToHex = (h, s, l) => {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider self-start">Color Picker</h3>
            <div
                ref={wheelRef}
                onClick={handleWheelClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="w-48 h-48 rounded-full relative cursor-pointer shadow-lg active:scale-95 transition-transform"
                style={{
                    background: `
                        radial-gradient(circle at center, white 0%, transparent 40%),
                        conic-gradient(
                            from 90deg,
                            red, yellow, lime, cyan, blue, magenta, red
                        )
                    `
                }}
            >
                {/* Center Indicator (Shows Selected Color) */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white border-4 border-white rounded-full shadow-md z-10 transition-colors duration-200"
                    style={{ backgroundColor: selectedColor.hex }}
                />

                {/* Hover Indicator (Follows roughly or just updates center? Let's show a small tooltip or ring) */}
                {hoverColor && (
                    <div className="absolute top-0 right-0 -mt-2 -mr-2 w-6 h-6 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: hoverColor }}
                    />
                )}
            </div>

            <div className="text-center w-full bg-gray-50 dark:bg-navy-800 p-2 rounded-lg">
                <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: selectedColor.hex }} />
                    <span className="font-mono text-sm font-bold text-gray-700 dark:text-gray-200">{selectedColor.hex}</span>
                    <span className="text-xs text-gray-500 hidden sm:inline-block">({selectedColor.name})</span>
                </div>
                {hoverColor && (
                    <div className="mt-1 text-xs text-gray-400">
                        Hover: <span className="font-mono">{hoverColor}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ColorWheel;
