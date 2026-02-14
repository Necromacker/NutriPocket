import React, { useState } from 'react';
import { NUTRIENT_EXPLANATIONS, HEALTH_RULES } from '../utils/api';
import '../styles/SmartFoodScan.css';

const SmartFoodScan = ({ userProfile }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showReplacement, setShowReplacement] = useState(false);

    // Mock search for demo purposes - in real app, call the API
    const handleSearch = () => {
        if (!searchQuery) return;
        setLoading(true);

        // Simulating API response based on common foods
        setTimeout(() => {
            const mockResults = {
                'Fried Chicken': {
                    name: 'Fried Chicken',
                    calories: 246,
                    nutrients: [
                        { name: 'Protein', value: '25g', status: 'safe' },
                        { name: 'Carbs', value: '12g', status: 'safe' },
                        { name: 'Fat', value: '18g', status: 'risk', type: 'Saturated Fat' },
                        { name: 'Sodium', value: '450mg', status: 'risk' },
                        { name: 'Iron', value: '1.2mg', status: 'neutral' },
                    ],
                    alternatives: [
                        { name: 'Grilled Chicken', tasteMatch: '95%', reason: '80% less saturated fat, higher protein' },
                        { name: 'Lentil Cutlet', tasteMatch: '82%', reason: 'Zero cholesterol, high fiber' },
                        { name: 'Chickpea Wrap', tasteMatch: '78%', reason: 'Plant-based, better for BP' }
                    ]
                },
                'Apple': {
                    name: 'Apple',
                    calories: 52,
                    nutrients: [
                        { name: 'Protein', value: '0.3g', status: 'neutral' },
                        { name: 'Carbs', value: '14g', status: 'safe' },
                        { name: 'Fiber', value: '2.4g', status: 'safe' },
                        { name: 'Vitamin C', value: '4.6mg', status: 'safe' },
                    ]
                }
            };

            setResult(mockResults[searchQuery] || mockResults['Fried Chicken']);
            setLoading(false);
            setShowReplacement(false);
        }, 800);
    };

    const getNutrientRisk = (name) => {
        let risks = [];
        userProfile.conditions.forEach(condition => {
            const rules = HEALTH_RULES[condition];
            if (rules && rules.limit && rules.limit.includes(name)) {
                risks.push(rules.warning);
            }
        });
        return risks;
    };

    return (
        <section className="smart-scan" id="scan">
            <div className="section-container">
                <h2 className="section-title">Smart Food <span className="highlight">Scan</span></h2>
                <p className="section-subtitle">Snapshot any food to see its microscopic impact on YOUR body.</p>

                <div className="scan-interface">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Type a food (e.g. Fried Chicken)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button onClick={handleSearch} className="scan-btn">
                            {loading ? 'Analyzing...' : 'Analyze Food'}
                        </button>
                    </div>

                    {result && (
                        <div className="result-card">
                            <div className="result-header">
                                <h3>{result.name}</h3>
                                <span className="calories">{result.calories} kcal/100g</span>
                            </div>

                            <div className="nutrients-grid">
                                {result.nutrients.map((nut, idx) => {
                                    const risks = getNutrientRisk(nut.name);
                                    const isRisky = risks.length > 0 || nut.status === 'risk';
                                    return (
                                        <div key={idx} className={`nutrient-item ${isRisky ? 'risky' : ''}`}>
                                            <div className="nut-main">
                                                <span className="nut-name">{nut.name}</span>
                                                <span className="nut-value">{nut.value}</span>
                                            </div>
                                            <div className="nut-impact">
                                                <p className="explanation">{NUTRIENT_EXPLANATIONS[nut.name] || 'Vital for body functions.'}</p>
                                                {risks.map((risk, i) => (
                                                    <p key={i} className="risk-warning">⚠️ {risk}</p>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {userProfile.conditions.length > 0 && result.alternatives && (
                                <div className="replacement-engine">
                                    <button
                                        className="find-replacement-btn"
                                        onClick={() => setShowReplacement(!showReplacement)}
                                    >
                                        {showReplacement ? 'Hide Alternatives' : 'Find Safer Replacements'}
                                    </button>

                                    {showReplacement && (
                                        <div className="alternatives-list">
                                            <h4>Intelligent Replacements</h4>
                                            <p className="engine-note">Based on molecular flavor similarity & health profile</p>
                                            {result.alternatives.map((alt, i) => (
                                                <div key={i} className="alt-item">
                                                    <div className="alt-header">
                                                        <span className="alt-name">✔ {alt.name}</span>
                                                        <span className="alt-match">Match {alt.tasteMatch}</span>
                                                    </div>
                                                    <p className="alt-reason">{alt.reason}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default SmartFoodScan;
