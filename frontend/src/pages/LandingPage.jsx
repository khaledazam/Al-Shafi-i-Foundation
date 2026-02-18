import React from 'react';
import HeroSection from '../components/landing/HeroSection';
import ProductShowcase from '../components/landing/ProductShowcase';

const LandingPage = () => {
    return (
        <div className="min-h-screen">
            <HeroSection />
            <ProductShowcase />
        </div>
    );
};

export default LandingPage;
