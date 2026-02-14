import React, { useState, useEffect } from 'react';
import { Camera, ChevronLeft, Trash2, X, ChevronUp, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SmartScan = () => {
    const [photo, setPhoto] = useState(null);
    const [foodName, setFoodName] = useState('');
    const [showNutrition, setShowNutrition] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    // Mock data for demonstration
    const [nutritionData] = useState({
        calories: 465,
        protein: 23,
        fat: 12,
        carbs: 45,
        ingredients: [
            { id: 1, name: 'Pan-Seared Beef', quantity: '150g', cals: 320 },
            { id: 2, name: 'Asparagus', quantity: '100g', cals: 20 },
            { id: 3, name: 'Olive Oil', quantity: '1 tbsp', cals: 125 }
        ]
    });

    const handlePhotoUpload = (e) => {
        const file = e.type === 'change' ? e.target.files[0] : e.dataTransfer.files[0];
        if (file) {
            setPhoto(URL.createObjectURL(file));
            setFoodName(file.name.split('.')[0].replace(/-/g, ' '));
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        handlePhotoUpload(e);
    };

    const handleSeeNutrition = () => {
        setIsLoading(true);
        // Simulate API delay
        setTimeout(() => {
            setIsLoading(false);
            setShowNutrition(true);
        }, 1500);
    };

    const isInputValid = foodName.trim().length > 0 || photo !== null;

    return (
        <div className="min-h-screen bg-dark text-white font-outfit px-6 pt-24 pb-12 overflow-x-hidden relative">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 mb-10"
            >
                <button
                    onClick={() => window.history.back()}
                    className="p-3 rounded-full bg-dark-lighter border border-white/5 hover:border-lime-400/30 transition-all text-neutral-400 hover:text-white"
                >
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Create Recipe</h1>
            </motion.div>

            <div className="max-w-2xl mx-auto">
                {/* Upload/Input Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-8"
                >
                    <div className="space-y-4">
                        <label className="text-sm font-semibold tracking-wider text-neutral-400 uppercase">Input Choice</label>

                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className={`
                relative h-64 rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-6
                ${dragActive ? 'border-lime-400 bg-lime-400/5' : 'border-neutral-800 bg-dark-lighter'}
                ${photo ? 'border-solid border-neutral-700' : ''}
                hover:border-lime-400/50 group
              `}
                        >
                            {photo ? (
                                <div className="w-full h-full relative">
                                    <img src={photo} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                                    <button
                                        onClick={() => setPhoto(null)}
                                        className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="p-5 rounded-2xl bg-neutral-900 group-hover:bg-lime-400/10 transition-colors mb-4">
                                        <Camera size={40} className="text-neutral-500 group-hover:text-lime-400 transition-colors" />
                                    </div>
                                    <p className="text-neutral-400 text-center font-medium">
                                        Drag & Drop your food photo <br />
                                        <span className="text-neutral-600 text-sm">or click to browse</span>
                                    </p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-neutral-800"></div>
                        <span className="text-neutral-600 text-sm font-bold uppercase">OR</span>
                        <div className="h-px flex-1 bg-neutral-800"></div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-semibold tracking-wider text-neutral-400 uppercase">Dish Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Pan-Seared Beef with Asparagus"
                            value={foodName}
                            onChange={(e) => setFoodName(e.target.value)}
                            className="w-full bg-dark-lighter border border-neutral-800 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-lime-400/50 transition-all placeholder:text-neutral-700"
                        />
                    </div>

                    <div className="pt-6">
                        <button
                            onClick={handleSeeNutrition}
                            disabled={!isInputValid || isLoading}
                            className={`
                w-full py-5 rounded-2xl text-lg font-extrabold flex items-center justify-center gap-3 transition-all transform active:scale-[0.98]
                ${isInputValid
                                    ? 'bg-lime-400 text-black shadow-lg shadow-lime-400/20 hover:scale-[1.02] hover:bg-lime-500'
                                    : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'}
              `}
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <>
                                    See Nutrition Info
                                    <ChevronUp size={20} className="mt-0.5 animate-bounce-slow" />
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Shimmer Loading Overlay (Optional micro-interaction) */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm pointer-events-none"
                    />
                )}
            </AnimatePresence>

            {/* Sliding Nutrition Panel */}
            <AnimatePresence>
                {showNutrition && (
                    <>
                        {/* Backdrop blur */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowNutrition(false)}
                            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 z-50 bg-[#161616]/90 backdrop-blur-2xl border-t border-white/10 rounded-t-[40px] px-8 pt-10 pb-12 max-h-[90vh] overflow-y-auto"
                        >
                            {/* Swipe Handle */}
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-neutral-700 rounded-full" />

                            <div className="max-w-xl mx-auto space-y-10">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-3xl font-black mb-1">Nutrition Facts</h2>
                                        <p className="text-neutral-400 font-medium">Estimated for "{foodName}"</p>
                                    </div>
                                    <button
                                        onClick={() => setShowNutrition(false)}
                                        className="p-2 bg-neutral-800 rounded-full text-neutral-400 hover:text-white"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Macro Progress Bars */}
                                <div className="grid grid-cols-2 gap-6">
                                    {['Calories', 'Protein', 'Fat', 'Carbs'].map((macro, idx) => {
                                        const value = nutritionData[macro.toLowerCase()];
                                        const percentage = macro === 'Calories' ? (value / 2000) * 100 : (value / 60) * 100;
                                        const colors = [
                                            'bg-orange-500', 'bg-purple-500', 'bg-lime-400', 'bg-pink-500'
                                        ];

                                        return (
                                            <div key={macro} className="space-y-3">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">{macro}</span>
                                                    <span className="text-lg font-black">{value}{macro === 'Calories' ? '' : 'g'}</span>
                                                </div>
                                                <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${percentage}%` }}
                                                        transition={{ duration: 0.8, delay: 0.2 + idx * 0.1, ease: "circOut" }}
                                                        className={`h-full ${colors[idx]} rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Ingredient Breakdown */}
                                <div className="space-y-6">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-500">Ingredient Breakdown</h3>
                                    <div className="space-y-3">
                                        {nutritionData.ingredients.map((ing, idx) => (
                                            <motion.div
                                                key={ing.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 + idx * 0.1 }}
                                                className="bg-neutral-800/40 border border-white/5 rounded-2xl p-4 flex justify-between items-center group hover:bg-neutral-800/60 transition-colors"
                                            >
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-lg">{ing.name}</span>
                                                    <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">{ing.quantity}</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-lime-400 font-black text-lg">{ing.cals}</span>
                                                    <span className="text-[10px] text-neutral-600 font-bold block leading-none">KCAL</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Summary Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="bg-lime-400 text-black p-6 rounded-[30px] flex items-center justify-between"
                                >
                                    <div className="flex gap-4 items-center">
                                        <div className="p-3 bg-black/10 rounded-2xl">
                                            <ChevronUp size={24} className="rotate-180" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Daily Value</span>
                                            <p className="font-black text-2xl leading-none italic uppercase">Highly Nutritious</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-4xl font-black italic">82%</span>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <style jsx>{`
        .animate-bounce-slow {
          animation: bounce 2s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
        </div>
    );
};

export default SmartScan;
