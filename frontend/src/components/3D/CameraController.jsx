import React, { useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

const CameraController = () => {
    const { camera, gl, set } = useThree();
    const controlsRef = useRef();

    // Default camera configuration
    const defaultPosition = new THREE.Vector3(0, 1.6, 5.5);
    const defaultTarget = new THREE.Vector3(0, 1.5, 0);

    // Zoom limits
    const minDistance = 2.5;
    const maxDistance = 8;

    // Rotation limits (vertical)
    // 0 is top, PI is bottom. 
    // We want -80 to 80 degrees relative to horizon (PI/2).
    // Top limit: 90 - 80 = 10 degrees = ~0.17 rad
    // Bottom limit: 90 + 80 = 170 degrees = ~2.96 rad
    const minPolarAngle = Math.PI / 2 - (80 * Math.PI / 180);
    const maxPolarAngle = Math.PI / 2 + (80 * Math.PI / 180);

    // Reset Camera Function
    const resetView = () => {
        if (!controlsRef.current) return;

        const controls = controlsRef.current;

        // Animate Camera Position
        gsap.to(camera.position, {
            x: defaultPosition.x,
            y: defaultPosition.y,
            z: defaultPosition.z,
            duration: 0.8,
            ease: "power2.inOut",
            onUpdate: () => controls.update() // Update controls during animation
        });

        // Animate Controls Target
        gsap.to(controls.target, {
            x: defaultTarget.x,
            y: defaultTarget.y,
            z: defaultTarget.z,
            duration: 0.8,
            ease: "power2.inOut",
            onUpdate: () => controls.update()
        });
    };

    // Expose reset function to window for the UI button to call
    // A cleaner React-way would be context, but for this specific request, 
    // attaching to window or using a custom event is a simple, effective bridge 
    // without re-architecting the entire app state.
    useEffect(() => {
        window.resetCameraView = resetView;
        return () => {
            delete window.resetCameraView;
        };
    }, [camera, controlsRef]);

    return (
        <>
            <PerspectiveCamera
                makeDefault
                position={[defaultPosition.x, defaultPosition.y, defaultPosition.z]}
                fov={65} // Comfortable viewing angle (60-75 range)
                near={0.1}
                far={1000}
            />
            <OrbitControls
                ref={controlsRef}
                target={[defaultTarget.x, defaultTarget.y, defaultTarget.z]}
                enablePan={false} // Disable panning to keep room centered
                enableZoom={true}
                enableRotate={true}
                minDistance={minDistance}
                maxDistance={maxDistance}
                minPolarAngle={minPolarAngle}
                maxPolarAngle={maxPolarAngle}
                enableDamping={true}
                dampingFactor={0.05}
                rotateSpeed={0.5}
                zoomSpeed={0.8}
            />
        </>
    );
};

export default CameraController;
