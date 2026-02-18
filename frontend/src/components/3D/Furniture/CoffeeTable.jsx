import React from 'react';
import { RoundedBox } from '@react-three/drei';

const CoffeeTable = (props) => {
    return (
        <group {...props}>
            {/* Table Top (Glass) */}
            <RoundedBox args={[3.5, 0.1, 2]} radius={0.02} smoothness={4} position={[0, 0.9, 0]}>
                <meshPhysicalMaterial
                    color="#ffffff"
                    transmission={0.9}
                    opacity={1}
                    metalness={0}
                    roughness={0}
                    ior={1.5}
                    thickness={0.1}
                />
            </RoundedBox>

            {/* Frame/Legs (Metal or Wood) */}
            <mesh position={[-1.5, 0.45, 0.8]} castShadow>
                <boxGeometry args={[0.1, 0.9, 0.1]} />
                <meshStandardMaterial color="#222" roughness={0.5} metalness={0.8} />
            </mesh>
            <mesh position={[1.5, 0.45, 0.8]} castShadow>
                <boxGeometry args={[0.1, 0.9, 0.1]} />
                <meshStandardMaterial color="#222" roughness={0.5} metalness={0.8} />
            </mesh>
            <mesh position={[-1.5, 0.45, -0.8]} castShadow>
                <boxGeometry args={[0.1, 0.9, 0.1]} />
                <meshStandardMaterial color="#222" roughness={0.5} metalness={0.8} />
            </mesh>
            <mesh position={[1.5, 0.45, -0.8]} castShadow>
                <boxGeometry args={[0.1, 0.9, 0.1]} />
                <meshStandardMaterial color="#222" roughness={0.5} metalness={0.8} />
            </mesh>

            {/* Bottom Shelf (Wood) */}
            <mesh position={[0, 0.2, 0]} receiveShadow>
                <boxGeometry args={[3.3, 0.05, 1.8]} />
                <meshStandardMaterial color="#5c4033" roughness={0.8} />
            </mesh>
        </group>
    );
};

export default CoffeeTable;
