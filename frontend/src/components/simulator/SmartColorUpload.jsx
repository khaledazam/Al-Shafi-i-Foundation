import React, { useRef, useState } from 'react';
import { Upload, X, Zap, Check } from 'lucide-react';
import { analyzeImage, generateSmartRecommendations } from '../../utils/colorEngine';
import { useSimulator } from '../../context/SimulatorContext';

const SmartColorUpload = ({ onClose }) => {
    const { handleColorSelect, handleFinishSelect } = useSimulator();
    const [image, setImage] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    processImage(img);
                };
                img.src = event.target.result;
                setImage(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const processImage = (imgElement) => {
        setLoading(true);
        // Simulate "Processing" time for UX
        setTimeout(() => {
            const result = analyzeImage(imgElement, canvasRef.current);
            const recs = generateSmartRecommendations(result);
            setAnalysis(recs);
            setLoading(false);
        }, 800);
    };

    const applyRecommendation = (rec) => {
        handleColorSelect(rec);
        if (rec.suggestedFinish) {
            handleFinishSelect(rec.suggestedFinish);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-navy-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-navy-700 flex justify-between items-center bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
                    <div className="flex items-center gap-2">
                        <Zap className="fill-current" size={24} />
                        <h2 className="text-xl font-bold">Smart Color Engine</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {/* Upload Section */}
                    {!image && (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-3 border-dashed border-gray-200 dark:border-navy-600 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-navy-750 transition-all group"
                        >
                            <div className="w-16 h-16 bg-primary-100 dark:bg-navy-700 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Upload className="text-primary-500" size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Upload Room Photo</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">We'll analyze your lighting and furniture to suggest the perfect paint.</p>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                            />
                        </div>
                    )}

                    {/* Analysis Section */}
                    {image && (
                        <div className="space-y-6">
                            <div className="flex gap-6 flex-col sm:flex-row">
                                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-xl overflow-hidden shadow-lg flex-shrink-0 relative">
                                    <img src={image} alt="Room" className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => { setImage(null); setAnalysis(null); }}
                                        className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>

                                <div className="flex-1">
                                    {loading ? (
                                        <div className="h-full flex flex-col justify-center gap-3">
                                            <div className="flex items-center gap-3 text-primary-500 font-medium animate-pulse">
                                                <Zap size={20} />
                                                Analyzing pixel data...
                                            </div>
                                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary-500 animate-slide-up w-2/3" />
                                            </div>
                                        </div>
                                    ) : analysis ? (
                                        <div className="animate-fade-in space-y-4">
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-2">Room Analysis</h4>
                                                <div className="flex gap-2 flex-wrap">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${analysis.isWarm ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                                        {analysis.isWarm ? 'Warm Tone' : 'Cool Tone'}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${analysis.brightness < 100 ? 'bg-gray-800 text-gray-200' : 'bg-yellow-100 text-yellow-700'}`}>
                                                        {analysis.brightness < 100 ? 'Low Light (Dim)' : 'Bright Light'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-1">Finish Suggestion</h4>
                                                <p className="text-gray-800 dark:text-white font-medium">
                                                    {analysis.recommendedFinish === 'matte' ? 'Matte' : 'Semi-Gloss'}
                                                    <span className="text-gray-400 font-normal ml-2 text-sm">- {analysis.finishReason}</span>
                                                </p>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>

                            {/* Recommendations Grid */}
                            {analysis && (
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recommended Paints</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {analysis.colors.map((color) => (
                                            <div
                                                key={color.id}
                                                onClick={() => applyRecommendation(color)}
                                                className="group cursor-pointer bg-gray-50 dark:bg-navy-750 rounded-2xl p-3 border-2 border-transparent hover:border-primary-500 transition-all hover:shadow-lg flex flex-col gap-3"
                                            >
                                                <div
                                                    className="h-24 rounded-xl w-full shadow-inner relative overflow-hidden"
                                                    style={{ backgroundColor: color.hex }}
                                                >
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 text-white">
                                                        <Check size={24} strokeWidth={3} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="font-bold text-gray-800 dark:text-white">{color.name}</h4>
                                                        <span className="text-xs font-mono text-gray-400">{color.hex}</span>
                                                    </div>
                                                    <p className="text-xs text-primary-600 dark:text-primary-400 mt-1 font-medium">{color.reason}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-center text-xs text-gray-400 mt-6">
                                        Click any color to apply it to the room instantly.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Hidden Logic Canvas */}
                <canvas ref={canvasRef} className="hidden" />
            </div>
        </div>
    );
};

export default SmartColorUpload;
