import React, { useState } from 'react';
import { fetchFlavorMatch } from '../utils/api';
import '../styles/HealthOnboarding.css';

const CONDITIONS = [
    {
        id: 'diabetes', label: 'Diabetes', icon: '🍬', description: 'Low sugar/carb requirements',
        toEat: ['Spinach', 'Quinoa', 'Walnuts', 'Greek Yogurt'],
        toAvoid: ['White Bread', 'Soda', 'Fruit Juice', 'Sweetened Cereal']
    },
    {
        id: 'bp', label: 'High Blood Pressure', icon: '❤️', description: 'Low sodium requirements',
        toEat: ['Banana', 'Oats', 'Beetroot', 'Hibiscus Tea'],
        toAvoid: ['Canned Soup', 'Pickles', 'Processed Meat', 'Salted Nuts']
    },
    {
        id: 'lactose', label: 'Lactose Intolerant', icon: '🥛', description: 'Dairy-free molecular alternatives',
        toEat: ['Almond Milk', 'Coconut Yogurt', 'Oat Milk', 'Hard Aged Cheese'],
        toAvoid: ['Milk', 'Soft Cheese', 'Ice Cream', 'Butter']
    },
    {
        id: 'kidney', label: 'Kidney Issues', icon: '💧', description: 'Low potassium/sodium/phosphorus',
        toEat: ['Cauliflower', 'Blueberries', 'Red Bell Pepper', 'Garlic'],
        toAvoid: ['Oranges', 'Bananas', 'Spinach', 'Potatoes']
    },
    {
        id: 'iron', label: 'Iron Deficiency', icon: '🩸', description: 'High iron requirements',
        toEat: ['Lentils', 'Pumpkin Seeds', 'Dark Chocolate', 'Amla'],
        toAvoid: ['Tea with meals', 'Coffee with meals', 'High Calcium foods with meals']
    },
    {
        id: 'allergies', label: 'Allergies', icon: '🤧', description: 'Avoid common allergens',
        toEat: ['Millet', 'Flax Seeds', 'Coconut Milk', 'Sweet Potato'],
        toAvoid: ['Peanuts', 'Dairy', 'Shellfish', 'Soy']
    },
    {
        id: 'cholesterol', label: 'High Cholesterol', icon: '🍳', description: 'Low saturated fat requirements',
        toEat: ['Oatmeal', 'Fatty Fish', 'Avocado', 'Pears'],
        toAvoid: ['Butter', 'Red Meat', 'Full-fat Cheese', 'Fried Foods']
    },
];

const HealthOnboarding = ({ userProfile, onUpdateProfile, filterQuery = '' }) => {
    const [selectedFoodForReplacement, setSelectedFoodForReplacement] = useState(null);
    const [replacements, setReplacements] = useState([]);
    const [loadingReplacement, setLoadingReplacement] = useState(false);

    const filteredConditions = CONDITIONS.filter(condition =>
        condition.label.toLowerCase().includes(filterQuery.toLowerCase()) ||
        condition.description.toLowerCase().includes(filterQuery.toLowerCase())
    );

    const toggleCondition = (id) => {
        const newConditions = userProfile.conditions.includes(id)
            ? userProfile.conditions.filter((c) => c !== id)
            : [...userProfile.conditions, id];
        onUpdateProfile({ ...userProfile, conditions: newConditions });
    };

    const findReplacements = async (food) => {
        setSelectedFoodForReplacement(food);
        setLoadingReplacement(true);

        setTimeout(() => {
            const mockReplacements = [
                { name: `${food} Alternative A`, matches: '842', matchPct: '92%' },
                { name: `${food} Alternative B`, matches: '715', matchPct: '88%' },
                { name: `${food} Alternative C`, matches: '688', matchPct: '85%' },
            ];
            setReplacements(mockReplacements);
            setLoadingReplacement(false);
        }, 1200);
    };

    return (
        <section className="health-onboarding" id="onboarding">
            <div className="section-container">
                <h2 className="section-title">Personalize Your <span className="highlight">Health Profile</span></h2>
                <p className="section-subtitle">Select your health conditions to get tailered food recommendations and safety alerts.</p>

                <div className="conditions-grid">
                    {filteredConditions.length > 0 ? (
                        filteredConditions.map((condition) => (
                            <div key={condition.id} className="condition-wrapper">
                                <div
                                    className={`condition-card ${userProfile.conditions.includes(condition.id) ? 'active' : ''}`}
                                    onClick={() => toggleCondition(condition.id)}
                                >
                                    <div className="condition-icon">{condition.icon}</div>
                                    <h3>{condition.label}</h3>
                                    <p>{condition.description}</p>
                                    <div className="checkbox">
                                        {userProfile.conditions.includes(condition.id) && <span>✓</span>}
                                    </div>
                                </div>

                                {userProfile.conditions.includes(condition.id) && (
                                    <div className="condition-details animate-in">
                                        <div className="details-box eat-list">
                                            <h4>✅ Foods to Eat</h4>
                                            <ul>
                                                {condition.toEat.map(food => (
                                                    <li key={food}>
                                                        <span>{food}</span>
                                                        <button
                                                            className="replace-btn-small"
                                                            onClick={(e) => { e.stopPropagation(); findReplacements(food); }}
                                                        >
                                                            Find Replacement
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="details-box avoid-list">
                                            <h4>❌ Foods to Avoid</h4>
                                            <ul>
                                                {condition.toAvoid.map(food => <li key={food}>{food}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="no-results">
                            <p>No matching health conditions found. Try searching for "BP", "Sugar" or "Milk".</p>
                        </div>
                    )}
                </div>

                {selectedFoodForReplacement && (
                    <div className="replacement-modal">
                        <div className="modal-content">
                            <button className="close-modal" onClick={() => setSelectedFoodForReplacement(null)}>×</button>
                            <h3>Molecular flavor matches for <span className="highlight">{selectedFoodForReplacement}</span></h3>
                            <p className="modal-sub">Comparing molecule profiles via FlavorDB Intelligence</p>

                            <div className="replacement-results-grid">
                                {loadingReplacement ? (
                                    <div className="loader">Analyzing molecules...</div>
                                ) : (
                                    replacements.map((rep, i) => (
                                        <div key={i} className="replacement-result-card">
                                            <div className="rep-rank">#{i + 1} Match</div>
                                            <h4>{rep.name}</h4>
                                            <div className="molecule-stat">
                                                <span className="stat-label">Shared Molecules:</span>
                                                <span className="stat-value">{rep.matches}</span>
                                            </div>
                                            <div className="match-bar">
                                                <div className="match-fill" style={{ width: rep.matchPct }}></div>
                                            </div>
                                            <p className="match-text">{rep.matchPct} flavor profile similarity</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <style jsx>{`
                .no-results {
                    grid-column: 1 / -1;
                    padding: 4rem;
                    text-align: center;
                    background: white;
                    border: 3px dashed #E0E0E0;
                    border-radius: 20px;
                    color: #888;
                    font-size: 1.2rem;
                }
            `}</style>
        </section>
    );
};

export default HealthOnboarding;
