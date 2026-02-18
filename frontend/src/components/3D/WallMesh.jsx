import React, { useRef, useState, useLayoutEffect } from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import gsap from 'gsap';

const WallMesh = ({ id, name, color, finish, isActive, position, rotation, size }) => {
    const mesh = useRef();
    const materialRef = useRef();
    const splitMaterialRef = useRef();
    const [hovered, setHover] = useState(false);
    const {
        handleWallClick,
        splitMode, splitColor, splitRatio,
        textureMode
    } = useSimulator();

    // Map finish/texture to roughness/metalness/bump
    const getMaterialProps = (mode) => {
        switch (mode) {
            case 'glossy': return { roughness: 0.1, metalness: 0.2, envMapIntensity: 1.5 };
            case 'semi-gloss': return { roughness: 0.3, metalness: 0.1, envMapIntensity: 1 };
            case 'matte': return { roughness: 0.9, metalness: 0.0, envMapIntensity: 0.5 };
            case 'concrete': return { roughness: 0.95, metalness: 0.1, envMapIntensity: 0.2 }; // Would normally add map
            case 'velvet': return { roughness: 1, metalness: 0.1, sheen: 1, sheenColor: 'white' }; // Sheen if MeshPhysicalMaterial
            default: return { roughness: 0.8, metalness: 0.0 };
        }
    };

    // Combine local finish with global texture mode if active
    const activeProps = getMaterialProps(textureMode === 'matte' ? finish : textureMode);

    useLayoutEffect(() => {
        if (!materialRef.current) return;

        // Animate Main Color
        gsap.to(materialRef.current.color, {
            r: new THREE.Color(color).r,
            g: new THREE.Color(color).g,
            b: new THREE.Color(color).b,
            duration: 0.8,
            ease: "power2.out"
        });

        // Animate Props
        gsap.to(materialRef.current, {
            ...activeProps,
            duration: 1,
            ease: "power2.out"
        });

        // Split Color Animation
        if (splitMaterialRef.current && splitColor) {
            gsap.to(splitMaterialRef.current.color, {
                r: new THREE.Color(splitColor.hex).r,
                g: new THREE.Color(splitColor.hex).g,
                b: new THREE.Color(splitColor.hex).b,
                duration: 0.8,
                ease: "power2.out"
            });
        }

    }, [color, splitColor, activeProps, isActive, hovered]);

    // Calculate Split Geometry
    const width = size[0];
    const height = size[1];
    const depth = size[2];
    const splitWidth = (width * splitRatio) / 100;
    const offset = (width - splitWidth) / 2;

    return (
        <group position={position} rotation={rotation}>
            {/* Main Wall (Background / Full if no split) */}
            <mesh
                ref={mesh}
                onClick={(e) => {
                    e.stopPropagation();
                    handleWallClick(id);
                }}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
                receiveShadow
                castShadow
            >
                <boxGeometry args={[width, height, depth]} />
                <meshStandardMaterial
                    ref={materialRef}
                    color={color}
                    emissive="white"
                    emissiveIntensity={hovered || isActive ? 0.1 : 0}
                    {...activeProps}
                />
            </mesh>

            {/* Split View Overlay */
                splitMode && isActive && (
                    <mesh
                        position={[(width / 2) - (splitWidth / 2) + 0.01, 0, 0.01]} // Slightly offset to prevent z-fighting
                        receiveShadow
                    >
                        <boxGeometry args={[splitWidth, height, depth]} />
                        <meshStandardMaterial
                            ref={splitMaterialRef}
                            color={splitColor.hex}
                            {...activeProps}
                        />
                    </mesh>
                )}
        </group>
    );
};

import * as THREE from 'three'; // Needed for Color conversion in GSAP
export default WallMesh;
