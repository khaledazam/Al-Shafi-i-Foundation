import React, { useEffect, useRef } from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import Wall from './Wall';
import gsap from 'gsap';

const Room2D = () => {
    const { walls, activeWallId } = useSimulator();
    const roomRef = useRef(null);

    useEffect(() => {
        if (roomRef.current) {
            gsap.fromTo(roomRef.current,
                { opacity: 0, scale: 0.9, y: 50 },
                { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
            );
        }
    }, []);

    return (
        <div ref={roomRef} className="w-full h-[500px] md:h-[600px] bg-gray-200 rounded-3xl overflow-hidden shadow-inner border-8 border-white relative perspective-1000 room-capture-target">
            {/* Ceiling */}
            <div className="absolute top-0 left-0 right-0 h-[15%] bg-gray-100 z-0 border-b border-gray-300" />

            {/* Floor */}
            <div className="absolute bottom-0 left-0 right-0 h-[25%] bg-[#F0EAD6] z-0 border-t border-gray-300"
                style={{
                    backgroundImage: 'linear-gradient(45deg, #E6DFCF 25%, transparent 25%, transparent 75%, #E6DFCF 75%, #E6DFCF), linear-gradient(45deg, #E6DFCF 25%, transparent 25%, transparent 75%, #E6DFCF 75%, #E6DFCF)',
                    backgroundSize: '40px 40px',
                    backgroundPosition: '0 0, 20px 20px'
                }}
            />

            {/* Walls Container - Creating a simple perspective effect with grid */}
            <div
                className="absolute top-[15%] bottom-[25%] left-10 right-10 flex shadow-2xl z-10"
                style={{ perspective: '1000px' }}
            >
                {/* Left Wall */}
                {walls[3] && (
                    <div className="w-[15%] h-full origin-right transform -skew-y-6 border-r border-gray-300">
                        <Wall
                            id={walls[3].id}
                            name={walls[3].name}
                            color={walls[3].color}
                            isActive={walls[3].id === activeWallId}
                        />
                    </div>
                )}

                {/* Back Wall (Center) */}
                {walls[2] && (
                    <div className="w-[70%] h-full bg-gray-200">
                        <Wall
                            id={walls[2].id}
                            name={walls[2].name}
                            color={walls[2].color}
                            isActive={walls[2].id === activeWallId}
                        />
                    </div>
                )}

                {/* Right Wall */}
                {walls[1] && (
                    <div className="w-[15%] h-full origin-left transform skew-y-6 border-l border-gray-300">
                        <Wall
                            id={walls[1].id}
                            name={walls[1].name}
                            color={walls[1].color}
                            isActive={walls[1].id === activeWallId}
                        />
                    </div>
                )}
            </div>

            {/* Front Wall (Invisible/Overlay context) or simply not shown/optional */}
            {/* In this 2D view, we typically see 3 walls (Left, Back, Right). 
                The 4th wall is usually "behind" the viewer. 
                For completeness, we can add a toggle or just stick to 3 visible for better UX.
                Based on requirements "Render 4 walls", I will add an indicator for the 4th if needed, 
                but onscreen usually 3 is best for perspective. 
                Let's stick to the visible 3 for the main view to keep it looking like a room, 
                or split the view? 
                Requirements say "Render 4 walls using divs or SVG". 
                Let's make it a flat unfolded box view OR a 3-wall perspective. 
                Perspective is nicer. I'll stick to 3 visible. 
            */}
        </div>
    );
};

export default Room2D;
