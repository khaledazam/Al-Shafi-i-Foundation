import React from 'react';
import { RoundedBox } from '@react-three/drei';

const Cabinet = (props) => {
    const woodColor = "#5c4033"; // Dark Wood

    return (
        <group {...props}>
            {/* Main Body */}
            <RoundedBox args={[3, 4, 1]} radius={0.05} smoothness={4} position={[0, 2, 0]} castShadow receiveShadow>
                <meshStandardMaterial color={woodColor} roughness={0.7} />
            </RoundedBox>

            {/* Doors */}
            <mesh position={[-0.72, 2, 0.51]}>
                <boxGeometry args={[1.4, 3.8, 0.05]} />
                <meshStandardMaterial color={woodColor} roughness={0.7} />
            </mesh>
            <mesh position={[0.72, 2, 0.51]}>
                <boxGeometry args={[1.4, 3.8, 0.05]} />
                <meshStandardMaterial color={woodColor} roughness={0.7} />
            </mesh>

            {/* Handles */}
            <mesh position={[-0.1, 2, 0.55]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial color="#ffd700" metalness={1} roughness={0.2} />
            </mesh>
            <mesh position={[0.1, 2, 0.55]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial color="#ffd700" metalness={1} roughness={0.2} />
            </mesh>

            {/* Feet */}
            <mesh position={[-1.3, 0.1, 0.3]} castShadow>
                <cylinderGeometry args={[0.1, 0.1, 0.2]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            <mesh position={[1.3, 0.1, 0.3]} castShadow>
                <cylinderGeometry args={[0.1, 0.1, 0.2]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            <mesh position={[-1.3, 0.1, -0.3]} castShadow>
                <cylinderGeometry args={[0.1, 0.1, 0.2]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            <mesh position={[1.3, 0.1, -0.3]} castShadow>
                <cylinderGeometry args={[0.1, 0.1, 0.2]} />
                <meshStandardMaterial color="#333" />
            </mesh>
        </group>
    );
};

export default Cabinet;
