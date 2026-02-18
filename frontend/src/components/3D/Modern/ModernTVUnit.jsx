import React from 'react';
import { RoundedBox } from '@react-three/drei';

const ModernTVUnit = (props) => {
    return (
        <group {...props}>
            {/* Low Console Unit */}
            <RoundedBox args={[3.5, 0.6, 0.8]} radius={0.05} smoothness={4} position={[0, 0.3, 0]} castShadow receiveShadow>
                <meshStandardMaterial color="#f3f4f6" roughness={0.2} metalness={0.1} /> {/* White Gloss? or Matte White */}
            </RoundedBox>

            {/* Cabinet Doors/Drawers Indication */}
            <mesh position={[0, 0.3, 0.41]}>
                <planeGeometry args={[3.4, 0.5]} />
                <meshStandardMaterial color="#e5e7eb" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.3, 0.42]}>
                <boxGeometry args={[0.02, 0.5, 0.02]} /> {/* Middle divider */}
                <meshStandardMaterial color="#d1d5db" />
            </mesh>

            {/* TV Screen */}
            <group position={[0, 1.2, 0]}>
                {/* Stand */}
                <mesh position={[0, -0.4, 0]}>
                    <boxGeometry args={[0.6, 0.1, 0.3]} />
                    <meshStandardMaterial color="#1f2937" />
                </mesh>
                <mesh position={[0, -0.2, 0]}>
                    <cylinderGeometry args={[0.05, 0.05, 0.4]} />
                    <meshStandardMaterial color="#1f2937" />
                </mesh>

                {/* Screen Bezel */}
                <RoundedBox args={[2.4, 1.4, 0.05]} radius={0.02} smoothness={2} position={[0, 0.4, 0]}>
                    <meshStandardMaterial color="#111827" roughness={0.2} metalness={0.5} />
                </RoundedBox>
                {/* Display Area (Reflective Black) */}
                <mesh position={[0, 0.4, 0.03]}>
                    <planeGeometry args={[2.3, 1.3]} />
                    <meshStandardMaterial color="black" roughness={0.05} metalness={0.9} />
                </mesh>
            </group>
        </group>
    );
};

export default ModernTVUnit;
