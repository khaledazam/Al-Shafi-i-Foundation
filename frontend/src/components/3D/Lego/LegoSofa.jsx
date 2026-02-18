import React from 'react';
import LegoBrick from './LegoBrick';

const LegoSofa = (props) => {
    const color = "#FF0000"; // Bright Red Lego

    return (
        <group {...props}>
            {/* Base (Seat) - 6x3 studs */}
            <LegoBrick width={6} depth={3} height={1} color={color} position={[0, 0, 0]} />

            {/* Backrest - 6x1 studs, stacked 2 high */}
            <LegoBrick width={6} depth={1} height={1} color={color} position={[0, 0.6, -0.5]} />
            <LegoBrick width={6} depth={1} height={1} color={color} position={[0, 1.2, -0.5]} />

            {/* Armrests - 1x3 studs */}
            <LegoBrick width={1} depth={3} height={1} color={color} position={[-1.25, 0.6, 0]} />
            <LegoBrick width={1} depth={3} height={1} color={color} position={[1.25, 0.6, 0]} />
        </group>
    );
};

export default LegoSofa;
