import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import RoomGeometry from './RoomGeometry';
import LightingController from './LightingController';
import CameraController from './CameraController';

const RoomScene = () => {
    const handleResetView = () => {
        if (window.resetCameraView) {
            window.resetCameraView();
        }
    };

    return (
        <div className="w-full h-full relative">
            <Canvas shadows dpr={[1, 2]} gl={{ preserveDrawingBuffer: true }}>
                <Suspense fallback={null}>
                    <CameraController />

                    <LightingController />

                    <group position={[0, 0, 0]}>
                        <RoomGeometry />
                    </group>

                    <ContactShadows position={[0, 0.01, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
                    <Environment preset="apartment" background={false} blur={1} />
                </Suspense>
            </Canvas>

            {/* Camera Control Overlay */}
            <div className="absolute bottom-4 right-4 z-10">
                <button
                    onClick={handleResetView}
                    className="bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 font-medium py-2 px-4 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2 border border-gray-200/50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        <path d="M3 3v5h5" />
                    </svg>
                    Reset View
                </button>
            </div>
        </div>
    );
};

export default RoomScene;
