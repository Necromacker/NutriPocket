import React from 'react';
import '../styles/CalorieGoal.css';

const STORIES = [
    {
        id: 1,
        name: 'Sarah Jenkins',
        role: 'Busy Parent',
        description: 'NutriPocket helped me find safer alternatives for my child\'s dairy allergy without sacrificing nutrition.',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
        brand: 'Health Enthusiast'
    },
    {
        id: 2,
        name: 'David Chen',
        role: 'Fitness Athlete',
        description: 'The Smart Scan is a game-changer. I finally understand the real micro-impact of my protein sources.',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
        brand: 'Pro Athlete'
    },
    {
        id: 3,
        name: 'Elena Rodriguez',
        role: 'Medical Student',
        description: 'Using the Health Planner fixed my recurring energy crashes. It honestly feels scientific but simple.',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
        brand: 'Med-User'
    }
];

const CalorieGoal = () => {
    return (
        <section className="stories-section">
            <div className="section-header">
                <h2 className="stories-title">SUCCESS <span className="highlight-tag">STORIES.</span></h2>
            </div>

            <div className="stories-marquee">
                <div className="stories-track">
                    {/* First Set */}
                    {STORIES.map((story) => (
                        <div key={`set1-${story.id}`} className="story-card">
                            <div className="story-visual">
                                <img src={story.image} alt={story.name} className="story-img" />
                            </div>
                            <div className="story-content">
                                <div className="brand-badge">
                                    <span>★</span>
                                    {story.brand}
                                </div>
                                <h3 className="story-name">{story.name}</h3>
                                <p className="story-desc">
                                    {story.description}
                                </p>
                            </div>
                        </div>
                    ))}
                    {/* Second Set for Loop */}
                    {STORIES.map((story) => (
                        <div key={`set2-${story.id}`} className="story-card">
                            <div className="story-visual">
                                <img src={story.image} alt={story.name} className="story-img" />
                            </div>
                            <div className="story-content">
                                <div className="brand-badge">
                                    <span>★</span>
                                    {story.brand}
                                </div>
                                <h3 className="story-name">{story.name}</h3>
                                <p className="story-desc">
                                    {story.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CalorieGoal;
