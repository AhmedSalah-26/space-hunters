'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  X, Trophy, Crown, 
  Droplets, Sprout, ShieldCheck 
} from 'lucide-react';
import { 
  topPlayers, 
  leaderboardHeader, 
  leaderboardGlobalStats, 
  leaderboardLabels 
} from '../data/leaderboardData';

export default function LeaderboardModal({ isOpen, onClose }) {
  const { t, lang } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-[#051329]/98 border border-cyan-400/50 shadow-[0_0_50px_rgba(0,180,216,0.35)] flex flex-col max-h-[90vh] overflow-hidden rounded-2xl"
        style={{
          clipPath: 'polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 border-b border-cyan-500/25 bg-[#071a38] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-sm">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <span>{t.navLeaderboard}</span>
                <span className="text-xs text-amber-300 font-mono px-2 py-0.5 bg-amber-950 border border-amber-500/40 rounded-lg">
                  {leaderboardHeader.badge}
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                {lang === 'ar' ? leaderboardHeader.subAr : leaderboardHeader.subEn}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/5 hover:bg-white/15 border border-cyan-500/30 rounded-lg flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Global Impact Summary Row */}
        <div className="grid grid-cols-3 gap-2.5 p-3 bg-[#040e21] border-b border-cyan-500/20 shrink-0 text-center">
          {leaderboardGlobalStats.map((stat) => {
            const Icon = stat.id === 'water' ? Droplets : stat.id === 'nitrogen' ? Sprout : ShieldCheck;
            return (
              <div key={stat.id} className={`p-2.5 bg-[#081730] border ${stat.borderColor} rounded-xl shadow-sm`}>
                <span className="text-xs text-slate-300 block mb-0.5 font-bold">
                  {lang === 'ar' ? stat.titleAr : stat.titleEn}
                </span>
                <span className={`text-sm sm:text-base font-black ${stat.textColor} flex items-center justify-center gap-1.5 font-mono`}>
                  <Icon className="w-4 h-4" />
                  <span>{lang === 'ar' ? stat.value : (stat.valueEn || stat.value)}</span>
                </span>
              </div>
            );
          })}
        </div>

        {/* Leaderboard Table List */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-3.5 space-y-2.5">
          {topPlayers.map((player) => (
            <div
              key={player.rank}
              className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                player.isUser
                  ? 'bg-gradient-to-r from-blue-950/90 via-[#0a2752] to-[#04142d] border-cyan-400 shadow-lg shadow-cyan-500/25 ring-2 ring-cyan-300'
                  : 'bg-[#081730] border-cyan-500/25 hover:border-cyan-400/50'
              }`}
            >
              {/* Rank & Identity */}
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black font-mono text-sm shrink-0 shadow ${
                  player.rank === 1 ? 'bg-amber-500 text-black shadow-md shadow-amber-500/50' :
                  player.rank === 2 ? 'bg-slate-300 text-black' :
                  player.rank === 3 ? 'bg-amber-700 text-white' :
                  'bg-slate-800 text-slate-300 border border-white/10'
                }`}>
                  {player.rank === 1 ? <Crown className="w-5 h-5 stroke-[2.5]" /> : `#${player.rank}`}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{player.countryFlag}</span>
                    <h3 className="text-xs sm:text-sm font-black text-white truncate">
                      {lang === 'ar' ? player.teamAr : player.teamEn}
                    </h3>
                  </div>
                  <span className="text-xs text-cyan-300 font-bold block">
                    {lang === 'ar' ? player.badgeAr : player.badgeEn}
                  </span>
                </div>
              </div>

              {/* Metrics */}
              <div className="flex items-center gap-3 sm:gap-6 text-xs shrink-0 text-right">
                <div className="hidden sm:block">
                  <span className="text-slate-400 block text-[11px] font-bold">
                    {lang === 'ar' ? leaderboardLabels.waterSavedAr : leaderboardLabels.waterSavedEn}
                  </span>
                  <span className="font-black text-sky-400 font-mono text-xs sm:text-sm">{player.waterSaved}</span>
                </div>

                <div className="hidden sm:block">
                  <span className="text-slate-400 block text-[11px] font-bold">
                    {lang === 'ar' ? leaderboardLabels.soilRestoredAr : leaderboardLabels.soilRestoredEn}
                  </span>
                  <span className="font-black text-emerald-400 font-mono text-xs sm:text-sm">{player.soilRestored}</span>
                </div>

                <div className="bg-black/60 px-3 py-1.5 rounded-xl border border-white/10 text-center shadow-inner">
                  <span className="text-slate-400 block text-[10px] font-bold">
                    {lang === 'ar' ? leaderboardLabels.totalScoreAr : leaderboardLabels.totalScoreEn}
                  </span>
                  <span className="text-xs sm:text-sm font-black text-amber-300 font-mono">
                    {player.score}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-cyan-500/20 bg-[#071a38] flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-300 font-bold">
            {lang === 'ar' ? leaderboardHeader.footerNoteAr : leaderboardHeader.footerNoteEn}
          </div>
          <button
            onClick={onClose}
            className="py-1.5 px-5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs sm:text-sm font-black rounded-xl cursor-pointer hover:scale-105 transition-all shadow-md"
          >
            {lang === 'ar' ? leaderboardHeader.closeBtnAr : leaderboardHeader.closeBtnEn}
          </button>
        </div>

      </div>
    </div>
  );
}
