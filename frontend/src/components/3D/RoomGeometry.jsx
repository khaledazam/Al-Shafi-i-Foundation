import React, { useRef, useMemo } from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import { createWallMaterial } from './MaterialManager';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useFrame } from '@react-three/fiber';

const RoomGeometry = () => {
    const { walls, handleWallClick, activeWallId } = useSimulator();

    // Room Dimensions
    const width = 5;
    const height = 2.7;
    const depth = 4;

    const floorMaterial = useMemo(() => {
        return new THREE.MeshStandardMaterial({
            color: '#D2B48C', // Light wood color
            roughness: 0.8,
            metalness: 0,
        });
    }, []);

    // Create materials for each wall
    const wallMaterials = useMemo(() => {
        return walls.reduce((acc, wall) => {
            acc[wall.id] = createWallMaterial(wall.color, wall.finish);
            return acc;
        }, {});
    }, [walls]);

    // Animate material color changes
    const wallRefs = useRef({});

    useFrame(() => {
        walls.forEach(wall => {
            const mesh = wallRefs.current[wall.id];
            if (mesh && mesh.material) {
                const targetColor = new THREE.Color(wall.color);
                mesh.material.color.lerp(targetColor, 0.1);

                const targetMat = createWallMaterial(wall.color, wall.finish);
                mesh.material.roughness = THREE.MathUtils.lerp(mesh.material.roughness, targetMat.roughness, 0.1);
                mesh.material.metalness = THREE.MathUtils.lerp(mesh.material.metalness, targetMat.metalness, 0.1);
            }
        });
    });

    // Furniture Materials (Memoized)
    const sofaMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#E5E7EB', roughness: 0.9 }), []); // Gray fabric
    const tableMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#8B4513', roughness: 0.6 }), []); // Wood
    const rugMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#D1D5DB', roughness: 1.0 }), []); // Textured rug
    const metalMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#374151', metalness: 0.8, roughness: 0.2 }), []); // Dark metal

    // Helper for Wall Highlights
    const WallHighlight = ({ wallId, width, height, position, rotation }) => {
        return activeWallId === wallId && (
            <mesh position={position} rotation={rotation}>
                <planeGeometry args={[width, height]} />
                <meshBasicMaterial
                    color="#4F46E5"
                    transparent
                    opacity={0.2}
                    side={THREE.DoubleSide}
                    depthTest={false} // Always show on top
                />
            </mesh>
        );
    };

    return (
        <group>
            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[width, depth]} />
                <primitive object={floorMaterial} attach="material" />
            </mesh>

            {/* Ceiling */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, 0]} receiveShadow>
                <planeGeometry args={[width, depth]} />
                <meshStandardMaterial color="#F9FAFB" roughness={0.9} />
            </mesh>

            {/* Back Wall (Main Wall) - ID: wall-3 */}
            <group>
                <mesh
                    ref={el => wallRefs.current['wall-3'] = el}
                    position={[0, height / 2, -depth / 2]}
                    receiveShadow
                    onClick={(e) => { e.stopPropagation(); handleWallClick('wall-3'); }}
                >
                    <planeGeometry args={[width, height]} />
                    <primitive object={wallMaterials['wall-3']} attach="material" />
                </mesh>
                <WallHighlight wallId="wall-3" width={width} height={height} position={[0, height / 2, -depth / 2 + 0.01]} />
            </group>

            {/* Baseboard Back */}
            <mesh position={[0, 0.075, -depth / 2 + 0.01]}>
                <boxGeometry args={[width, 0.15, 0.02]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.5} />
            </mesh>


            {/* Front Wall (Window Wall) - ID: wall-1 */}
            <group position={[0, height / 2, depth / 2]} rotation={[0, Math.PI, 0]}>
                {/* Wall Segments */}
                <group onClick={(e) => { e.stopPropagation(); handleWallClick('wall-1'); }}>
                    <mesh position={[-1.6, 0, 0]}>
                        <planeGeometry args={[1.8, height]} />
                        <primitive object={wallMaterials['wall-1']} attach="material" />
                    </mesh>
                    <mesh position={[1.6, 0, 0]}>
                        <planeGeometry args={[1.8, height]} />
                        <primitive object={wallMaterials['wall-1']} attach="material" />
                    </mesh>
                    <mesh position={[0, 1.1, 0]}>
                        <planeGeometry args={[1.4, 0.5]} />
                        <primitive object={wallMaterials['wall-1']} attach="material" />
                    </mesh>
                    <mesh position={[0, -1, 0]}>
                        <planeGeometry args={[1.4, 0.7]} />
                        <primitive object={wallMaterials['wall-1']} attach="material" />
                    </mesh>
                </group>

                {/* Visual Highlight for Front Wall (Simplified as one large plane covering the wall area behind window) */}
                <WallHighlight wallId="wall-1" width={width} height={height} position={[0, 0, -0.01]} rotation={[0, 0, 0]} />


                {/* Window Frame */}
                <mesh position={[0, 0.15, 0]}>
                    <boxGeometry args={[1.5, 1.6, 0.1]} />
                    <meshStandardMaterial color="#333" />
                </mesh>
                {/* Glass */}
                <mesh position={[0, 0.15, 0]}>
                    <planeGeometry args={[1.4, 1.5]} />
                    <meshPhysicalMaterial
                        transparent
                        color="skyblue"
                        opacity={0.2}
                        roughness={0}
                        metalness={0.9}
                        transmission={0.95}
                        thickness={0.05}
                    />
                </mesh>
            </group>

            {/* Left Wall - ID: wall-4 */}
            <group>
                <mesh
                    ref={el => wallRefs.current['wall-4'] = el}
                    position={[-width / 2, height / 2, 0]}
                    rotation={[0, Math.PI / 2, 0]}
                    receiveShadow
                    onClick={(e) => { e.stopPropagation(); handleWallClick('wall-4'); }}
                >
                    <planeGeometry args={[depth, height]} />
                    <primitive object={wallMaterials['wall-4']} attach="material" />
                </mesh>
                <WallHighlight wallId="wall-4" width={depth} height={height} position={[-width / 2 + 0.01, height / 2, 0]} rotation={[0, Math.PI / 2, 0]} />
            </group>

            {/* Baseboard Left */}
            <mesh position={[-width / 2 + 0.01, 0.075, 0]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[depth, 0.15, 0.02]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.5} />
            </mesh>

            {/* Right Wall - ID: wall-2 */}
            <group>
                <mesh
                    ref={el => wallRefs.current['wall-2'] = el}
                    position={[width / 2, height / 2, 0]}
                    rotation={[0, -Math.PI / 2, 0]}
                    receiveShadow
                    onClick={(e) => { e.stopPropagation(); handleWallClick('wall-2'); }}
                >
                    <planeGeometry args={[depth, height]} />
                    <primitive object={wallMaterials['wall-2']} attach="material" />
                </mesh>
                <WallHighlight wallId="wall-2" width={depth} height={height} position={[width / 2 - 0.01, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]} />
            </group>

            {/* Baseboard Right */}
            <mesh position={[width / 2 - 0.01, 0.075, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <boxGeometry args={[depth, 0.15, 0.02]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.5} />
            </mesh>

            {/* --- FURNITURE --- */}
            <group>
                {/* Rug */}
                <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                    <planeGeometry args={[2.5, 1.8]} />
                    <primitive object={rugMaterial} />
                </mesh>

                {/* Modern Sofa (L-Shape simplified) */}
                <group position={[0, 0, -0.5]}>
                    {/* Main seating */}
                    <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
                        <boxGeometry args={[2.2, 0.3, 0.8]} />
                        <primitive object={sofaMaterial} />
                    </mesh>
                    {/* Backrest */}
                    <mesh position={[0, 0.6, -0.3]} castShadow>
                        <boxGeometry args={[2.2, 0.4, 0.2]} />
                        <primitive object={sofaMaterial} />
                    </mesh>
                    {/* Side Armrests */}
                    <mesh position={[-1.0, 0.4, 0]} castShadow>
                        <boxGeometry args={[0.2, 0.4, 0.8]} />
                        <primitive object={sofaMaterial} />
                    </mesh>
                    <mesh position={[1.0, 0.4, 0]} castShadow>
                        <boxGeometry args={[0.2, 0.4, 0.8]} />
                        <primitive object={sofaMaterial} />
                    </mesh>
                </group>

                {/* Coffee Table */}
                <group position={[0, 0.2, 0.6]}>
                    <mesh castShadow receiveShadow>
                        <boxGeometry args={[1.0, 0.05, 0.6]} />
                        <primitive object={tableMaterial} />
                    </mesh>
                    {/* Legs */}
                    <mesh position={[-0.45, -0.1, -0.25]} castShadow>
                        <boxGeometry args={[0.05, 0.2, 0.05]} />
                        <primitive object={metalMaterial} />
                    </mesh>
                    <mesh position={[0.45, -0.1, -0.25]} castShadow>
                        <boxGeometry args={[0.05, 0.2, 0.05]} />
                        <primitive object={metalMaterial} />
                    </mesh>
                    <mesh position={[-0.45, -0.1, 0.25]} castShadow>
                        <boxGeometry args={[0.05, 0.2, 0.05]} />
                        <primitive object={metalMaterial} />
                    </mesh>
                    <mesh position={[0.45, -0.1, 0.25]} castShadow>
                        <boxGeometry args={[0.05, 0.2, 0.05]} />
                        <primitive object={metalMaterial} />
                    </mesh>
                </group>

                {/* Wall Shelves (Right Wall) */}
                <group position={[2.48, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
                    <mesh castShadow receiveShadow>
                        <boxGeometry args={[1.2, 0.05, 0.2]} />
                        <meshStandardMaterial color="#FFF" />
                    </mesh>
                    {/* Decor items on shelf */}
                    <mesh position={[-0.4, 0.15, 0]}>
                        <boxGeometry args={[0.1, 0.2, 0.1]} />
                        <meshStandardMaterial color="#333" />
                    </mesh>
                    <mesh position={[0.3, 0.1, 0]}>
                        <sphereGeometry args={[0.1, 16, 16]} />
                        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
                    </mesh>
                </group>

                {/* Plant (Abstract) */}
                <group position={[-2.0, 0, -1.5]}>
                    <mesh position={[0, 0.3, 0]} castShadow>
                        <cylinderGeometry args={[0.2, 0.15, 0.6, 16]} />
                        <meshStandardMaterial color="#FFF" />
                    </mesh>
                    {/* Leaves */}
                    <mesh position={[0, 0.8, 0]} castShadow>
                        <dodecahedronGeometry args={[0.4]} />
                        <meshStandardMaterial color="#4ade80" />
                    </mesh>
                </group>

                {/* Wall Art (Left Wall) */}
                <mesh position={[-2.49, 1.6, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <boxGeometry args={[1.2, 1.5, 0.05]} />
                    <meshStandardMaterial color="#EEE" />
                </mesh>
                <mesh position={[-2.48, 1.6, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <planeGeometry args={[1.0, 1.3]} />
                    <meshBasicMaterial color="#3b82f6" />
                </mesh>
            </group>
        </group>
    );
};

export default RoomGeometry;
