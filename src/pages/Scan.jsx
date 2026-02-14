import React from 'react';
import SmartFoodScan from '../components/SmartFoodScan';

const Scan = ({ userProfile }) => {
    return (
        <div className="page-container">
            <div className="page-header" style={{ textAlign: 'center', padding: '6rem 2rem 0', backgroundColor: 'var(--bg-cream)' }}>
                <h1 className="hero-title" style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>Micro-Impact <span className="highlight">Scanner</span></h1>
                <p className="hero-description" style={{ maxWidth: '700px', margin: '0 auto' }}>Scan any food item to see its microscopic impact on your body based on your unique health profile.</p>
            </div>
            <SmartFoodScan userProfile={userProfile} />
        </div>
    );
};

export default Scan;
