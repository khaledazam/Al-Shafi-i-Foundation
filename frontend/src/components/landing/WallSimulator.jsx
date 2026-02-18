import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useLanguage } from '../../context/LanguageContext';
import { FaSave, FaShare, FaUndo, FaCheck, FaMagic, FaHistory } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const WallSimulator = () => {
    const { t } = useLanguage();
    const [selectedColors, setSelectedColors] = useState({
        wall1: '#f8fafc',
        wall2: '#f8fafc',
        wall3: '#f8fafc',
        wall4: '#f1f5f9'
    });
    const [activeWall, setActiveWall] = useState('wall2');
    const [showBefore, setShowBefore] = useState(false);
    const [hoveredWall, setHoveredWall] = useState(null);

    const colorPalette = [
        { name: 'Coral Rose', hex: '#f43f5e' },
        { name: 'Deep Teal', hex: '#0f766e' },
        { name: 'Midnight', hex: '#0f172a' },
        { name: 'Sahara', hex: '#eab308' },
        { name: 'Sage Green', hex: '#10b981' },
        { name: 'Royal Blue', hex: '#3b82f6' },
        { name: 'Lavender', hex: '#8b5cf6' },
        { name: 'Terracotta', hex: '#d97706' },
        { name: 'Slate Gray', hex: '#475569' },
        { name: 'Warm White', hex: '#fafaf9' },
        { name: 'Soft Peach', hex: '#ffedd5' },
        { name: 'Mint', hex: '#d1fae5' }
    ];

    const wall1Ref = useRef(null);
    const wall2Ref = useRef(null);
    const wall3Ref = useRef(null);
    const wall4Ref = useRef(null);

    const wallRefs = {
        wall1: wall1Ref,
        wall2: wall2Ref,
        wall3: wall3Ref,
        wall4: wall4Ref
    };

    const handleColorSelect = (color) => {
        const newColor = { ...selectedColors, [activeWall]: color };
        setSelectedColors(newColor);

        // GSAP animation for color transition
        gsap.to(wallRefs[activeWall].current, {
            fill: color,
            duration: 0.8,
            ease: 'power2.inOut'
        });
    };

    const handleWallClick = (wallId) => {
        setActiveWall(wallId);

        // Subtle impact animation
        gsap.fromTo(wallRefs[wallId].current,
            { opacity: 0.8 },
            { opacity: 1, duration: 0.4, ease: 'power1.out' }
        );
    };

    const handleReset = () => {
        const defaultColors = {
            wall1: '#f8fafc',
            wall2: '#f8fafc',
            wall3: '#f8fafc',
            wall4: '#f1f5f9'
        };
        setSelectedColors(defaultColors);

        Object.keys(wallRefs).forEach(key => {
            gsap.to(wallRefs[key].current, {
                fill: defaultColors[key],
                duration: 0.8,
                ease: 'power2.inOut'
            });
        });

        toast.info(t('تم إعادة تعيين الألوان', 'Colors reset'));
    };

    const handleSaveSimulation = async () => {
        try {
            const colors = Object.values(selectedColors);
            await api.post('/simulations', {
                selectedColors: colors,
                roomType: 'Modern Living Room'
            });

            toast.success(t('تم حفظ المحاكاة بنجاح!', 'Simulation saved successfully!'));
        } catch (error) {
            toast.error(t('فشل في حفظ المحاكاة', 'Failed to save simulation'));
        }
    };

    const handleShare = () => {
        const colors = Object.values(selectedColors).join(',');
        const shareUrl = `${window.location.origin}?colors=${colors}`;

        navigator.clipboard.writeText(shareUrl);
        toast.success(t('تم نسخ الرابط!', 'Link copied to clipboard!'));
    };

    return (
        <div id="wall-simulator" className="py-24 px-4 bg-white dark:bg-navy-950 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 mb-4 text-sm font-bold tracking-wider text-primary-500 uppercase bg-primary-50 dark:bg-primary-900/20 rounded-full">
                        {t('الأدوات التفاعلية', 'Interactive Tools')}
                    </span>
                    <h2 className="section-title mb-4">
                        {t('محاكاة ألوان الجدران', 'Modern Room Simulator')}
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        {t('عِش تجربة اختيار الألوان قبل البدء. اضغط على أي جدار لتغيير لونه واكتشاف التناسق المثالي.', 'Experience color selection before you start. Click any wall to change its color and discover the perfect harmony.')}
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    {/* 3D Room Visualization */}
                    <div className="lg:col-span-12 xl:col-span-8 group">
                        <div className="relative rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-navy-900 shadow-2xl premium-shadow-hover transition-all duration-700">
                            {/* Comparison Toggle */}
                            <div className="absolute top-8 right-8 z-20">
                                <button
                                    onClick={() => setShowBefore(!showBefore)}
                                    className={`px-6 py-3 rounded-2xl flex items-center gap-3 font-bold transition-all duration-300 backdrop-blur-md ${showBefore
                                            ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                            : 'bg-white/80 dark:bg-navy-800/80 text-navy-900 dark:text-white shadow-xl hover:bg-white dark:hover:bg-navy-800'
                                        }`}
                                >
                                    <FaHistory className={showBefore ? 'animate-spin-slow' : ''} />
                                    <span>{showBefore ? t('الأصل', 'Original') : t('المحاكاة', 'Simulated')}</span>
                                </button>
                            </div>

                            {/* Active Wall Badge */}
                            <div className="absolute bottom-8 left-8 z-20 pointer-events-none">
                                <div className="glass-effect px-6 py-3 rounded-2xl flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-primary-500 animate-pulse"></div>
                                    <span className="text-sm font-bold text-navy-900 dark:text-white uppercase tracking-widest">
                                        {t(`جدار ${activeWall.slice(-1)} نشط`, `Active: Wall ${activeWall.slice(-1)}`)}
                                    </span>
                                </div>
                            </div>

                            {/* Room Scene */}
                            <div className="p-8 md:p-12 aspect-[16/10] flex items-center justify-center">
                                <svg
                                    viewBox="0 0 800 500"
                                    className="w-full h-full drop-shadow-[0_35px_35px_rgba(0,0,0,0.3)] filter transition-all duration-700"
                                    style={{ transform: 'perspective(1000px)' }}
                                >
                                    <defs>
                                        <linearGradient id="floorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#d1d5db" stopOpacity="0.4" />
                                            <stop offset="100%" stopColor="#9ca3af" stopOpacity="0.6" />
                                        </linearGradient>
                                        <filter id="wallShadow">
                                            <feDropShadow dx="0" dy="0" stdDeviation="5" floodOpacity="0.3" />
                                        </filter>
                                    </defs>

                                    {/* Floor */}
                                    <polygon
                                        points="100,400 700,400 800,500 0,500"
                                        fill="url(#floorGradient)"
                                        className="transition-all duration-700"
                                    />

                                    {/* Left Wall */}
                                    <path
                                        ref={wall1Ref}
                                        d="M0,50 L100,100 V400 L0,500 Z"
                                        fill={showBefore ? '#f8fafc' : selectedColors.wall1}
                                        className={`wall-section cursor-pointer hover:brightness-105 transition-all ${activeWall === 'wall1' ? 'filter drop-shadow-lg' : ''}`}
                                        onClick={() => handleWallClick('wall1')}
                                        onMouseEnter={() => setHoveredWall('wall1')}
                                        onMouseLeave={() => setHoveredWall(null)}
                                        stroke={activeWall === 'wall1' ? '#f43f5e' : 'rgba(255,255,255,0.1)'}
                                        strokeWidth={activeWall === 'wall1' ? '4' : '1'}
                                    />

                                    {/* Back Wall */}
                                    <rect
                                        ref={wall2Ref}
                                        x="100" y="100" width="600" height="300"
                                        fill={showBefore ? '#f8fafc' : selectedColors.wall2}
                                        className={`wall-section cursor-pointer hover:brightness-105 transition-all ${activeWall === 'wall2' ? 'filter drop-shadow-lg' : ''}`}
                                        onClick={() => handleWallClick('wall2')}
                                        onMouseEnter={() => setHoveredWall('wall2')}
                                        onMouseLeave={() => setHoveredWall(null)}
                                        stroke={activeWall === 'wall2' ? '#f43f5e' : 'rgba(255,255,255,0.1)'}
                                        strokeWidth={activeWall === 'wall2' ? '4' : '1'}
                                    />

                                    {/* Right Wall */}
                                    <path
                                        ref={wall3Ref}
                                        d="M700,100 L800,50 V500 L700,400 Z"
                                        fill={showBefore ? '#f8fafc' : selectedColors.wall3}
                                        className={`wall-section cursor-pointer hover:brightness-105 transition-all ${activeWall === 'wall3' ? 'filter drop-shadow-lg' : ''}`}
                                        onClick={() => handleWallClick('wall3')}
                                        onMouseEnter={() => setHoveredWall('wall3')}
                                        onMouseLeave={() => setHoveredWall(null)}
                                        stroke={activeWall === 'wall3' ? '#f43f5e' : 'rgba(255,255,255,0.1)'}
                                        strokeWidth={activeWall === 'wall3' ? '4' : '1'}
                                    />

                                    {/* Ceiling */}
                                    <path
                                        ref={wall4Ref}
                                        d="M100,100 L700,100 L800,0 L0,0 Z"
                                        fill={showBefore ? '#f1f5f9' : selectedColors.wall4}
                                        className={`wall-section cursor-pointer hover:brightness-105 transition-all ${activeWall === 'wall4' ? 'filter drop-shadow-lg' : ''}`}
                                        onClick={() => handleWallClick('wall4')}
                                        onMouseEnter={() => setHoveredWall('wall4')}
                                        onMouseLeave={() => setHoveredWall(null)}
                                        stroke={activeWall === 'wall4' ? '#f43f5e' : 'rgba(255,255,255,0.1)'}
                                        strokeWidth={activeWall === 'wall4' ? '4' : '1'}
                                    />

                                    {/* Realistic Details */}
                                    {/* Window on Back Wall */}
                                    <g opacity="0.8">
                                        <rect x="250" y="150" width="120" height="150" fill="white" fillOpacity="0.2" />
                                        <rect x="255" y="155" width="110" height="140" fill="#e0f2fe" fillOpacity="0.4" />
                                        <line x1="310" y1="155" x2="310" y2="295" stroke="white" strokeWidth="2" />
                                        <line x1="255" y1="225" x2="365" y2="225" stroke="white" strokeWidth="2" />
                                    </g>

                                    {/* Door on Right Wall */}
                                    <path d="M720,200 L770,170 V435 L720,380 Z" fill="#451a03" />
                                    <circle cx="760" cy="310" r="3" fill="#fbbf24" />

                                    {/* Corner Shading for depth */}
                                    <path d="M100,100 L0,0" stroke="black" strokeOpacity="0.1" strokeWidth="2" />
                                    <path d="M700,100 L800,0" stroke="black" strokeOpacity="0.1" strokeWidth="2" />
                                    <path d="M100,400 L0,500" stroke="black" strokeOpacity="0.1" strokeWidth="2" />
                                    <path d="M700,400 L800,500" stroke="black" strokeOpacity="0.1" strokeWidth="2" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Color Selection Panel */}
                    <div className="lg:col-span-12 xl:col-span-4 space-y-8">
                        {/* Selector Controls */}
                        <div className="card backdrop-blur-sm">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-navy-950 dark:text-white">
                                <FaMagic className="text-primary-500" />
                                {t('تخصيص الغرفة', 'Configure Room')}
                            </h3>

                            <div className="flex flex-col gap-4">
                                <div className="grid grid-cols-2 gap-3">
                                    {['wall1', 'wall2', 'wall3', 'wall4'].map((wall, index) => (
                                        <button
                                            key={wall}
                                            onClick={() => handleWallClick(wall)}
                                            className={`py-4 rounded-2xl font-bold transition-all duration-300 relative overflow-hidden group ${activeWall === wall
                                                    ? 'bg-primary-500 text-white shadow-xl shadow-primary-500/30'
                                                    : 'bg-gray-50 dark:bg-navy-800 text-navy-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-700'
                                                }`}
                                        >
                                            <span className="relative z-10">{t(`جدار ${index + 1}`, `Wall ${index + 1}`)}</span>
                                            {activeWall === wall && (
                                                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 animate-shimmer" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Color Grid */}
                        <div className="card">
                            <h3 className="text-xl font-bold mb-6 text-navy-950 dark:text-white">
                                {t('اختر لون الدهان', 'Select Paint Color')}
                            </h3>

                            <div className="grid grid-cols-4 gap-4 mb-8">
                                {colorPalette.map((color) => (
                                    <button
                                        key={color.hex}
                                        onClick={() => handleColorSelect(color.hex)}
                                        className={`group relative aspect-square rounded-2xl shadow-sm transition-all duration-300 transform ${selectedColors[activeWall] === color.hex
                                                ? 'scale-110 shadow-xl ring-4 ring-primary-500/20'
                                                : 'hover:scale-105 hover:shadow-md'
                                            }`}
                                        style={{ backgroundColor: color.hex }}
                                        title={color.name}
                                    >
                                        {selectedColors[activeWall] === color.hex && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-2xl">
                                                <FaCheck className="text-white text-xl drop-shadow-md animate-scale-in" />
                                            </div>
                                        )}
                                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-navy-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 pointer-events-none">
                                            {color.name}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Custom Picker */}
                            <div className="pt-6 border-t border-gray-100 dark:border-navy-800">
                                <label className="block text-sm font-bold mb-3 text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                                    {t('لون مخصص', 'Custom Hue')}
                                </label>
                                <div className="flex gap-4 items-center">
                                    <div className="relative flex-1">
                                        <input
                                            type="color"
                                            value={selectedColors[activeWall]}
                                            onChange={(e) => handleColorSelect(e.target.value)}
                                            className="w-full h-14 rounded-2xl cursor-pointer bg-transparent border-none p-0 overflow-hidden"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-white font-bold mix-blend-difference">
                                            {selectedColors[activeWall].toUpperCase()}
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleReset}
                                        className="p-4 bg-gray-100 dark:bg-navy-800 text-gray-600 dark:text-gray-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-colors"
                                        title={t('إعادة تعيين للأبيض', 'Reset to Default')}
                                    >
                                        <FaUndo />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleSaveSimulation}
                                className="flex-1 btn-primary flex items-center justify-center gap-3 py-4 text-base"
                            >
                                <FaSave className="text-lg" />
                                <span>{t('حفظ التصميم', 'Save Design')}</span>
                            </button>
                            <button
                                onClick={handleShare}
                                className="px-6 py-4 bg-navy-100 dark:bg-navy-800 text-navy-900 dark:text-white rounded-2xl hover:bg-navy-200 dark:hover:bg-navy-700 transition-all font-bold flex items-center justify-center"
                            >
                                <FaShare />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WallSimulator;
