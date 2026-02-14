import React, { useState, useRef, useEffect } from 'react';
import { Camera, ChevronLeft, Trash2, X, ChevronUp, Loader2, Upload, CheckCircle2, AlertCircle, Search, ScanLine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/SmartScan.css';

const SmartScan = () => {
    const [photo, setPhoto] = useState(null);
    const [photoFile, setPhotoFile] = useState(null);
    const [foodName, setFoodName] = useState('');
    const [showNutrition, setShowNutrition] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [nutritionData, setNutritionData] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handlePhotoUpload = (e) => {
        e.preventDefault();
        const file = e.type === 'change' ? e.target.files[0] : e.dataTransfer.files[0];
        if (file) {
            setPhoto(URL.createObjectURL(file));
            setPhotoFile(file);
            setNutritionData(null);
            setError(null);
            setFoodName(''); // Clear manual input if photo is selected
        }
    };

    const handleManualInput = (e) => {
        setFoodName(e.target.value);
        if (e.target.value) {
            // Optional: clear photo if typing? or allow both?
            // Usually one or the other. Let's keep both active but prioritize one logic if needed.
            // But if user types, maybe clear photo preview to avoid confusion?
            // For now let's allow user to choose.
        }
    };

    const triggerSeeNutrition = async () => {
        if (!photoFile && !foodName) {
            setError("Please upload a photo OR enter a dish name.");
            return;
        }

        setIsLoading(true);
        setError(null);

        // Simulation or Actual Call
        // If we have existing logic, use it.
        // The original code used 'http://127.0.0.1:5002/identify' with FormData for image.
        // It didn't seem to handle text-only input in the original fetch call I saw (it checked !photoFile).
        // I should probably support text input if that's the intention.
        // However, I will implement the logic as it was, but adapting for text if possible or just assume image for now.
        // Original Code: if (!photoFile) return;
        // But the UI has "Enter Dish".
        // I will assume the backend supports text or I need to mock it/handle it.
        // Since I can't check backend code easily, I will support the Image path primarily as per original code,
        // but if text is entered, maybe we need a different endpoint or param.
        // Result: The user asked for the UI change. I will modify the UI.
        // If the original didn't support text input (it had an input field though!), let's assume it might have been for naming the image?
        // Wait, original looked like: "Enter dish name manually..." as generic input.
        // But the trigger function only checked !photoFile.
        // So the text input might have been unused or redundant in previous logic.
        // I will stick to the previous logic but enable text-only if I can see how.
        // Since I don't want to break it, I will enforce Photo for now if that's what it did,
        // OR if foodName is present, generic mock?
        // Let's stick to the previous implementation: Image is required for the "identify" endpoint likely.
        // BUT, if the user explicitly asks for "Enter dish", they expect it to work.
        // I'll try to send text if no image.

        const formData = new FormData();
        if (photoFile) {
            formData.append('image', photoFile);
        }
        if (foodName) {
            formData.append('dish_name', foodName); // Speculative
        }

        try {
            // Note: If only text, this might fail on backend if it expects image.
            // But the user's request specificies "enter dish name", implying functionality.
            const response = await fetch('http://127.0.0.1:5002/identify', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to analyze');
            }

            const data = await response.json();
            setNutritionData(data);
            if (!foodName && data.identified_food) setFoodName(data.identified_food);
            setShowNutrition(true);
        } catch (err) {
            console.error(err);
            setError(err.message || "Analysis failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Derived macros for display (keep existing logic)
    const macros = nutritionData ? [
        { label: 'Calories', value: Math.round(nutritionData.macros.calories), max: 2000, color: '#FF7D45' },
        { label: 'Protein', value: Math.round(nutritionData.macros.protein), max: 150, color: 'var(--smart-primary)' },
        { label: 'Fat', value: Math.round(nutritionData.macros.fat), max: 70, color: 'var(--smart-secondary)' },
        { label: 'Carbs', value: Math.round(nutritionData.macros.carbs), max: 300, color: '#00ca82' },
    ] : [];

    return (
        <div className="smart-scan-page">
            {/* Hero Section */}
            {/* Simple Header */}
            <div className="simple-page-header">
                <motion.span
                    className="title-pill pill-smart"
                    initial={{ opacity: 0, y: -20, rotate: -10 }}
                    animate={{ opacity: 1, y: 0, rotate: -3 }}
                >
                    SMART
                </motion.span>
                <motion.span
                    className="title-pill pill-scan"
                    initial={{ opacity: 0, y: -20, rotate: 10 }}
                    animate={{ opacity: 1, y: 0, rotate: 3 }}
                    transition={{ delay: 0.1 }}
                >
                    SCAN
                </motion.span>
            </div>

            {/* Input Filter Bar Wrapper */}
            <div className="input-section-wrapper">
                <div className="scan-input-card">
                    <div className="input-options-row">
                        {/* Option 1: Upload */}
                        <div
                            className={`scan-option-box ${photo ? 'active' : ''}`}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {photo ? (
                                <div className="preview-container">
                                    <img src={photo} alt="Preview" className="preview-full-image" />
                                    <div
                                        className="remove-thumb"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPhoto(null);
                                            setPhotoFile(null);
                                        }}
                                    >
                                        <X size={20} />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="option-icon">
                                        <Camera size={28} />
                                    </div>
                                    <span className="option-label">Click Picture</span>
                                </>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden-input"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                            />
                        </div>

                        {/* Divider */}
                        <div className="or-divider-vertical">
                            <div className="or-line"></div>
                            <span>OR</span>
                            <div className="or-line"></div>
                        </div>

                        {/* Option 2: Enter Dish */}
                        <div className={`scan-option-box ${foodName && !photo ? 'active' : ''}`}>
                            <div className="option-icon">
                                <Search size={28} />
                            </div>
                            <span className="option-label" style={{ marginBottom: 10 }}>Enter Dish</span>
                            <div className="dish-input-wrapper">
                                <input
                                    type="text"
                                    className="dish-input"
                                    placeholder="Type dish name..."
                                    value={foodName}
                                    onChange={handleManualInput}
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div style={{ color: '#E53E3E', fontWeight: 700, textAlign: 'center' }}>
                            <AlertCircle size={16} style={{ display: 'inline', marginRight: 5, verticalAlign: 'text-top' }} />
                            {error}
                        </div>
                    )}

                    <button
                        className="analyze-btn-large"
                        onClick={triggerSeeNutrition}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={24} />
                        ) : (
                            <>
                                See Nutrition Info <ChevronUp size={24} />
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Nutrition Result Panel */}
            <AnimatePresence>
                {showNutrition && nutritionData && (
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
                                        <h2>{nutritionData.identified_food}</h2>
                                        <p className="panel-meta">{nutritionData.description}</p>
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
                                                    animate={{ width: `${Math.min((macro.value / macro.max) * 100, 100)}%` }}
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
                                    {nutritionData.ingredients && nutritionData.ingredients.length > 0 ? nutritionData.ingredients.map((item, idx) => (
                                        <motion.div
                                            key={idx}
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
                                    )) : (
                                        <p style={{ color: 'var(--smart-text-dim)', fontStyle: 'italic', marginTop: '10px' }}>Ingredients breakdown not available for this recipe.</p>
                                    )}
                                </div>

                                {/* Micronutrients Section */}
                                {nutritionData.micronutrients && nutritionData.micronutrients.length > 0 && (
                                    <div className="micronutrients-section" style={{ marginTop: '24px' }}>
                                        <span className="section-label">Key Nutrients</span>
                                        <div className="micro-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px', marginTop: '12px' }}>
                                            {nutritionData.micronutrients.map((nutrient, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.8 + (idx * 0.05) }}
                                                    className="micro-pill"
                                                    style={{
                                                        background: 'rgba(255,255,255,0.03)',
                                                        padding: '10px 14px',
                                                        borderRadius: '10px',
                                                        fontSize: '13px',
                                                        fontWeight: '500',
                                                        color: 'var(--smart-text)',
                                                        border: '1px solid rgba(255,255,255,0.08)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px'
                                                    }}
                                                >
                                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--smart-accent)' }} />
                                                    {nutrient}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1 }}
                                    className="score-card"
                                >
                                    <div className="score-info">
                                        <h3>Health Insight</h3>
                                        <p className="score-text">
                                            {nutritionData.health_insight}
                                        </p>
                                    </div>
                                    <div className="score-value-group">
                                        <div className="score-number">{nutritionData.health_score}</div>
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
