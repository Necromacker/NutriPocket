import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Search, ArrowRight, X } from 'lucide-react';
import { CONDITIONS } from '../constants/healthData';
import '../styles/Personalize.css';

const CustomDropdown = ({ options, value, onChange, placeholder, className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`custom-dropdown ${className}`} ref={dropdownRef}>
            <div
                className={`dropdown-trigger ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={selectedOption ? 'value-text' : 'placeholder-text'}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown size={18} className={`dropdown-icon ${isOpen ? 'rotated' : ''}`} strokeWidth={2.5} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="dropdown-menu"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {options.map((option) => (
                            <div
                                key={option.value}
                                className={`dropdown-option ${option.value === value ? 'selected' : ''}`}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                            >
                                {option.label}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const DIET_TYPES = [
    { value: 'vegan', label: 'Vegan' },
    { value: 'keto', label: 'Keto' },
    { value: 'paleo', label: 'Paleo' },
    { value: 'balanced', label: 'Balanced' }
];

const ALLERGIES = [
    { value: 'none', label: 'None' },
    { value: 'nuts', label: 'Nuts' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'gluten', label: 'Gluten' }
];

const GOALS = [
    { value: 'weight-loss', label: 'Weight Loss' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'muscle-gain', label: 'Muscle Gain' }
];

const REPLACEMENTS = {
    'Spinach': ['Kale', 'Swiss Chard', 'Collard Greens'],
    'Quinoa': ['Brown Rice', 'Barley', 'Buckwheat'],
    'Walnuts': ['Almonds', 'Chia Seeds', 'Flax Seeds'],
    'Greek Yogurt': ['Cottage Cheese', 'Kefir', 'Skyr'],
    'Banana': ['Apricots', 'Oranges', 'Melon'],
    'Oats': ['Brown Rice', 'Quinoa', 'Bran'],
    'Beetroot': ['Carrots', 'Spinach', 'Leafy Greens'],
    'Hibiscus Tea': ['Green Tea', 'Chamomile Tea', 'Water'],
    'Tempeh': ['Tofu', 'Seitan', 'Cashew Nuts'],
    'Coconut Yogurt': ['Almond Yogurt', 'Soy Yogurt', 'Cashew Yogurt'],
    'Hard Aged Cheese': ['Nutritional Yeast', 'Tofu', 'Tempeh'],
    'Cauliflower': ['Broccoli', 'Cabbage', 'Brussels Sprouts'],
    'Blueberries': ['Strawberries', 'Raspberries', 'Blackberries'],
    'Red Bell Pepper': ['Green Bell Pepper', 'Carrots', 'Tomatoes'],
    'Garlic': ['Onion', 'Shallots', 'Chives'],
    'Lentils': ['Chickpeas', 'Black Beans', 'Kidney Beans'],
    'Pumpkin Seeds': ['Sunflower Seeds', 'Sesame Seeds', 'Hemp Seeds'],
    'Dark Chocolate': ['Cacao Nibs', 'Carob', 'Dates'],
    'Amla': ['Orange', 'Lemon', 'Guava'],
    'Millet': ['Sorghum', 'Teff', 'Amaranth'],
    'Flax Seeds': ['Chia Seeds', 'Hemp Seeds', 'Walnuts'],
    'Coconut Milk': ['Almond Milk', 'Cashew Milk', 'Oat Milk'],
    'Sweet Potato': ['Pumpkin', 'Squash', 'Carrots'],
    'Oatmeal': ['Quinoa Flakes', 'Buckwheat Porridge', 'Millet Porridge'],
    'Fatty Fish': ['Walnuts', 'Chia Seeds', 'Flax Seeds'],
    'Avocado': ['Olive Oil', 'Nuts', 'Seeds'],
    'Pears': ['Apples', 'Plums', 'Peaches']
};

const Personalize = () => {
    const navigate = useNavigate();
    const [selectedCondition, setSelectedCondition] = useState('');
    const [dietType, setDietType] = useState('');
    const [allergy, setAllergy] = useState('');
    const [goal, setGoal] = useState('');
    const [showPlan, setShowPlan] = useState(false);

    const [foodsToEat, setFoodsToEat] = useState([]);
    const [activeReplacement, setActiveReplacement] = useState(null);

    const conditionOptions = CONDITIONS.map(c => ({
        value: c.id,
        label: c.label
    }));

    const handleSearch = () => {
        if (selectedCondition) {
            setShowPlan(true);
            const conditionData = CONDITIONS.find(c => c.id === selectedCondition);
            if (conditionData) {
                setFoodsToEat(conditionData.toEat);
            }
        }
    };

    const selectedConditionData = CONDITIONS.find(c => c.id === selectedCondition);

    useEffect(() => {
        if (selectedConditionData) {
            setFoodsToEat(selectedConditionData.toEat);
        }
    }, [selectedConditionData]);

    const getReplacements = (food) => {
        return REPLACEMENTS[food] || ['Mixed Salad', 'Cucumber Slices', 'Grilled Tofu'];
    };

    const handleReplace = (index, newFood) => {
        const newFoods = [...foodsToEat];
        newFoods[index] = newFood;
        setFoodsToEat(newFoods);
        setActiveReplacement(null);
    };

    return (
        <div className="personalize-page">
            <div className="hero-section">
                <div className="hero-content">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="hero-main-title">
                            Smart Features Powered <br />
                            By Your Own
                            <span className="genie-tag"> AI GENIE</span>
                        </h1>

                        <p className="hero-subtext">
                            We've got all the features to run and manage your health on
                            autopilot; you just share and earn better health.
                        </p>
                    </motion.div>
                </div>

                <div className="hero-image-container">
                    <motion.div
                        className="hero-card-bg"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="card-interface">
                            <div className="card-header">
                                <span className="smart-tag">Smart Food Planner</span>
                                <div className="header-decoration"></div>
                            </div>
                            <div className="card-body">
                                <div className="stat-row">
                                    <div className="stat-pill">Next meal: Quinoa Salad</div>
                                    <div className="stat-pill blue">1200 kcal remaining</div>
                                </div>
                                <div className="graph-placeholder">
                                    <div className="graph-line short"></div>
                                    <div className="graph-line long"></div>
                                    <div className="graph-line medium"></div>
                                    <div className="graph-line short"></div>
                                </div>
                            </div>
                            <div className="float-tag">
                                <span>Health Score</span>
                                <strong>98/100</strong>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="filter-bar-wrapper">
                <div className="filter-bar">
                    <div className="filter-item large-dropdown">
                        <span className="label">Health Condition <span className="required-star">*</span></span>
                        <CustomDropdown
                            options={conditionOptions}
                            value={selectedCondition}
                            onChange={setSelectedCondition}
                            placeholder="Select Condition..."
                        />
                    </div>

                    <div className="filter-divider"></div>

                    <div className="filter-item dropdown-item">
                        <span className="label">Diet Type</span>
                        <CustomDropdown
                            options={DIET_TYPES}
                            value={dietType}
                            onChange={setDietType}
                            placeholder="Select"
                        />
                    </div>

                    <div className="filter-divider"></div>

                    <div className="filter-item dropdown-item">
                        <span className="label">Allergies</span>
                        <CustomDropdown
                            options={ALLERGIES}
                            value={allergy}
                            onChange={setAllergy}
                            placeholder="Select"
                        />
                    </div>

                    <div className="filter-divider"></div>

                    <div className="filter-item dropdown-item">
                        <span className="label">Goal</span>
                        <CustomDropdown
                            options={GOALS}
                            value={goal}
                            onChange={setGoal}
                            placeholder="Select"
                        />
                    </div>

                    <button className="generate-btn icon-only" onClick={handleSearch}>
                        <Search size={24} strokeWidth={3} />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {showPlan && selectedConditionData && (
                    <motion.div
                        className="plan-results-container"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Foods to Avoid Column */}
                        <div className="plan-column">
                            <div className="column-header">
                                <span className="icon-badge red">🚫</span>
                                <h3 className="column-title">Foods to Avoid</h3>
                            </div>
                            <div className="foods-grid">
                                {selectedConditionData.toAvoid.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        className="food-item-card"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <div className="food-content">
                                            <span className="food-name">{item}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <button
                                className="create-meal-btn"
                                onClick={() => navigate('/cook')}
                            >
                                Create a healthy meal <ArrowRight size={20} />
                            </button>
                        </div>

                        {/* Foods to Eat Column */}
                        <div className="plan-column">
                            <div className="column-header">
                                <span className="icon-badge green">🥗</span>
                                <h3 className="column-title">Foods to Eat</h3>
                            </div>
                            <div className="foods-grid">
                                {foodsToEat.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        className="food-item-card relative-container"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <div className="food-content">
                                            <span className="food-name">{item}</span>
                                        </div>
                                        <div
                                            className="card-action small"
                                            onClick={() => setActiveReplacement(activeReplacement === index ? null : index)}
                                        >
                                            Find replacement <ArrowRight size={16} />
                                        </div>
                                        <AnimatePresence>
                                            {activeReplacement === index && (
                                                <motion.div
                                                    className="replacement-popup"
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                >
                                                    <div className="popup-header">
                                                        <span>Select Replacement</span>
                                                        <button className="close-btn" onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveReplacement(null);
                                                        }}>
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                    <div className="replacement-options">
                                                        {getReplacements(item).map((rep, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="replacement-option"
                                                                onClick={() => handleReplace(index, rep)}
                                                            >
                                                                {rep}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Personalize;
