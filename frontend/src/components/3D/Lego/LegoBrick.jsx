import React, { useMemo } from 'react';
import * as THREE from 'three';

const LegoBrick = ({ width = 1, depth = 1, height = 1, color, ...props }) => {
    // Width and Depth in "stud" units (e.g., 2x4 brick).
    // Standard Lego ratio: 1 horizontal unit = 0.8cm? We'll just scale proportionally.
    // Let's say 1 unit = 0.5 world units.

    const UNIT = 0.5;
    const actualWidth = width * UNIT;
    const actualDepth = depth * UNIT;
    const actualHeight = height * UNIT * 1.2; // Bricks are slightly taller than wide often

    const studs = useMemo(() => {
        const studArray = [];
        for (let x = 0; x < width; x++) {
            for (let z = 0; z < depth; z++) {
                studArray.push({
                    x: (x - (width - 1) / 2) * UNIT,
                    z: (z - (depth - 1) / 2) * UNIT
                });
            }
        }
        return studArray;
    }, [width, depth]);

    return (
        <group {...props}>
            {/* Main Block */}
            <mesh castShadow receiveShadow position={[0, actualHeight / 2, 0]}>
                <boxGeometry args={[actualWidth - 0.02, actualHeight, actualDepth - 0.02]} />
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
            </mesh>

            {/* Studs */}
            {studs.map((pos, i) => (
                <mesh key={i} position={[pos.x, actualHeight + 0.05, pos.z]} castShadow receiveShadow>
                    <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
                    <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
                </mesh>
            ))}
        </group>
    );
};

export default LegoBrick;
