import React, { useState, useRef, useEffect } from 'react';
import '../styles/CookWithUs.css';
import { Play, Pause, SkipForward, SkipBack, Loader2 } from 'lucide-react';

const CookWithUs = () => {
    // State
    const [recipeId, setRecipeId] = useState('2615');
    const [steps, setSteps] = useState([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Refs
    // Use window.speechSynthesis directly, assuming browser support
    const synthesis = window.speechSynthesis;
    const utteranceRef = useRef(null);
    const stepRefs = useRef({});

    // Effect to cancel speech on unmount
    useEffect(() => {
        return () => {
            if (synthesis) synthesis.cancel();
        };
    }, []);

    // Scroll active step into view
    useEffect(() => {
        if (steps.length > 0 && stepRefs.current[currentStepIndex]) {
            stepRefs.current[currentStepIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [currentStepIndex, steps]);

    const fetchAndStart = async () => {
        if (!recipeId) {
            setError("Please enter a Recipe ID.");
            return;
        }

        resetState();
        setIsLoading(true);
        setError('');

        try {
            // Updated to use the main backend port 5000
            const response = await fetch(`http://127.0.0.1:5002/api/instructions/${recipeId}`);

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

    const speakStep = (index, currentSteps = steps) => {
        if (!synthesis) return;
        if (index < 0 || index >= currentSteps.length) return;

        synthesis.cancel();
        setCurrentStepIndex(index);
        setIsPaused(false);
        setIsSpeaking(true);

        const text = currentSteps[index];
        const utterance = new SpeechSynthesisUtterance(text);
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
            speakStep(currentStepIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentStepIndex > 0) {
            speakStep(currentStepIndex - 1);
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
            // Not speaking, start current step
            speakStep(currentStepIndex);
        }
    };

    return (
        <div className="cook-page">
            <div className="cook-container">
                <h1 className="cook-title">Chef's <span style={{ color: 'var(--secondary-pink)' }}>Voice</span></h1>

                <div className="input-group">
                    <input
                        type="number"
                        value={recipeId}
                        onChange={(e) => setRecipeId(e.target.value)}
                        placeholder="Enter Recipe ID (e.g., 2615)"
                        className="recipe-input"
                        onKeyDown={(e) => e.key === 'Enter' && fetchAndStart()}
                    />
                    <button
                        onClick={fetchAndStart}
                        disabled={isLoading}
                        className="start-cooking-btn"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : "Start Cooking"}
                    </button>
                </div>

                {error && <div className="error-msg">{error}</div>}

                {steps.length > 0 && (
                    <>
                        <div className="controls">
                            <button onClick={handlePrev} disabled={currentStepIndex === 0} className="control-btn">
                                <SkipBack size={20} /> Prev
                            </button>
                            <button onClick={handlePauseResume} className={`control-btn ${!isPaused && isSpeaking ? 'active' : ''}`}>
                                {isPaused || !isSpeaking ? <Play size={20} /> : <Pause size={20} />}
                                {isPaused || !isSpeaking ? "Resume" : "Pause"}
                            </button>
                            <button onClick={handleNext} disabled={currentStepIndex === steps.length - 1} className="control-btn">
                                Next <SkipForward size={20} />
                            </button>
                        </div>

                        <div id="instructions-display">
                            {steps.map((step, idx) => (
                                <div
                                    key={idx}
                                    ref={el => stepRefs.current[idx] = el}
                                    className={`step-card ${currentStepIndex === idx ? 'active' : ''}`}
                                    onClick={() => speakStep(idx)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="step-number">Step {idx + 1}</div>
                                    <div className="step-text">{step}</div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CookWithUs;
