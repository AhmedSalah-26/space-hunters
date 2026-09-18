'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Check } from 'lucide-react';

export default function StepperHeader({ currentStep = 1 }) {
  const { t } = useLanguage();

  const steps = [
    { num: 1, title: t.step1 },
    { num: 2, title: t.step2 },
    { num: 3, title: t.step3 },
  ];

  return (
    <div className="w-full py-2 flex items-center justify-center shrink-0">
      <div
        className="flex items-center gap-2 sm:gap-6 bg-[#061633]/95 px-4 sm:px-8 py-2 border border-cyan-400/40 shadow-xl backdrop-blur-md rounded-xl"
        style={{
          clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)',
        }}
      >
        {steps.map((step, index) => {
          const isDone = currentStep > step.num;
          const isActive = currentStep === step.num;

          return (
            <React.Fragment key={step.num}>
              {/* Step Pill */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-xs font-black transition-all shadow-md ${
                    isDone
                      ? 'bg-emerald-500 text-white shadow-emerald-500/40'
                      : isActive
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-cyan-500/50 scale-105'
                      : 'bg-slate-800 text-slate-400 border border-white/10'
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.num}
                </div>
                
                <span
                  className={`text-xs sm:text-sm font-black whitespace-nowrap transition-colors ${
                    isActive
                      ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                      : isDone
                      ? 'text-emerald-300'
                      : 'text-slate-400'
                  }`}
                >
                  {step.title}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`w-4 sm:w-10 h-0.5 transition-all ${
                    currentStep > step.num ? 'bg-emerald-500' : 'bg-slate-700/80'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
