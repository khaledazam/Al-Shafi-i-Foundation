import React from 'react';
import { RoundedBox } from '@react-three/drei';

const ModernSofa = (props) => {
    // A comfortable L-shaped sectional or wide modern sofa
    const fabricColor = "#d1d5db"; // Cool Gray
    const legColor = "#1f2937";

    return (
        <group {...props}>
            {/* Main Seat Section */}
            <RoundedBox args={[3.2, 0.4, 1.2]} radius={0.1} smoothness={4} position={[0, 0.4, 0]} castShadow>
                <meshStandardMaterial color={fabricColor} roughness={0.9} />
            </RoundedBox>

            {/* Chaise Section (L-shape) */}
            <RoundedBox args={[1.2, 0.4, 2.8]} radius={0.1} smoothness={4} position={[1, 0.4, 0.8]} castShadow>
                <meshStandardMaterial color={fabricColor} roughness={0.9} />
            </RoundedBox>

            {/* Backrests */}
            <RoundedBox args={[3.2, 0.8, 0.3]} radius={0.1} smoothness={4} position={[0, 1, -0.45]} castShadow>
                <meshStandardMaterial color={fabricColor} roughness={0.9} />
            </RoundedBox>

            {/* Side Armrest (Left) */}
            <RoundedBox args={[0.3, 0.6, 1.2]} radius={0.05} smoothness={4} position={[-1.75, 0.7, 0]} castShadow>
                <meshStandardMaterial color={fabricColor} roughness={0.9} />
            </RoundedBox>

            {/* Cushions (Pillows) - Scattered */}
            <mesh position={[-1.2, 0.7, -0.2]} rotation={[0.2, 0, 0]} castShadow>
                <boxGeometry args={[0.6, 0.4, 0.1]} />
                <meshStandardMaterial color="#9ca3af" roughness={1} />
            </mesh>
            <mesh position={[0, 0.7, -0.2]} rotation={[0.1, 0.1, 0]} castShadow>
                <boxGeometry args={[0.6, 0.4, 0.1]} />
                <meshStandardMaterial color="#9ca3af" roughness={1} />
            </mesh>

            {/* Legs */}
            <mesh position={[-1.5, 0.1, 0.5]}>
                <cylinderGeometry args={[0.04, 0.03, 0.2]} />
                <meshStandardMaterial color={legColor} />
            </mesh>
            <mesh position={[1.5, 0.1, 2.1]}>
                <cylinderGeometry args={[0.04, 0.03, 0.2]} />
                <meshStandardMaterial color={legColor} />
            </mesh>
            <mesh position={[-1.5, 0.1, -0.5]}>
                <cylinderGeometry args={[0.04, 0.03, 0.2]} />
                <meshStandardMaterial color={legColor} />
            </mesh>
            <mesh position={[1.5, 0.1, -0.5]}>
                <cylinderGeometry args={[0.04, 0.03, 0.2]} />
                <meshStandardMaterial color={legColor} />
            </mesh>
        </group>
    );
};

export default ModernSofa;
