import React, { createContext, useContext, useState, useEffect } from 'react';
import { wallColors } from '../data/colors';

const SimulatorContext = createContext();

export const useSimulator = () => {
    const context = useContext(SimulatorContext);
    if (!context) {
        throw new Error('useSimulator must be used within a SimulatorProvider');
    }
    return context;
};

export const SimulatorProvider = ({ children }) => {
    // Default 4 walls with Finish property
    // Load from localStorage if available
    const [walls, setWalls] = useState(() => {
        const saved = localStorage.getItem('simulator_walls');
        return saved ? JSON.parse(saved) : [
            { id: 'wall-1', name: 'Front Wall', color: '#F5F5F5', finish: 'matt' },
            { id: 'wall-2', name: 'Right Wall', color: '#E5E5E5', finish: 'matt' },
            { id: 'wall-3', name: 'Back Wall', color: '#D4D4D4', finish: 'matt' },
            { id: 'wall-4', name: 'Left Wall', color: '#E5E5E5', finish: 'matt' },
        ];
    });

    const [activeWallId, setActiveWallId] = useState(null);
    const [selectedColor, setSelectedColor] = useState(wallColors[0]);
    const [activeFinish, setActiveFinish] = useState('matt'); // 'matt', 'silk', 'gloss'

    // Phase 2: Favorites & Usage
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('simulator_favorites');
        return saved ? JSON.parse(saved) : [];
    });

    const [usageStats, setUsageStats] = useState(() => {
        const saved = localStorage.getItem('simulator_usage');
        return saved ? JSON.parse(saved) : {};
    });

    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('simulator_theme');
        return saved || 'light';
    });

    // Phase 3: 3D Mode
    const [is3DMode, setIs3DMode] = useState(true); // Default to true for ProSim 3D

    // Phase 13: Advanced 3D Features
    const [splitMode, setSplitMode] = useState(false);
    const [splitColor, setSplitColor] = useState(wallColors[1]); // Default to a different color
    const [splitRatio, setSplitRatio] = useState(50); // 50%
    const [lightingMode, setLightingMode] = useState('day'); // 'day', 'night', 'studio'
    const [roomType, setRoomType] = useState('living'); // 'living', 'bed', 'kitchen'

    // Paint Calculator State
    const [roomDimensions, setRoomDimensions] = useState({ width: 5, length: 4, height: 2.7 }); // meters
    const [paintNeeded, setPaintNeeded] = useState(0);

    // Persistence
    useEffect(() => {
        localStorage.setItem('simulator_walls', JSON.stringify(walls));
    }, [walls]);

    useEffect(() => {
        localStorage.setItem('simulator_favorites', JSON.stringify(favorites));
    }, [favorites]);

    useEffect(() => {
        localStorage.setItem('simulator_usage', JSON.stringify(usageStats));
    }, [usageStats]);

    useEffect(() => {
        localStorage.setItem('simulator_theme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    // Calculate Paint Needed whenever room dimensions change
    useEffect(() => {
        // Simple calculation: (Width + Length) * 2 * Height = Wall Area
        // Subtract generic windows/doors (approx 10%)
        // Coverage: 1 Liter covers ~10-12 sqm. Let's say 12.
        const perimeter = (roomDimensions.width + roomDimensions.length) * 2;
        const totalArea = perimeter * roomDimensions.height;
        const paintArea = totalArea * 0.9; // 10% reduction for openings
        const liters = paintArea / 12;
        setPaintNeeded(parseFloat(liters.toFixed(1)));
    }, [roomDimensions]);

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
    const toggle3DMode = () => setIs3DMode(prev => !prev);
    const toggleSplitMode = () => setSplitMode(prev => !prev);

    const handleWallClick = (wallId) => {
        if (wallId === activeWallId) {
            setActiveWallId(null);
        } else {
            setActiveWallId(wallId);
            const wall = walls.find(w => w.id === wallId);
            if (wall) {
                // Optional: Sync finish but maybe keep color independent
                if (wall.finish) setActiveFinish(wall.finish);
            }
        }
    };

    const handleColorSelect = (color) => {
        setSelectedColor(color);

        // Tracking
        setUsageStats(prev => ({
            ...prev,
            [color.id]: (prev[color.id] || 0) + 1
        }));

        if (activeWallId) {
            // Apply only to active wall
            setWalls((prevWalls) =>
                prevWalls.map((wall) =>
                    wall.id === activeWallId ? { ...wall, color: color.hex } : wall
                )
            );
        } else {
            // Apply to ALL walls (batch mode / default)
            setWalls((prevWalls) =>
                prevWalls.map((wall) => ({ ...wall, color: color.hex }))
            );
        }
    };

    const handleFinishSelect = (finish) => {
        setActiveFinish(finish);

        if (activeWallId) {
            // Apply only to active wall
            setWalls(prevWalls =>
                prevWalls.map(wall =>
                    wall.id === activeWallId ? { ...wall, finish: finish } : wall
                )
            );
        } else {
            // Apply to ALL
            setWalls(prevWalls =>
                prevWalls.map(wall => ({ ...wall, finish: finish }))
            );
        }
    };

    const toggleFavorite = (colorId) => {
        setFavorites(prev =>
            prev.includes(colorId)
                ? prev.filter(id => id !== colorId)
                : [...prev, colorId]
        );
    };

    const popularColorId = Object.keys(usageStats).reduce((a, b) =>
        (usageStats[a] > usageStats[b] ? a : b), null
    );

    const popularColor = wallColors.find(c => c.id === popularColorId);

    const resetSimulator = () => {
        const defaultColor = '#F5F5F5';
        setWalls(walls.map(w => ({ ...w, color: defaultColor, finish: 'matt' })));
        setSelectedColor(wallColors.find(c => c.hex === defaultColor) || wallColors[0]);
        setActiveFinish('matt');
        setLightingMode('day');
        setActiveWallId(null);
    };

    const value = {
        walls,
        activeWallId,
        selectedColor,
        activeFinish,
        handleWallClick,
        handleColorSelect,
        handleFinishSelect,
        resetSimulator,
        allColors: wallColors,
        favorites,
        toggleFavorite,
        popularColor,
        theme,
        toggleTheme,
        is3DMode,
        setIs3DMode,
        toggle3DMode,

        // Advanced 3D
        splitMode, toggleSplitMode,
        splitColor, setSplitColor,
        splitRatio, setSplitRatio,
        lightingMode, setLightingMode,
        roomType, setRoomType,

        // Calculator
        roomDimensions, setRoomDimensions,
        paintNeeded
    };

    return (
        <SimulatorContext.Provider value={value}>
            {children}
        </SimulatorContext.Provider>
    );
};
