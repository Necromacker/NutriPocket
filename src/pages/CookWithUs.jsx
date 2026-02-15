import React, { useState, useRef, useEffect } from 'react';
import '../styles/CookWithUs.css';
import { Play, Pause, SkipForward, SkipBack, Loader2, Search, Volume2, ArrowRight } from 'lucide-react';
import { RECIPES } from '../constants/cookingData';
import { motion, AnimatePresence } from 'framer-motion';

const CookWithUs = () => {
    // State
    const [recipeId, setRecipeId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    // Core Logic State
    const [steps, setSteps] = useState([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Refs
    const synthesis = window.speechSynthesis;
    const utteranceRef = useRef(null);
    const stepRefs = useRef({});
    const dropdownRef = useRef(null);

    // Effect to cancel speech on unmount
    useEffect(() => {
        return () => {
            if (synthesis) synthesis.cancel();
        };
    }, []);

    // Handle outside click for dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (term.length > 0) {
            const matches = RECIPES.filter(r =>
                r.Recipe_title.toLowerCase().startsWith(term.toLowerCase())
            );
            setFilteredRecipes(matches);
            setShowDropdown(true);
        } else {
            setFilteredRecipes([]);
            setShowDropdown(false);
        }
    };

    const handleSelectRecipe = (recipe) => {
        setSearchTerm(recipe.Recipe_title); // Set input to full title
        setRecipeId(recipe.Recipe_id);      // Set hidden ID
        setShowDropdown(false);             // Hide dropdown
        setError('');                       // Clear errors
        fetchAndStart(recipe.Recipe_id);
    };

    const fetchAndStart = async (overrideId = null) => {
        const idToUse = overrideId || recipeId;

        if (!idToUse) {
            setError("Please select a valid recipe from the list.");
            return;
        }

        resetState();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`http://127.0.0.1:5001/api/instructions/${idToUse}`);

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || `Server error: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) throw new Error(data.error);

            // Parse instructions logic
            let instructions = [];
            if (Array.isArray(data)) {
                instructions = data;
            } else if (data.instructions && Array.isArray(data.instructions)) {
                instructions = data.instructions;
            } else if (typeof data === 'object') {
                if (data.steps) instructions = data.steps;
                else instructions = [JSON.stringify(data)];
            }

            const parsedSteps = instructions.map(item => {
                if (typeof item === 'string') return item;
                if (item.step) return item.step;
                return JSON.stringify(item);
            });

            if (parsedSteps.length === 0) {
                setError("No instructions found for this recipe.");
                setIsLoading(false);
                return;
            }

            setSteps(parsedSteps);
            setIsLoading(false);

            // Start speaking first step
            speakStep(0, parsedSteps);

        } catch (err) {
            console.error("Error:", err);
            setError(err.message);
            setIsLoading(false);
        }
    };

    const resetState = () => {
        if (synthesis) synthesis.cancel();
        setSteps([]);
        setCurrentStepIndex(0);
        setIsPaused(false);
        setIsSpeaking(false);
        setError('');
    };

    const getPreferredVoice = () => {
        const voices = synthesis.getVoices();

        // Priority List for Female Voices
        const priorities = [
            "Google US English", // Very natural female
            "Samantha", // Mac default female
            "Microsoft Zira", // Windows default female
            "Google UK English Female",
            "Karen", // Mac
            "Moira", // Mac
            "Tessa", // Mac
            "Veena", // Mac
        ];

        // 1. Try exact matches from priority list
        for (const name of priorities) {
            const found = voices.find(v => v.name === name);
            if (found) return found;
        }

        // 2. Try partial matches for priority list
        for (const name of priorities) {
            const found = voices.find(v => v.name.includes(name));
            if (found) return found;
        }

        // 3. Fallback to any explicitly labeled female voice
        const femaleVoice = voices.find(v =>
            (v.name.toLowerCase().includes("female") ||
                v.name.toLowerCase().includes("woman") ||
                v.name.toLowerCase().includes("girl")) &&
            v.lang.startsWith("en")
        );
        if (femaleVoice) return femaleVoice;

        // 4. Critical Fallback: Any English US voice
        return voices.find(v => v.lang === "en-US") || voices[0];
    };

    const speakStep = (index, currentSteps = steps) => {
        if (!synthesis) return;
        if (index < 0 || index >= currentSteps.length) return;

        synthesis.cancel();
        setCurrentStepIndex(index);
        setIsPaused(false);
        setIsSpeaking(true);

        const text = currentSteps[index];
        const utterance = new SpeechSynthesisUtterance(text);

        const preferredVoice = getPreferredVoice();
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.rate = 0.95; // Slightly slower than default for clarity
        // If we found a specific female voice, use normal pitch. 
        // If we fell back to a generic one, slight bump might help perceieved gender, but risky.
        // Let's stick to 1.05 for a slightly lighter tone.
        utterance.pitch = 1.05;

        utteranceRef.current = utterance;

        utterance.onend = () => {
            setIsSpeaking(false);
            setIsPaused(true);
        };

        utterance.onerror = (e) => {
            console.error("Speech error", e);
            setIsSpeaking(false);
        };

        synthesis.speak(utterance);
    };

    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            const nextIndex = currentStepIndex + 1;
            speakStep(nextIndex);
        }
    };

    const handlePrev = () => {
        if (currentStepIndex > 0) {
            const prevIndex = currentStepIndex - 1;
            speakStep(prevIndex);
        }
    };

    const handlePauseResume = () => {
        if (!synthesis) return;

        if (synthesis.speaking || isSpeaking) {
            if (synthesis.paused) {
                synthesis.resume();
                setIsPaused(false);
                setIsSpeaking(true);
            } else {
                synthesis.pause();
                setIsPaused(true);
                setIsSpeaking(false);
            }
        } else {
            speakStep(currentStepIndex);
        }
    };

    return (
        <div className="cook-page">
            <div className="cook-container">
                {/* Header Pills */}
                <div className="simple-page-header">
                    <motion.span
                        className="title-pill pill-cook"
                        initial={{ opacity: 0, y: -20, rotate: -10 }}
                        animate={{ opacity: 1, y: 0, rotate: -3 }}
                    >
                        COOK
                    </motion.span>
                    <motion.span
                        className="title-pill pill-with"
                        initial={{ opacity: 0, y: -20, rotate: 5 }}
                        animate={{ opacity: 1, y: 0, rotate: 2 }}
                        transition={{ delay: 0.1 }}
                    >
                        WITH
                    </motion.span>
                    <motion.span
                        className="title-pill pill-us"
                        initial={{ opacity: 0, y: -20, rotate: 10 }}
                        animate={{ opacity: 1, y: 0, rotate: -3 }}
                        transition={{ delay: 0.2 }}
                    >
                        US
                    </motion.span>
                </div>

                <div className="input-group">
                    <div className="search-container" ref={dropdownRef}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder="Search recipe (e.g. Rice...)"
                                className="recipe-input"
                                onFocus={() => searchTerm && setShowDropdown(true)}
                            />
                            <Search size={24} style={{
                                position: 'absolute',
                                right: '20px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#1A1E23',
                                pointerEvents: 'none'
                            }} />
                        </div>

                        {showDropdown && (
                            <div className="search-dropdown">
                                {filteredRecipes.length > 0 ? (
                                    filteredRecipes.map((recipe) => (
                                        <div
                                            key={recipe.Recipe_id}
                                            className="dropdown-item"
                                            onClick={() => handleSelectRecipe(recipe)}
                                        >
                                            {recipe.Recipe_title}
                                        </div>
                                    ))
                                ) : (
                                    <div className="dropdown-empty" style={{ padding: '12px 20px', color: '#9ca3af', fontStyle: 'italic', textAlign: 'left' }}>
                                        No recipes found matching "{searchTerm}"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {error && <div className="error-msg">{error}</div>}

                {/* Single Step Display */}
                <AnimatePresence mode="wait">
                    {steps.length > 0 && (
                        <motion.div
                            className="single-step-display"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="step-header">
                                <div className="step-badge">
                                    Step {currentStepIndex + 1} of {steps.length}
                                </div>
                                {isSpeaking && !isPaused && (
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Infinity, duration: 1 }}
                                        style={{ color: '#0050FF' }}
                                    >
                                        <Volume2 size={24} />
                                    </motion.div>
                                )}
                            </div>

                            <motion.div
                                key={currentStepIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="step-content"
                            >
                                {steps[currentStepIndex]}
                            </motion.div>

                            <div className="step-controls">
                                <button
                                    className="control-btn nav-btn"
                                    onClick={handlePrev}
                                    disabled={currentStepIndex === 0}
                                >
                                    <SkipBack size={20} /> Previous
                                </button>

                                <button
                                    className="control-btn play-btn"
                                    onClick={handlePauseResume}
                                >
                                    {isPaused || !isSpeaking ? <Play size={24} fill="white" /> : <Pause size={24} fill="white" />}
                                </button>

                                <button
                                    className="control-btn nav-btn"
                                    onClick={handleNext}
                                    disabled={currentStepIndex === steps.length - 1}
                                >
                                    Next <ArrowRight size={20} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CookWithUs;
