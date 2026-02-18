import React, { useState, useEffect } from 'react';
import RoomView from '../components/simulator/RoomView';
import ColorPalette from '../components/simulator/ColorPalette';
import { gsap } from 'gsap';

const Simulator = () => {
    const [selectedColor, setSelectedColor] = useState({ name: 'Alabaster', hex: '#F2F2F2' });
    const [previewColor, setPreviewColor] = useState(null);

    const colors = [
        { name: 'Midnight Velvet', hex: '#1A1A1D' },
        { name: 'Obsidian', hex: '#2C3E50' },
        { name: 'Charcoal', hex: '#34495E' },
        { name: 'Slate', hex: '#7F8C8D' },
        { name: 'Silver Sky', hex: '#95A5A6' },
        { name: 'Platinum', hex: '#BDC3C7' },
        { name: 'Frost', hex: '#EAECEE' },
        { name: 'Alabaster', hex: '#D5DBDB' },
        { name: 'Steel', hex: '#AAB7B8' },
        { name: 'Sage Green', hex: '#879D99' },
        { name: 'Desert Sand', hex: '#C5703F' },
        { name: 'Royal Ink', hex: '#1B2631' }
    ];

    const handleColorSelect = (color) => {
        setSelectedColor(color);
        setPreviewColor(null);
    };

    const handleColorHover = (color) => {
        setPreviewColor(color);
    };

    const handleReset = () => {
        setSelectedColor({ name: 'Alabaster', hex: '#F2F2F2' });
        setPreviewColor(null);
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-black">
            {/* Header / Brand */}
            <div className="absolute top-0 left-0 w-full p-8 z-20 flex justify-between items-start pointer-events-none">
                <div className="pointer-events-auto">
                    <h1 className="text-white text-3xl font-serif tracking-widest uppercase opacity-90">
                        Al-Shafi'i <span className="font-light">Foundation</span>
                    </h1>
                    <p className="text-gray-400 text-sm mt-1 font-sans tracking-widest uppercase">
                        Premium Interior Simulator
                    </p>
                </div>
                <div className="pointer-events-auto bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20">
                    <span className="text-white text-sm font-medium">Selected: {selectedColor.name}</span>
                </div>
            </div>

            {/* Main Room View */}
            <RoomView
                currentColor={previewColor?.hex || selectedColor.hex}
            />

            {/* Floating Palette */}
            <ColorPalette
                colors={colors}
                selectedColor={selectedColor}
                onSelect={handleColorSelect}
                onHover={handleColorHover}
                onReset={handleReset}
            />

            {/* Footer / Controls */}
            <div className="absolute bottom-10 right-10 z-20 flex gap-4">
                <button className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-white/20 transition-all duration-300 font-medium tracking-wide uppercase text-xs">
                    Save Palette
                </button>
                <button
                    onClick={handleReset}
                    className="px-8 py-3 bg-white text-black rounded-full hover:bg-gray-200 transition-all duration-300 font-medium tracking-wide uppercase text-xs"
                >
                    Reset Room
                </button>
            </div>
        </div>
    );
};

export default Simulator;
