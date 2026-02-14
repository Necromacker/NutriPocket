import React from 'react';
import DeficiencyChecker from '../components/DeficiencyChecker';

const Deficiency = () => {
    return (
        <div className="page-container">
            <div className="page-header" style={{ textAlign: 'center', padding: '6rem 2rem 0', backgroundColor: 'var(--bg-cream)' }}>
                <h1 className="hero-title" style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>Deficiency <span className="highlight">Detection</span></h1>
                <p className="hero-description" style={{ maxWidth: '700px', margin: '0 auto' }}>Match your symptoms to potential micronutrient gaps and discover superfoods that bridge those gaps.</p>
            </div>
            <DeficiencyChecker />
        </div>
    );
};

export default Deficiency;
