import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimulator } from '../../context/SimulatorContext';
import gsap from 'gsap';

const LightingController = () => {
    const { lightingMode } = useSimulator();
    const { scene } = useThree();

    // Refs for lights
    const ambientLightRef = useRef();
    const sunLightRef = useRef();
    const fillLightRef = useRef();
    const spotLightRef = useRef();

    useEffect(() => {
        // Default target values
        let targets = {
            ambient: { intensity: 0.6, color: '#ffffff' },
            sun: { intensity: 0, position: [5, 5, 5], color: '#fffacd' }, // day/sun
            fill: { intensity: 0, position: [-5, 5, 5], color: '#ffffff' },
            spot: { intensity: 0, position: [0, 5, 0], color: '#ffa500' } // accent/night
        };

        if (lightingMode === 'day') {
            targets.ambient = { intensity: 0.6, color: '#ffffff' };
            targets.sun = { intensity: 1.5, position: [10, 10, 5], color: '#FFFACD' }; // Warm daylight
            targets.fill = { intensity: 0.3, position: [-5, 2, -5], color: '#E0E0E0' };
            targets.spot = { intensity: 0, position: [0, 5, 0], color: '#ffa500' };

        } else if (lightingMode === 'night') {
            targets.ambient = { intensity: 0.2, color: '#1a1a2e' }; // Dark blue-ish ambient
            targets.sun = { intensity: 0.1, position: [5, 5, 5], color: '#fffacd' }; // Moon/Street light
            targets.fill = { intensity: 0, position: [-5, 5, 5], color: '#ffffff' };
            targets.spot = { intensity: 1.2, position: [0, 4, 0], color: '#FFB74D' }; // Warm indoor light

        } else if (lightingMode === 'studio') {
            targets.ambient = { intensity: 0.8, color: '#ffffff' };
            targets.sun = { intensity: 1.0, position: [5, 5, 5], color: '#ffffff' }; // Key
            targets.fill = { intensity: 0.6, position: [-5, 5, 2], color: '#ffffff' }; // Fill
            targets.spot = { intensity: 0.5, position: [0, 5, -5], color: '#ffffff' }; // Back/Rim
        }

        // Helper to animate light properties
        const animateLight = (ref, target) => {
            if (!ref.current) return;

            gsap.to(ref.current, {
                intensity: target.intensity,
                duration: 1.5,
                ease: "power2.inOut"
            });

            if (target.position) {
                gsap.to(ref.current.position, {
                    x: target.position[0],
                    y: target.position[1],
                    z: target.position[2],
                    duration: 1.5,
                    ease: "power2.inOut"
                });
            }

            if (target.color) {
                const targetColor = new THREE.Color(target.color);
                const currentColor = ref.current.color;

                // Animate individual RGB channels since we can't animate the object itself easily with GSAP's simple syntax for three.js color
                gsap.to(currentColor, {
                    r: targetColor.r,
                    g: targetColor.g,
                    b: targetColor.b,
                    duration: 1.5,
                    ease: "power2.inOut"
                });
            }
        };

        animateLight(ambientLightRef, targets.ambient);
        animateLight(sunLightRef, targets.sun);
        animateLight(fillLightRef, targets.fill);
        animateLight(spotLightRef, targets.spot);

    }, [lightingMode, scene]);

    return (
        <group>
            <ambientLight ref={ambientLightRef} />
            <directionalLight ref={sunLightRef} castShadow shadow-mapSize={[2048, 2048]} />
            <pointLight ref={fillLightRef} />
            <spotLight ref={spotLightRef} castShadow penumbra={0.5} />
        </group>
    );
};

export default LightingController;
