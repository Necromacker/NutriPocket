import React, { useState } from 'react';
import '../styles/CalorieGoal.css';

const CalorieGoal = () => {
    const [calories, setCalories] = useState(2400);

    const handleSliderChange = (e) => {
        setCalories(e.target.value);
    };

    return (
        <section className="calorie-goal-section">
            <div className="decorations">
                <div className="wave-ripple"></div>
                <div className="star-burst">✦</div>
            </div>

            <div className="goal-container">
                <h2 className="goal-title">
                    Set your daily <span className="highlight">GOAL</span> with NutriPocket
                </h2>

                <div className="goal-display">
                    {calories} <span>kcal/Day</span>
                </div>

                <div className="slider-wrapper">
                    <p className="slider-label">{calories.toLocaleString()} kcal Target</p>
                    <input
                        type="range"
                        min="1200"
                        max="4000"
                        step="50"
                        value={calories}
                        onChange={handleSliderChange}
                        className="calorie-slider"
                    />
                    <div className="slider-markers">
                        <span>1200</span>
                        <span>1800</span>
                        <span>2400</span>
                        <span>3000</span>
                        <span>4000+</span>
                    </div>
                </div>

                <button className="start-tracking-btn">
                    Start Tracking Now
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </button>
            </div>
        </section>
    );
};

export default CalorieGoal;
