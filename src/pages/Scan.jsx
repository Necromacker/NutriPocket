import React from 'react';
import SmartFoodScan from '../components/SmartFoodScan';

const Scan = ({ userProfile }) => {
    return (
        <div className="page-container" style={{ padding: 0, background: 'transparent' }}>
            <SmartFoodScan userProfile={userProfile} />
        </div>
    );
};

export default Scan;
