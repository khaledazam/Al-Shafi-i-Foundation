import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const RoomView = ({ currentColor }) => {
    const wallRef = useRef(null);
    const lightRef = useRef(null);

    // High-resolution luxury living room background
    const bgUrl = "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1974&auto=format&fit=crop";

    useEffect(() => {
        if (wallRef.current) {
            gsap.to(wallRef.current, {
                backgroundColor: currentColor,
                duration: 1.2,
                ease: "power3.inOut"
            });

            // Subtle pulse to the light when color changes
            gsap.fromTo(lightRef.current,
                { opacity: 0.3 },
                { opacity: 0.6, duration: 0.6, yoyo: true, repeat: 1, ease: "sine.inOut" }
            );
        }
    }, [currentColor]);

    return (
        <div className="relative w-full h-full overflow-hidden">
            {/* Base Image Layer - The Architectural Photo */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
                style={{ backgroundImage: `url(${bgUrl})` }}
            />

            {/* Smart Wall Overlay - Using 'Color' blend mode for realism */}
            <div
                ref={wallRef}
                className="absolute inset-0 opacity-60 mix-blend-color transition-all duration-1000"
                style={{ backgroundColor: currentColor }}
            />

            {/* Deep Shade Layer - Multiply for shadows and depth */}
            <div
                className="absolute inset-0 opacity-30 mix-blend-multiply pointer-events-none"
                style={{ backgroundColor: currentColor }}
            />

            {/* Dynamic Light Stream - Simulating natural window light */}
            <div
                ref={lightRef}
                className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/20 mix-blend-overlay pointer-events-none"
            />

            {/* Fine Paint Texture - Subtle micro-detail for realism */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/natural-paper.png)' }}
            />

            {/* Foreground Vignette for focus */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle, transparent 0%, rgba(0,0,0,0.3) 100%)' }} />
        </div>
    );
};

export default RoomView;
