import React from 'react';

const ModernDecor = () => {
    return (
        <group>
            {/* Area Rug - Texture simulated with noise/color */}
            <mesh position={[0, 0.01, 1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[6, 4]} />
                <meshStandardMaterial
                    color="#e5e7eb"
                    roughness={1}
                />
            </mesh>

            {/* Abstract Art on Wall (Behind Sofa position roughly) */}
            <group position={[0, 3.5, -4.9]}>
                <mesh>
                    <boxGeometry args={[2.5, 3.5, 0.1]} /> {/* Canvas */}
                    <meshStandardMaterial color="#f9fafb" />
                </mesh>
                <mesh position={[0, 0, 0.06]}>
                    <planeGeometry args={[2.3, 3.3]} />
                    <meshStandardMaterial color="#3b82f6" emissive="#1d4ed8" emissiveIntensity={0.2} /> {/* "Art" */}
                </mesh>
                {/* Simple Geometric Shapes on Canvas */}
                <mesh position={[0.5, 0.5, 0.07]}>
                    <circleGeometry args={[0.5, 32]} />
                    <meshBasicMaterial color="#fbbf24" />
                </mesh>
            </group>

            {/* Pot Plant */}
            <group position={[3.5, 0, -3.5]}>
                <mesh castShadow position={[0, 0.5, 0]}>
                    <cylinderGeometry args={[0.4, 0.3, 1, 16]} />
                    <meshStandardMaterial color="#ffffff" /> {/* White Ceramic Pot */}
                </mesh>
                {/* Stem */}
                <mesh position={[0, 1.5, 0]}>
                    <cylinderGeometry args={[0.05, 0.05, 2]} />
                    <meshStandardMaterial color="#166534" />
                </mesh>
                {/* Leaves (Simple localized planes) */}
                <mesh position={[0.2, 2.2, 0]} rotation={[0.5, 0, 0]}>
                    <sphereGeometry args={[0.4, 16, 8]} />
                    <meshStandardMaterial color="#22c55e" />
                </mesh>
                <mesh position={[-0.2, 1.8, 0.2]} rotation={[0.2, 1, 0]}>
                    <sphereGeometry args={[0.3, 16, 8]} />
                    <meshStandardMaterial color="#22c55e" />
                </mesh>
            </group>
        </group>
    );
};

export default ModernDecor;
