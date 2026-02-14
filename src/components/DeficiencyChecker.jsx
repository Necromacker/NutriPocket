import React, { useState } from 'react';
import '../styles/DeficiencyChecker.css';

const SYMPTOMS = [
    { id: 'fatigue', label: 'Fatigue / Low Energy', nutrients: ['Iron', 'Vitamin B12', 'Magnesium'], foods: ['Spinach', 'Lentils', 'Red Meat', 'Pumpkin Seeds'] },
    { id: 'hairfall', label: 'Hair Fall', nutrients: ['Biotin', 'Zinc', 'Iron', 'Protein'], foods: ['Eggs', 'Walnuts', 'Sweet Potatoes', 'Oats'] },
    { id: 'immunity', label: 'Weak Immunity', nutrients: ['Vitamin C', 'Vitamin D', 'Zinc'], foods: ['Oranges', 'Bell Peppers', 'Garlic', 'Yogurt'] },
    { id: 'cramps', label: 'Muscle Cramps', nutrients: ['Potassium', 'Magnesium', 'Calcium'], foods: ['Bananas', 'Almonds', 'Dark Chocolate', 'Leafy Greens'] },
];

const DeficiencyChecker = () => {
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);

    const toggleSymptom = (id) => {
        setSelectedSymptoms(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const getRecommendations = () => {
        const nutrients = new Set();
        const foods = new Set();
        selectedSymptoms.forEach(sid => {
            const s = SYMPTOMS.find(item => item.id === sid);
            if (s) {
                s.nutrients.forEach(n => nutrients.add(n));
                s.foods.forEach(f => foods.add(f));
            }
        });
        return { nutrients: Array.from(nutrients), foods: Array.from(foods) };
    };

    const { nutrients, foods } = getRecommendations();

    return (
        <section className="deficiency-checker" id="deficiency">
            <div className="section-container">
                <h2 className="section-title">Deficiency <span className="highlight">Detection</span></h2>
                <p className="section-subtitle">Select your recurring symptoms to identify potential micronutrient gaps.</p>

                <div className="symptoms-selector">
                    {SYMPTOMS.map(s => (
                        <button
                            key={s.id}
                            className={`symptom-btn ${selectedSymptoms.includes(s.id) ? 'active' : ''}`}
                            onClick={() => toggleSymptom(s.id)}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>

                {selectedSymptoms.length > 0 && (
                    <div className="recommendation-results">
                        <div className="rec-box">
                            <h4>Potential Gaps</h4>
                            <div className="tag-list">
                                {nutrients.map(n => <span key={n} className="nut-tag">{n}</span>)}
                            </div>
                        </div>

                        <div className="rec-box">
                            <h4>Recommended Superfoods</h4>
                            <div className="food-grid">
                                {foods.map(f => (
                                    <div key={f} className="food-card">
                                        <span className="food-icon">🥗</span>
                                        <span className="food-name">{f}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default DeficiencyChecker;
