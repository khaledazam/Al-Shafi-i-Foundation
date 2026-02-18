import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('ar'); // Default to Arabic
    const [direction, setDirection] = useState('rtl');

    useEffect(() => {
        // Update document direction
        document.documentElement.dir = direction;
        document.documentElement.lang = language;
    }, [direction, language]);

    const toggleLanguage = () => {
        const newLang = language === 'ar' ? 'en' : 'ar';
        setLanguage(newLang);
        setDirection(newLang === 'ar' ? 'rtl' : 'ltr');
    };

    const t = (textAr, textEn) => {
        return language === 'ar' ? textAr : textEn;
    };

    return (
        <LanguageContext.Provider value={{ language, direction, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
