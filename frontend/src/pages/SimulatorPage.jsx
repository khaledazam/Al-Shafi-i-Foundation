import React, { useEffect } from 'react';
import { useSimulator } from '../context/SimulatorContext';
import RoomScene from '../components/3D/RoomScene';
import Controls from '../components/simulator/Controls';
import { Box, Layers } from 'lucide-react';

const SimulatorPage = () => {
    const { is3DMode, setIs3DMode } = useSimulator();

    useEffect(() => {
        console.log(`Rendering SimulatorPage, is3DMode: ${is3DMode}`);
    }, [is3DMode]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-navy-950 flex flex-col lg:flex-row overflow-hidden relative">
            {/* Background Blobs/Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary-500/10 rounded-full blur-[100px]" />
            </div>

            {/* Controls Sidebar (Left Side) */}
            <div className="w-full lg:w-[400px] bg-white dark:bg-navy-900 shadow-2xl z-20 h-[40vh] lg:h-screen relative p-4 lg:p-0 order-2 lg:order-1 border-r border-gray-100 dark:border-navy-800">
                <div className="h-full lg:p-6">
                    <Controls />
                </div>
            </div>

            {/* Main Content Area - The Room (Right Side) */}
            <div className="flex-1 p-4 lg:p-10 flex flex-col items-center justify-center relative z-10 overflow-y-auto order-1 lg:order-2">
                <div className="w-full max-w-5xl perspective-container">
                    <div className="mb-6 lg:hidden">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Room Simulator</h1>
                    </div>

                    <RoomScene />
                </div>
            </div>
        </div>
    );
};

export default SimulatorPage;
