import React from 'react';
import { RoundedBox } from '@react-three/drei';

const Sofa = (props) => {
    const sofaColor = "#555555"; // Neutral Dark Grey
    const legColor = "#3d2b1f"; // Dark Wood

    return (
        <group {...props}>
            {/* Seat Base */}
            <RoundedBox args={[6, 0.8, 2.5]} radius={0.1} smoothness={4} position={[0, 0.8, 0]}>
                <meshStandardMaterial color={sofaColor} roughness={0.8} />
            </RoundedBox>

            {/* Backrest */}
            <RoundedBox args={[6, 2, 0.5]} radius={0.1} smoothness={4} position={[0, 2, -1.1]}>
                <meshStandardMaterial color={sofaColor} roughness={0.8} />
            </RoundedBox>

            {/* Armrests */}
            <RoundedBox args={[0.8, 1.5, 2.6]} radius={0.1} smoothness={4} position={[-3.4, 1.25, 0]}>
                <meshStandardMaterial color={sofaColor} roughness={0.8} />
            </RoundedBox>
            <RoundedBox args={[0.8, 1.5, 2.6]} radius={0.1} smoothness={4} position={[3.4, 1.25, 0]}>
                <meshStandardMaterial color={sofaColor} roughness={0.8} />
            </RoundedBox>

            {/* Cushions (Visual detail) */}
            <RoundedBox args={[2.5, 0.3, 2]} radius={0.1} smoothness={4} position={[-1.4, 1.3, 0]}>
                <meshStandardMaterial color="#666666" roughness={0.9} />
            </RoundedBox>
            <RoundedBox args={[2.5, 0.3, 2]} radius={0.1} smoothness={4} position={[1.4, 1.3, 0]}>
                <meshStandardMaterial color="#666666" roughness={0.9} />
            </RoundedBox>

            {/* Legs */}
            <mesh position={[-3.2, 0.2, 1]} castShadow>
                <cylinderGeometry args={[0.1, 0.05, 0.4]} />
                <meshStandardMaterial color={legColor} />
            </mesh>
            <mesh position={[3.2, 0.2, 1]} castShadow>
                <cylinderGeometry args={[0.1, 0.05, 0.4]} />
                <meshStandardMaterial color={legColor} />
            </mesh>
            <mesh position={[-3.2, 0.2, -1]} castShadow>
                <cylinderGeometry args={[0.1, 0.05, 0.4]} />
                <meshStandardMaterial color={legColor} />
            </mesh>
            <mesh position={[3.2, 0.2, -1]} castShadow>
                <cylinderGeometry args={[0.1, 0.05, 0.4]} />
                <meshStandardMaterial color={legColor} />
            </mesh>
        </group>
    );
};

export default Sofa;
