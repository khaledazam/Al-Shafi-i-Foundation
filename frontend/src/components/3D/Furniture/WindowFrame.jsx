import React from 'react';

const WindowFrame = (props) => {
    return (
        <group {...props}>
            {/* Frame */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
                <boxGeometry args={[3, 4, 0.2]} />
                <meshStandardMaterial color="#ffffff" roughness={0.5} />
            </mesh>

            {/* Glass Pane (Emissive for 'light source' look) */}
            <mesh position={[0, 0, 0.05]}>
                <planeGeometry args={[2.6, 3.6]} />
                <meshStandardMaterial
                    color="#dbeafe"
                    emissive="#dbeafe"
                    emissiveIntensity={2}
                    toneMapped={false}
                />
            </mesh>

            {/* Mullions */}
            <mesh position={[0, 0, 0.06]}>
                <boxGeometry args={[0.1, 3.6, 0.05]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, 0, 0.06]}>
                <boxGeometry args={[2.6, 0.1, 0.05]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>
        </group>
    );
};

export default WindowFrame;
