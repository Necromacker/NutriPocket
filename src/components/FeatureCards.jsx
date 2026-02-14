import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/FeatureCards.css';

const FEATURES = [
    {
        id: 'personalize',
        title: 'Precision Personalization',
        subtitle: 'Decode Every Ingredient for YOUR Biology',
        description: 'Stop guessing what is "healthy". Our replacement engine analyzes molecular matches to find the safest food alternatives for your specific medical conditions.',
        points: [
            'Condition-Specific Filters',
            'Food Replacement Engine',
            'Molecular Flavor Database',
            'Safe/Risk Analysis'
        ],
        color: '#6C48FF', // Purple
        link: '/personalize',
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 'scan',
        title: 'Micro-Impact Scanner',
        subtitle: 'See the Invisible Micro-Impact',
        description: 'Instantly decode vitamins and minerals in any food item to see how they affect your health.',
        points: [
            'Instant Nutrition Detection',
            'Vitamin & Mineral Intel',
            'Biological Role Explanation',
            'Cam-to-Macro Insight'
        ],
        color: '#FFB800', // Yellow
        link: '/scan',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 'deficiency',
        title: 'Deficiency Detection',
        subtitle: 'Listen to Your Body\'s Signals',
        description: 'Connecting the dots between how you feel and what you eat. Identify micronutrient gaps based on recurring symptoms and get targetted superfood recommendations.',
        points: [
            'Symptom-Logic Matching',
            'Micronutrient Gap Finder',
            'Targeted Superfoods',
            'Daily Health Tracking'
        ],
        color: '#00D1FF', // Blue
        link: '/deficiency',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800'
    }
];

const FeatureCards = () => {
    return (
        <section className="feature-cards-section">
            <div className="features-intro">
                <h2 className="section-title">One Platform. Three <span className="highlight">Game-Changers</span></h2>
            </div>

            <div className="cards-stack-container">
                {FEATURES.map((feature, index) => (
                    <div
                        key={feature.id}
                        className="feature-card-wrapper"
                        style={{
                            top: `${100 + (index * 40)}px`,
                            zIndex: index + 1
                        }}
                    >
                        <div className="feature-card" style={{ backgroundColor: feature.color }}>
                            <div className="card-info">
                                <h3>{feature.title}</h3>
                                <p className="card-subtitle">{feature.subtitle}</p>

                                <ul className="card-points">
                                    {feature.points.map(point => (
                                        <li key={point}>{point}</li>
                                    ))}
                                </ul>

                                <Link to={feature.link} className="card-cta">
                                    Start For Free
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </Link>
                            </div>

                            <div className="card-visual">
                                <img src={feature.image} alt={feature.title} className="feature-card-image" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeatureCards;
