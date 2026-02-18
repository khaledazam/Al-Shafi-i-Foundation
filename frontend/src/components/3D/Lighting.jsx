import React from 'react';

const Lighting = () => {
    return (
        <>
            <ambientLight intensity={0.7} color="#ffffff" />
            <directionalLight
                position={[5, 10, 7]}
                intensity={1}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
            />
            <pointLight position={[-5, 5, -5]} intensity={0.5} color="#ffdcae" />
        </>
    );
};

export default Lighting;
