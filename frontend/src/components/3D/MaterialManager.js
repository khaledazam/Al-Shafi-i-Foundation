import * as THREE from 'three';

/**
 * Creates a Three.js material based on the selected finish and color.
 * Options: 'matt', 'semi-gloss', 'gloss'
 */
export const createWallMaterial = (color, finish) => {
    const materialParams = {
        color: new THREE.Color(color),
        side: THREE.FrontSide, // Only render front face
    };

    switch (finish) {
        case 'matt':
            // Matt: High roughness, no metalness, chalky look
            return new THREE.MeshStandardMaterial({
                ...materialParams,
                roughness: 0.9,
                metalness: 0.0,
            });

        case 'semi-gloss':
            // Semi-Gloss: Balanced reflection (formerly silk)
            return new THREE.MeshStandardMaterial({
                ...materialParams,
                roughness: 0.4,
                metalness: 0.1,
            });

        case 'gloss':
            // Gloss: Low roughness, high reflection
            return new THREE.MeshStandardMaterial({
                ...materialParams,
                roughness: 0.15,
                metalness: 0.2,
                envMapIntensity: 1.2,
            });

        default:
            return new THREE.MeshStandardMaterial(materialParams);
    }
};

/**
 * Updates an existing material with new properties using GSAP
 */
export const updateMaterialProperties = (material, color, finish) => {
    const targetMaterial = createWallMaterial(color, finish);

    return {
        color: targetMaterial.color,
        roughness: targetMaterial.roughness,
        metalness: targetMaterial.metalness,
        envMapIntensity: targetMaterial.envMapIntensity || 1
    };
};
