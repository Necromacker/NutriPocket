import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/FeatureCards.css';

const FEATURES = [
    {
        id: 'personalize',
        title: 'Health Planner',
        subtitle: 'Smart Meal Strategies ',
        description: 'Take the complexity out of healthy eating. Our planner builds custom nutritional strategies based on your unique health profile, goals, and recurring symptoms.',
        points: [
            'Input your health condition & dietary goals',
            'Get condition-specific ingredient recommendations',
            'Nutrient-balanced food suggestions for better health',
        ],
        color: '#6C48FF', // Purple
        link: '/personalize',
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 'scan',
        title: 'Smart Scan',
        subtitle: 'Instant Nutrition Analysis',
        description: 'Instantly decode vitamins, minerals, and overall health impact of any food item using advanced AI vision technology.',
        points: [
            'Click or upload food photos for analysis',
            'Helps track what you eat in real time',
            'Detailed nutrition breakdown',
            'Rapid Real-time Analysis'
        ],
        color: '#FFB800', // Yellow
        link: '/scan',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 'deficiency',
        title: 'Cook with us',
        subtitle: 'Personalized Recipe Engine',
        description: 'Discover delicious, health-optimized recipes tailored specifically to your nutritional needs, health goals, and available ingredients.',
        points: [
            'Condition-Safe Recipes',
            'Dynamic Ingredient Swaps',
            'Step-by-Step Guidance',
            'AI voice assistant guides you while cooking'
        ],
        color: '#00D1FF', // Blue
        link: '/cook',
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800'
    }
];

const FeatureCards = () => {
    return (
        <section className="feature-cards-section">
            <div className="features-intro">
                <h1 className="section-title">One Platform. Three <span className="highlight">Powerful Features</span></h1>
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
                                        <li key={point}><span className="bullet">•</span> {point}</li>
                                    ))}
                                </ul>

                                {feature.link.startsWith('http') ? (
                                    <a href={feature.link} target="_blank" rel="noopener noreferrer" className="card-cta">
                                        Start Cooking
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                            <polyline points="12 5 19 12 12 19"></polyline>
                                        </svg>
                                    </a>
                                ) : (
                                    <Link to={feature.link} className="card-cta">
                                        Start For Free
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                            <polyline points="12 5 19 12 12 19"></polyline>
                                        </svg>
                                    </Link>
                                )}
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
