import React, { useState } from 'react';
import '../styles/FAQ.css';

const FAQ_DATA = [
    {
        question: "How does NutriPocket decide if a food is safe?",
        answer:
            "NutriPocket analyzes nutrients like sugar, fat, and sodium and compares them with your selected health conditions to generate a safety score."
    },
    {
        question: "What health conditions does NutriPocket support?",
        answer:
            "It supports conditions like diabetes, high blood pressure, heart health, iron deficiency, and weight management."
    },
    {
        question: "How does the food scanning feature work?",
        answer:
            "You upload a photo, and AI identifies the dish and matches it with nutrition data to calculate a health score instantly."
    },
    {
        question: "What does the health safety score mean?",
        answer:
            "Green means safe, yellow means moderate, and red means the food may not be suitable for your condition."
    },
    {
        question: "Can NutriPocket suggest healthier alternatives?",
        answer:
            "Yes, it recommends safer food options with similar taste but better nutrition for your health needs."
    },
    {
        question: "Is my health data secure?",
        answer:
            "Yes, all personal and health data is stored securely and never shared with third parties."
    }
];

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="faq-section">
            <div className="faq-container">
                <h2 className="faq-title">
                    Frequently <span className="highlight">ASKED</span> Questions
                </h2>

                <div className="accordion-list">
                    {FAQ_DATA.map((item, index) => (
                        <div
                            key={index}
                            className={`accordion-item ${activeIndex === index ? 'active' : ''}`}
                        >
                            <button
                                className="accordion-header"
                                onClick={() => toggleAccordion(index)}
                            >
                                <span>{item.question}</span>
                                <span className="arrow">{activeIndex === index ? '▲' : '▼'}</span>
                            </button>
                            <div className="accordion-content">
                                <div className="inner-content">
                                    {item.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
