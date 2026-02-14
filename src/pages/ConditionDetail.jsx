import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Check, X, Search } from 'lucide-react';
import { CONDITIONS } from '../constants/healthData';
import '../styles/ConditionDetail.css';

const ConditionDetail = ({ userProfile, onUpdateProfile }) => {
    const { conditionId } = useParams();
    const navigate = useNavigate();
    const condition = CONDITIONS.find(c => c.id === conditionId);

    const [selectedFoodForReplacement, setSelectedFoodForReplacement] = useState(null);
    const [replacements, setReplacements] = useState([]);
    const [loadingReplacement, setLoadingReplacement] = useState(false);

    if (!condition) {
        return <div className="p-20 text-center">Condition not found.</div>;
    }

    const isActive = userProfile.conditions.includes(condition.id);

    const toggleCondition = () => {
        const newConditions = isActive
            ? userProfile.conditions.filter((c) => c !== condition.id)
            : [...userProfile.conditions, condition.id];
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
        <div className="condition-detail-page">
            <div className="detail-container">
                <button onClick={() => navigate('/personalize')} className="back-btn">
                    <ChevronLeft size={20} /> Back
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="condition-main-card"
                >
                    <div className="card-header">
                        <span className="condition-emoji">{condition.icon}</span>
                        <div className="header-text">
                            <h2>{condition.label}</h2>
                            <p>{condition.description}</p>
                        </div>
                        <div className={`status-checkbox ${isActive ? 'checked' : ''}`} onClick={toggleCondition}>
                            {isActive && <Check size={28} color="white" />}
                        </div>
                    </div>
                </motion.div>

                <div className="nutrition-sections">
                    <div className="section-group">
                        <div className="section-title-group">
                            <div className="icon-box" style={{ background: '#E6F7F0', color: '#10B981' }}>
                                <Check size={28} />
                            </div>
                            <h3>FOODS TO EAT</h3>
                        </div>
                        <div className="food-grid">
                            {condition.toEat.map((food, idx) => (
                                <motion.div
                                    key={food}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 * idx }}
                                    className="feature-food-card eat-card"
                                >
                                    <div className="icon-box">
                                        <Check size={24} />
                                    </div>
                                    <div className="food-item-title">{food}</div>
                                    <p className="food-item-desc">
                                        NutriPocket provides molecular analysis to ensure this food aligns with your metabolic needs.
                                    </p>
                                    <button
                                        className="find-replacement-btn"
                                        onClick={() => findReplacements(food)}
                                    >
                                        Find Replacement
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="section-group">
                        <div className="section-title-group">
                            <div className="icon-box" style={{ background: '#FFF0F0', color: '#EF4444' }}>
                                <X size={28} />
                            </div>
                            <h3>FOODS TO AVOID</h3>
                        </div>
                        <div className="food-grid">
                            {condition.toAvoid.map((food, idx) => (
                                <motion.div
                                    key={food}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 * idx }}
                                    className="feature-food-card avoid-card"
                                >
                                    <div className="icon-box">
                                        <X size={24} />
                                    </div>
                                    <div className="food-item-title">{food}</div>
                                    <p className="food-item-desc">
                                        High molecular conflict detected. Consumption may negatively impact your {condition.label.toLowerCase()} management.
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {selectedFoodForReplacement && (
                    <div className="replacement-modal">
                        <div className="modal-content">
                            <button className="close-modal" onClick={() => setSelectedFoodForReplacement(null)}>×</button>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem' }}>
                                <span style={{ color: '#0047FF' }}>{selectedFoodForReplacement}</span>
                            </h3>
                            <div className="replacement-results">
                                {loadingReplacement ? (
                                    <div className="loader">Analyzing Molecules...</div>
                                ) : (
                                    replacements.map((rep, i) => (
                                        <div key={i} style={{
                                            padding: '1.5rem',
                                            border: '3px solid #1A1A1A',
                                            borderRadius: '16px',
                                            marginBottom: '1rem',
                                            background: '#F0F7FF',
                                            boxShadow: '4px 4px 0px #1A1A1A'
                                        }}>
                                            <div style={{ fontWeight: 900, fontSize: '1.2rem' }}>{rep.name}</div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#666' }}>{rep.matchPct} Safety Match</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .loader {
                    padding: 3rem;
                    text-align: center;
                    font-weight: 800;
                    font-size: 1.2rem;
                }
                .close-modal {
                    position: absolute;
                    top: 1rem;
                    right: 1.2rem;
                    font-size: 1.5rem;
                    font-weight: 900;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default ConditionDetail;
