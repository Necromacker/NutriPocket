import React from 'react';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import FeatureCards from '../components/FeatureCards';
import CalorieGoal from '../components/CalorieGoal';
import FAQ from '../components/FAQ';

const Home = () => {
    return (
        <>
            <Hero />
            <Marquee />
            <FeatureCards />
            <CalorieGoal />
            <FAQ />
        </>
    );
};

export default Home;
