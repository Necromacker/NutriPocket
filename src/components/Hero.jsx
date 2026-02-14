import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import '../styles/Hero.css';

const Hero = () => {
    const heroRef = useRef(null);
    const textRef = useRef(null);
    const imageRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline();
        tl.from(textRef.current.children, {
            y: 50,
            opacity: 1,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out'
        })
            .from(imageRef.current, {
                scale: 0.8,
                opacity: 1,
                duration: 1,
                ease: 'back.out(1.7)'
            }, "-=0.5");
    }, []);

    return (
        <section className="hero" ref={heroRef}>
            <div className="hero-container">
                <div className="hero-content" ref={textRef}>
                    <h1 className="hero-title">
                        Your Personal <br />
                        <span className="highlight">Food Decision</span> <br />
                        Assistant
                    </h1>
                    <p className="hero-description">
                        Go beyond simple calorie counting. NutriPocket uses molecular intelligence
                        to explain how nutrients impact YOUR specific health conditions.
                    </p>
                    <div className="hero-stats">
                        <div className="avatar-group">
                            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop" alt="User" />
                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop" alt="User" />
                            <img src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=50&h=50&fit=crop" alt="User" />
                        </div>
                        <p><strong>4.9★</strong> average user satisfaction</p>
                    </div>
                    <Link to="/personalize" className="hero-btn">
                        Start For Free
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </Link>
                </div>

                <div className="hero-visual" ref={imageRef}>
                    <div className="visual-container">
                        <div className="shape-bg main-shape"></div>
                        <div className="shape-bg floating-shape-1"></div>
                        <div className="shape-bg floating-shape-2"></div>
                        <img
                            src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&h=600&fit=crop"
                            alt="NutriPocket App"
                            className="main-img"
                        />
                        <div className="sparkle sparkle-1">✦</div>
                        <div className="sparkle sparkle-2">✦</div>
                        <div className="decorative-element flower-icon">✿</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
