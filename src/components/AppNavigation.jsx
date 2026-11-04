'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Database, Home, Languages, Map, Menu, Sprout, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const SCREEN_TITLES = {
  map: ['Missions', 'المهام'],
  farmPro: ['Farm', 'المزرعة'],
  universalBuilder: ['Rotations', 'الدورات'],
  briefing: ['Briefing', 'الإحاطة'],
  decision: ['Rotation', 'الدورة'],
  results: ['Results', 'النتائج'],
};

export default function AppNavigation({ currentScreen, onBack, onHome, onOpenMap, onOpenFarm, onOpenAgriBank, onOpenGameGuide }) {
  const { lang, isRtl, toggleLanguage } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [titleEn, titleAr] = SCREEN_TITLES[currentScreen] || SCREEN_TITLES.map;
  const title = lang === 'ar' ? titleAr : titleEn;
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  useEffect(() => setMenuOpen(false), [currentScreen]);
  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event) => { if (event.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="app-navigation sticky top-0 z-[60] shrink-0 border-b border-cyan-500/20 bg-[#030914]/95 shadow-[0_4px_20px_rgba(0,0,0,0.28)] backdrop-blur-xl" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="mx-auto flex min-h-[58px] w-full max-w-[1850px] items-center gap-2 px-2.5 sm:px-5 lg:px-8">
        <div className="flex shrink-0 items-center gap-1.5">
          <button type="button" onClick={onBack} aria-label={lang === 'ar' ? 'رجوع إلى الشاشة السابقة' : 'Go back to the previous screen'} className="app-nav-button flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 text-sm font-bold text-slate-100 hover:border-cyan-400/50 hover:bg-cyan-950/60">
            <BackIcon aria-hidden="true" className="h-4 w-4" />
            <span>{lang === 'ar' ? 'رجوع' : 'Back'}</span>
          </button>
          <button type="button" onClick={onHome} aria-label={lang === 'ar' ? 'العودة إلى الصفحة الرئيسية' : 'Return to Home'} title={lang === 'ar' ? 'الرئيسية' : 'Home'} className="app-nav-button flex w-11 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-950/40 text-cyan-200 hover:bg-cyan-900/70">
            <Home aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <div className="min-w-0 flex-1 px-1">
          <p className="truncate text-[11px] font-bold uppercase tracking-[0.12em] text-cyan-300/80 max-sm:hidden">Space Hunters · Field Shift</p>
          <h1 className="app-nav-title truncate text-[15px] font-extrabold leading-tight text-white sm:text-lg">{title}</h1>
        </div>

        <nav aria-label={lang === 'ar' ? 'التنقل الرئيسي' : 'Primary navigation'} className="hidden shrink-0 items-center gap-1 lg:flex">
          <button type="button" onClick={onOpenMap} aria-current={currentScreen === 'map' || ['briefing', 'decision', 'results'].includes(currentScreen) ? 'page' : undefined} className="app-nav-button flex items-center gap-2 rounded-xl px-3 text-sm font-bold text-slate-200 hover:bg-white/10 aria-[current=page]:bg-blue-900/60 aria-[current=page]:text-white">
            <Map aria-hidden="true" className="h-4 w-4" />{lang === 'ar' ? 'المهام التعليمية' : 'Learning missions'}
          </button>
          <button type="button" onClick={onOpenFarm} aria-current={['farmPro', 'universalBuilder'].includes(currentScreen) ? 'page' : undefined} className="app-nav-button flex items-center gap-2 rounded-xl px-3 text-sm font-bold text-slate-200 hover:bg-white/10 aria-[current=page]:bg-cyan-950/70 aria-[current=page]:text-white">
            <Sprout aria-hidden="true" className="h-4 w-4" />{lang === 'ar' ? 'خطط لمزرعتي' : 'Plan for my farm'}
          </button>
        </nav>

        <div className="relative shrink-0">
          <button type="button" className="app-nav-button flex w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-100 hover:bg-white/10" aria-label={lang === 'ar' ? 'فتح قائمة التنقل والموارد' : 'Open navigation and resources'} aria-expanded={menuOpen} aria-controls="app-navigation-menu" onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X aria-hidden="true" className="h-4 w-4" /> : <Menu aria-hidden="true" className="h-4 w-4" />}
          </button>
          {menuOpen && <div id="app-navigation-menu" className="absolute end-0 top-full z-[70] mt-2 grid min-w-56 gap-1 rounded-2xl border border-cyan-500/30 bg-[#061327] p-2 shadow-2xl" role="group" aria-label={lang === 'ar' ? 'الأقسام والموارد' : 'Sections and resources'}>
            <button type="button" onClick={() => { setMenuOpen(false); onOpenMap(); }} className="app-nav-button flex items-center gap-2 rounded-xl px-3 text-start text-sm font-semibold text-slate-100 hover:bg-white/10 lg:hidden"><Map aria-hidden="true" className="h-4 w-4 text-cyan-300" />{lang === 'ar' ? 'المهام التعليمية' : 'Learning missions'}</button>
            <button type="button" onClick={() => { setMenuOpen(false); onOpenFarm(); }} className="app-nav-button flex items-center gap-2 rounded-xl px-3 text-start text-sm font-semibold text-slate-100 hover:bg-white/10 lg:hidden"><Sprout aria-hidden="true" className="h-4 w-4 text-emerald-300" />{lang === 'ar' ? 'مساحة المزرعة' : 'Plan for my farm'}</button>
            <div className="my-1 border-t border-white/10 lg:hidden" />
            <button type="button" onClick={() => { setMenuOpen(false); onOpenAgriBank(); }} className="app-nav-button flex items-center gap-2 rounded-xl px-3 text-start text-sm font-semibold text-slate-100 hover:bg-white/10"><Database aria-hidden="true" className="h-4 w-4 text-cyan-300" />{lang === 'ar' ? 'بنك المحاصيل' : 'Crop library'}</button>
            <button type="button" onClick={() => { setMenuOpen(false); onOpenGameGuide(); }} className="app-nav-button flex items-center gap-2 rounded-xl px-3 text-start text-sm font-semibold text-slate-100 hover:bg-white/10"><BookOpen aria-hidden="true" className="h-4 w-4 text-amber-300" />{lang === 'ar' ? 'دليل التعلم' : 'Learning guide'}</button>
          </div>}
        </div>

        <button type="button" onClick={toggleLanguage} className="app-nav-button flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-cyan-500/30 bg-[#092244] px-2.5 text-sm font-bold text-cyan-100 hover:bg-[#10305e]" aria-label={lang === 'ar' ? 'Switch language to English' : 'تغيير اللغة إلى العربية'}>
          <Languages aria-hidden="true" className="h-4 w-4" />
          <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
        </button>
      </div>
    </header>
  );
}
