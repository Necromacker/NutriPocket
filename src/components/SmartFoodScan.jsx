import React, { useState, useRef, useEffect } from 'react';
import { Camera, ChevronLeft, Trash2, X, ChevronUp, Loader2, Upload, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/SmartScan.css';

const SmartScan = () => {
    const [photo, setPhoto] = useState(null);
    const [foodName, setFoodName] = useState('');
    const [showNutrition, setShowNutrition] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    // Mock data for nutrition analysis
    const nutritionData = {
        calories: 465,
        protein: 23,
        fat: 12,
        carbs: 45,
        ingredients: [
            { id: 1, name: 'Pan-Seared Beef', quantity: '150g', cals: 320, p: '24g', f: '15g' },
            { id: 2, name: 'Asparagus Spears', quantity: '120g', cals: 25, p: '2g', f: '0g' },
            { id: 3, name: 'Extra Virgin Olive Oil', quantity: '1 tbsp', cals: 120, p: '0g', f: '14g' }
        ]
    };

    const macros = [
        { label: 'Calories', value: nutritionData.calories, max: 2000, color: '#FF7D45' },
        { label: 'Protein', value: nutritionData.protein, max: 150, color: 'var(--smart-primary)' },
        { label: 'Fat', value: nutritionData.fat, max: 70, color: 'var(--smart-secondary)' },
        { label: 'Carbs', value: nutritionData.carbs, max: 300, color: '#00ca82' },
    ];

    const handlePhotoUpload = (e) => {
        e.preventDefault();
        const file = e.type === 'change' ? e.target.files[0] : e.dataTransfer.files[0];
        if (file) {
            setPhoto(URL.createObjectURL(file));
            if (!foodName) {
                setFoodName(file.name.split('.')[0].replace(/[-_]/g, ' '));
            }
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        handlePhotoUpload(e);
    };

    const triggerSeeNutrition = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(true);
            // Simulate deep analysis delay
            setTimeout(() => {
                setIsLoading(false);
                setShowNutrition(true);
            }, 1000);
        }, 800);
    };

    const isInputValid = foodName.trim().length > 0 || photo !== null;

    return (
        <div className="smart-scan-page">
            <div className="container">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="smart-header"
                >
                    <button onClick={() => window.history.back()} className="back-button">
                        <ChevronLeft size={24} />
                    </button>
                    <div className="title-group">
                        <h1>Create Recipe</h1>
                        <p className="subtitle">Smart Nutrition Analysis</p>
                    </div>
                </motion.div>

                {/* Main Input Grid */}
                <div className="input-grid">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
                        >
                            <AnimatePresence mode="wait">
                                {photo ? (
                                    <motion.div
                                        key="photo"
                                        initial={{ scale: 1.1, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.9, opacity: 0 }}
                                        className="preview-container"
                                    >
                                        <img src={photo} alt="Preview" className="preview-image" />
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setPhoto(null); }}
                                            className="remove-photo"
                                        >
                                            <X size={20} />
                                        </button>
                                        <div className="photo-overlay-tag">
                                            <CheckCircle2 size={12} />
                                            Photo Linked
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="prompt"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="upload-prompt"
                                    >
                                        <div className="upload-icon-box">
                                            <Upload size={32} />
                                        </div>
                                        <h3 className="upload-title">Upload food photo</h3>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handlePhotoUpload}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                    </motion.div>

                    <div className="or-divider">
                        <span>OR</span>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <input
                            type="text"
                            placeholder="Enter dish name manually..."
                            value={foodName}
                            onChange={(e) => setFoodName(e.target.value)}
                            className="dish-name-input"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <button
                            disabled={!isInputValid || isLoading}
                            onClick={triggerSeeNutrition}
                            className="analyze-button"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <>
                                    See Nutrition Info
                                    <ChevronUp size={20} />
                                </>
                            )}
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Nutrition Result Panel */}
            <AnimatePresence>
                {showNutrition && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowNutrition(false)}
                            style={{
                                position: 'fixed',
                                inset: 0,
                                background: 'rgba(0,0,0,0.7)',
                                backdropFilter: 'blur(8px)',
                                zIndex: 90
                            }}
                        />

                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                            className="nutrition-panel no-scrollbar"
                        >
                            <div className="grab-handle" />

                            <div className="container">
                                <div className="panel-header">
                                    <div className="panel-title">
                                        <h2>Analysis Result</h2>
                                        <p className="panel-meta">Aggregated Food Insights</p>
                                    </div>
                                    <button onClick={() => setShowNutrition(false)} className="close-panel">
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="macros-grid">
                                    {macros.map((macro, i) => (
                                        <motion.div
                                            key={macro.label}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 + (i * 0.1) }}
                                            className="macro-item"
                                        >
                                            <div className="macro-info">
                                                <span className="macro-name">{macro.label}</span>
                                                <span className="macro-amount">
                                                    {macro.value}
                                                    <span className="macro-unit">
                                                        {macro.label === 'Calories' ? 'KCAL' : 'G'}
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="progress-track">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(macro.value / macro.max) * 100}%` }}
                                                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 + (i * 0.1) }}
                                                    className="progress-bar"
                                                    style={{ backgroundColor: macro.color }}
                                                />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="ingredients-section">
                                    <span className="section-label">Composition Breakdown</span>
                                    {nutritionData.ingredients.map((item, idx) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.6 + (idx * 0.1) }}
                                            className="ingredient-card"
                                        >
                                            <div className="ing-details">
                                                <h4>{item.name}</h4>
                                                <p className="ing-meta">{item.quantity} • {item.p} Protein</p>
                                            </div>
                                            <div className="ing-calories">
                                                <span className="ing-cals-value">{item.cals}</span>
                                                <span className="ing-cals-unit">KCAL</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1 }}
                                    className="score-card"
                                >
                                    <div className="score-info">
                                        <h3>Highly Balanced</h3>
                                        <p className="score-text">
                                            This selection optimal for sustaining high energy throughout the day.
                                        </p>
                                    </div>
                                    <div className="score-value-group">
                                        <div className="score-number">92</div>
                                        <div className="score-label">Health Score</div>
                                    </div>
                                </motion.div>

                                <div style={{ textAlign: 'center', marginTop: '60px', opacity: 0.1, fontWeight: 900, fontSize: '10px', letterSpacing: '0.5em' }}>
                                    END OF DATA
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SmartScan;
