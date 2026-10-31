'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');
  const [languageLoaded, setLanguageLoaded] = useState(false);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = translations[lang] || translations.en;
  const isRtl = lang === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  useEffect(() => {
    try {
      const savedLanguage = window.localStorage.getItem('space-hunters-language');
      if (savedLanguage === 'en' || savedLanguage === 'ar') {
        setLang(savedLanguage);
      }
    } catch {
      // Keep English as the default if browser storage is unavailable.
    }
    setLanguageLoaded(true);
  }, []);

  useEffect(() => {
    if (!languageLoaded) return;

    try {
      window.localStorage.setItem('space-hunters-language', lang);
    } catch {
      // The language still works for this session if browser storage is unavailable.
    }
  }, [lang, languageLoaded]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
