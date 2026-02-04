import { useState, useEffect } from 'react';
import { Lock, Globe, UsersRound, ArrowRight, Users, ShieldCheck, GraduationCap } from 'lucide-react';
import { getStats } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

export function Home({ onNavigate }) {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ totalMembers: 0, teachesCount: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getStats()
      .then((data) => { if (!cancelled) setStats(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoadingStats(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <main>
      <section
        className="relative min-h-[420px] sm:min-h-[520px] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1570742544137-3a469196c32b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODd8MHwxfHNlYXJjaHw0fHxNYWRhZ2FzY2FyJTIwbGFuZHNjYXBlJTIwYmFvYmFiJTIwYXZlbnVlJTIwc3Vuc2V0fGVufDB8fHx8MTc3MDE0NDQzMnww&ixlib=rb-4.1.0&q=85)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-primary/70" aria-hidden />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-md leading-tight">
            {t('homeHeroTitle')}
          </h1>
          <p className="text-white/90 max-w-2xl mx-auto mb-10 drop-shadow text-sm sm:text-base">
            {t('homeHeroSubtitle')}
            <span className="block mt-2 text-white/80">{t('homeHeroDesc2')}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('register')}
              className="btn-accent text-base px-6 py-3.5 shadow-card border-0"
            >
              {t('homeCtaRegister')}
              <ArrowRight className="w-4 h-4" aria-hidden />
            </button>
            <button
              onClick={() => onNavigate('directory')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-semibold border-2 border-white text-white hover:bg-white/20 transition-all duration-200 active:scale-[0.98]"
            >
              {t('homeCtaDirectory')}
              <ArrowRight className="w-4 h-4" aria-hidden />
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white border-y border-primary/10 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="section-title">{t('homeSectionCommunity')}</h2>
          <p className="section-subtitle">{t('homeSectionCommunitySub')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="card-hover text-center py-6 px-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
                <Users className="w-7 h-7" aria-hidden />
              </div>
              <p className="text-4xl font-bold text-accent mb-2">
                {loadingStats ? '…' : stats.totalMembers}
              </p>
              <h3 className="text-lg font-semibold text-primary mb-1">{t('homeStatMembers')}</h3>
              <p className="text-sm text-primary/60 mb-1">{t('homeStatMembersSub')}</p>
              <p className="text-sm text-primary/70">{t('homeStatMembersDesc')}</p>
            </div>
            <div className="card-hover text-center py-6 px-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
                <ShieldCheck className="w-7 h-7" aria-hidden />
              </div>
              <p className="text-4xl font-bold text-accent mb-2">CIN</p>
              <h3 className="text-lg font-semibold text-primary mb-1">{t('homeStatCin')}</h3>
              <p className="text-sm text-primary/60 mb-1">{t('homeStatCinSub')}</p>
              <p className="text-sm text-primary/70">{t('homeStatCinDesc')}</p>
            </div>
            <div className="card-hover text-center py-6 px-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
                <GraduationCap className="w-7 h-7" aria-hidden />
              </div>
              <p className="text-4xl font-bold text-accent mb-2">
                {loadingStats ? '…' : stats.teachesCount}
              </p>
              <h3 className="text-lg font-semibold text-primary mb-1">{t('homeStatTeachers')}</h3>
              <p className="text-sm text-primary/60 mb-1">{t('homeStatTeachersSub')}</p>
              <p className="text-sm text-primary/70">{t('homeStatTeachersDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="section-title">{t('homeWhyTitle')}</h2>
        <p className="section-subtitle">{t('homeWhySub')}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <article className="card-hover p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
              <Lock className="w-6 h-6" aria-hidden />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">{t('homeWhy1Title')}</h3>
            <p className="text-sm text-primary/70 mb-2">{t('homeWhy1Desc')}</p>
          </article>
          <article className="card-hover p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
              <Globe className="w-6 h-6" aria-hidden />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">{t('homeWhy2Title')}</h3>
            <p className="text-sm text-primary/70 mb-2">{t('homeWhy2Desc')}</p>
          </article>
          <article className="card-hover p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
              <UsersRound className="w-6 h-6" aria-hidden />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">{t('homeWhy3Title')}</h3>
            <p className="text-sm text-primary/70 mb-2">{t('homeWhy3Desc')}</p>
          </article>
        </div>

        <div className="mt-12 rounded-2xl overflow-hidden shadow-card border border-primary/10">
          <img
            src="https://images.unsplash.com/photo-1570742544137-3a469196c32b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODd8MHwxfHNlYXJjaHw0fHxNYWRhZ2FzY2FyJTIwbGFuZHNjYXBlJTIwYmFvYmFiJTIwYXZlbnVlJTIwc3Vuc2V0fGVufDB8fHx8MTc3MDE0NDQzMnww&ixlib=rb-4.1.0&q=85"
            alt={t('homeHeroImageAlt')}
            className="w-full h-auto object-cover max-h-[380px] sm:max-h-[420px]"
          />
        </div>
      </section>

      <section className="bg-primary/5 border-t border-primary/10 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="section-title">{t('homeCtaFinalTitle')}</h2>
          <p className="text-primary/70 mb-8">{t('homeCtaFinalSub')}</p>
          <button
            onClick={() => onNavigate('register')}
            className="btn-accent text-base px-6 py-3.5"
          >
            {t('homeCtaFinalBtn')}
            <ArrowRight className="w-4 h-4" aria-hidden />
          </button>
        </div>
      </section>
    </main>
  );
}
