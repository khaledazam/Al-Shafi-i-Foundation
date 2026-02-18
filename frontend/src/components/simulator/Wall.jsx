import React, { useRef, useEffect } from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import gsap from 'gsap';

const Wall = ({ id, name, color, isActive }) => {
    const { handleWallClick } = useSimulator();

    const wallRef = useRef(null);

    useEffect(() => {
        if (wallRef.current) {
            gsap.to(wallRef.current, {
                backgroundColor: color,
                duration: 1.2,
                ease: 'power2.out'
            });
        }
    }, [color]);

    useEffect(() => {
        if (isActive && wallRef.current) {
            gsap.fromTo(wallRef.current,
                { scale: 1 },
                { scale: 1.02, duration: 0.4, ease: 'back.out(1.7)' }
            );
        } else if (wallRef.current) {
            gsap.to(wallRef.current, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
    }, [isActive]);

    return (
        <div
            ref={wallRef}
            onClick={() => handleWallClick(id)}
            className={`
                relative cursor-pointer 
                flex items-center justify-center group overflow-hidden
                ${isActive ? 'ring-4 ring-primary-500 z-10 shadow-2xl' : 'hover:brightness-95'}
            `}
            style={{
                backgroundColor: color, // Initial render / fallback
                boxShadow: isActive ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'inset 0 0 100px rgba(0,0,0,0.1)'
            }}
        >
            <div className={`
                absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-300
                ${isActive ? 'opacity-0' : 'group-hover:opacity-100'}
            `} />

            {isActive && (
                <div className="absolute bottom-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-sm font-semibold text-gray-800 animate-bounce">
                    Target
                </div>
            )}

            <span className="sr-only">{name}</span>
        </div>
    );
};

export default Wall;
