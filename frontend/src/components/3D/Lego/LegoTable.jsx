import React from 'react';
import LegoBrick from './LegoBrick';

const LegoTable = (props) => {
    return (
        <group {...props}>
            {/* Table Top - 4x3 studs, Yellow */}
            <LegoBrick width={4} depth={3} height={0.3} color="#FFD700" position={[0, 1, 0]} />

            {/* Legs - 1x1 studs, customized height */}
            <mesh position={[-0.75, 0.5, 0.5]} castShadow>
                <boxGeometry args={[0.4, 1, 0.4]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            <mesh position={[0.75, 0.5, 0.5]} castShadow>
                <boxGeometry args={[0.4, 1, 0.4]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            <mesh position={[-0.75, 0.5, -0.5]} castShadow>
                <boxGeometry args={[0.4, 1, 0.4]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            <mesh position={[0.75, 0.5, -0.5]} castShadow>
                <boxGeometry args={[0.4, 1, 0.4]} />
                <meshStandardMaterial color="#333" />
            </mesh>
        </group>
    );
};

export default LegoTable;
