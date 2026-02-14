import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CONDITIONS } from '../constants/healthData';
import '../styles/Personalize.css';

const Personalize = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const filteredConditions = CONDITIONS.filter(c =>
        c.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (id) => {
        navigate(`/personalize/${id}`);
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
                            Precise Care for Every <br />
                            Body, Lifestyle and
                        </h1>
                        <div className="biology-box">
                            <span className="biology-text">BIOLOGY</span>
                        </div>

                        <p className="hero-subtext">
                            Input your health profile, NutriPocket works for you. <br />
                            Better food choices, better long-term health.
                        </p>

                        <button className="start-free-btn">
                            Personalize Now <ArrowRight size={22} />
                        </button>
                    </motion.div>
                </div>

                <div className="hero-image">
                    <motion.img
                        src="/artha-hero.png"
                        alt="Illustration"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    />
                </div>
            </div>

            <div className="selection-area">
                <div className="selection-inner" ref={dropdownRef}>
                    <div className="close-indicator">
                        <X size={20} />
                    </div>

                    <div className="selector-group">
                        <h2 className="selection-label">I have</h2>
                        <div className="input-container">
                            <input
                                type="text"
                                className="search-input-rect"
                                placeholder="Lactose Intolerant, High BP..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setIsOpen(true);
                                }}
                                onFocus={() => setIsOpen(true)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && filteredConditions.length > 0) {
                                        handleSelect(filteredConditions[0].id);
                                    }
                                }}
                            />

                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="search-results-dropdown"
                                    >
                                        <div className="menu-items">
                                            {filteredConditions.map((c) => (
                                                <div
                                                    key={c.id}
                                                    className="menu-item"
                                                    onClick={() => handleSelect(c.id)}
                                                >
                                                    <span className="item-icon">{c.icon}</span>
                                                    <span className="item-label">{c.label}</span>
                                                </div>
                                            ))}
                                            {filteredConditions.length === 0 && (
                                                <div className="no-results">
                                                    No results for "{searchTerm}"
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Personalize;
