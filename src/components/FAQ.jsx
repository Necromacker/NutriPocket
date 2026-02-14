import React, { useState } from 'react';
import '../styles/FAQ.css';

const FAQ_DATA = [
    {
        question: "How accurate is the molecular food replacement?",
        answer: "Our engine uses the FlavorDB dataset to match foods based on shared molecular profiles. While highly accurate scientifically, we recommend always checking for personal allergies."
    },
    {
        question: "Does NutriPocket connect with fitness apps?",
        answer: "Currently, NutriPocket focuses on deep nutritional intelligence. Integration with popular fitness trackers is planned for our Q3 update."
    },
    {
        question: "Is my health data secure and private?",
        answer: "Absolutely. Your health conditions and profiles are stored locally or encrypted. We never sell your personal health data to third parties."
    },
    {
        question: "How does the scanner identify nutrients?",
        answer: "Our scanner uses advanced image recognition coupled with the Foodoscope API to identify food items and retrieve their micro-nutrient profiles in real-time."
    },
    {
        question: "Can I use NutriPocket for specific diets like Keto or Paleo?",
        answer: "Yes! By setting your specific 'Foods to Avoid' and 'Foods to Eat' in the personalization section, you can tailor NutriPocket to any dietary methodology."
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
