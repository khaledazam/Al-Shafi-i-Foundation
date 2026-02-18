import React from 'react';
import { RoundedBox } from '@react-three/drei';

const RoomDecor = () => {
    return (
        <group>
            {/* Rug */}
            <mesh position={[0, 0.02, 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[8, 6]} />
                <meshStandardMaterial color="#e5e5e5" roughness={1} />
            </mesh>

            {/* Pattern on Rug (Simple overlay) */}
            <mesh position={[0, 0.03, 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <ringGeometry args={[2, 2.1, 32]} />
                <meshStandardMaterial color="#d4d4d4" />
            </mesh>

            {/* Modern Art Painting */}
            <group position={[0, 4, -4.8]}>
                <mesh>
                    <boxGeometry args={[3, 2, 0.1]} />
                    <meshStandardMaterial color="#1a1a1a" /> {/* Frame */}
                </mesh>
                <mesh position={[0, 0, 0.06]}>
                    <planeGeometry args={[2.8, 1.8]} />
                    <meshStandardMaterial color="#ffcc00" emissive="#ffaa00" emissiveIntensity={0.2} /> {/* Canvas */}
                </mesh>
            </group>
        </group>
    );
};

export default RoomDecor;
