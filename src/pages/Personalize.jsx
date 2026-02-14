import React from 'react';
import HealthOnboarding from '../components/HealthOnboarding';

const Personalize = ({ userProfile, onUpdateProfile }) => {
    return (
        <div className="page-container">
            <div className="page-header" style={{ textAlign: 'center', padding: '6rem 2rem 0', backgroundColor: 'var(--bg-cream)' }}>
                <h1 className="hero-title" style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>Precision <span className="highlight">Personalization</span></h1>
                <p className="hero-description" style={{ maxWidth: '700px', margin: '0 auto' }}>Adjust your health profile to get molecularly-accurate food suggestions tailored to your biology.</p>
            </div>
            <HealthOnboarding userProfile={userProfile} onUpdateProfile={onUpdateProfile} />
        </div>
    );
};

export default Personalize;
