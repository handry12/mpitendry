import { useState } from 'react';
import { Link2, Home, UserPlus, Users, Shield, Menu, X, UserCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const navItems = [
  { id: 'home', key: 'navHome', icon: Home },
  { id: 'register', key: 'navRegister', icon: UserPlus },
  { id: 'directory', key: 'navDirectory', icon: Users },
  { id: 'member', key: 'navMemberSpace', icon: UserCircle },
  { id: 'admin', key: 'navAdminSpace', icon: Shield },
];

export function Navbar({ currentPage, onNavigate }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const goTo = (id) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-primary text-white shadow-nav transition-shadow duration-250">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <button
            onClick={() => goTo('home')}
            className="flex items-center gap-2 font-bold text-lg tracking-widest text-accent hover:text-white transition-colors duration-200 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label={t('logoAlt')}
          >
            <img
              src="/logo.png"
              alt=""
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-contain shrink-0 bg-[rgb(250,249,242)] border-2 border-accent/50"
              aria-hidden
            />
            <span className="hidden sm:inline">{t('navBrand')}</span>
            <Link2 className="w-5 h-5 text-accent hidden md:block" aria-hidden />
          </button>

          <div className="flex items-center gap-2">
            {/* Sélecteur de langue */}
            <span className="sr-only">{t('navLangSrOnly')}</span>
            <div className="flex rounded-lg overflow-hidden border border-white/30">
              <button
                type="button"
                onClick={() => setLanguage('mg')}
                className={`px-2.5 py-1.5 text-xs font-semibold transition-colors ${language === 'mg' ? 'bg-accent text-primary' : 'bg-white/10 text-white hover:bg-white/20'}`}
                aria-pressed={language === 'mg'}
                title={t('navLangMalagasy')}
              >
                MG
              </button>
              <button
                type="button"
                onClick={() => setLanguage('fr')}
                className={`px-2.5 py-1.5 text-xs font-semibold transition-colors ${language === 'fr' ? 'bg-accent text-primary' : 'bg-white/10 text-white hover:bg-white/20'}`}
                aria-pressed={language === 'fr'}
                title={t('navLangFrench')}
              >
                FR
              </button>
            </div>

            {/* Desktop nav */}
            <ul className="hidden md:flex items-center gap-1">
              {navItems.map(({ id, key, icon }) => {
                const IconItem = icon;
                return (
                  <li key={id}>
                    <button
                      onClick={() => goTo(id)}
                      className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentPage === id
                          ? 'bg-accent/25 text-accent shadow-soft'
                          : 'text-white/90 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <IconItem className="w-4 h-4" aria-hidden />
                      <span>{t(key)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-white hover:bg-white/10 transition-colors"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? t('closeMenu') : t('openMenu')}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          className="md:hidden border-t border-white/20 bg-primary animate-fade-in"
          role="dialog"
          aria-label={t('navMenuAria')}
        >
          <div className="max-w-6xl mx-auto px-4 py-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setLanguage('mg')}
              className={`px-3 py-1.5 text-sm font-medium rounded ${language === 'mg' ? 'bg-accent text-primary' : 'text-white/90'}`}
            >
              MG
            </button>
            <button
              type="button"
              onClick={() => setLanguage('fr')}
              className={`px-3 py-1.5 text-sm font-medium rounded ${language === 'fr' ? 'bg-accent text-primary' : 'text-white/90'}`}
            >
              FR
            </button>
          </div>
          <ul className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
            {navItems.map(({ id, key, icon }) => {
              const IconItem = icon;
              return (
                <li key={id}>
                  <button
                    onClick={() => goTo(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-medium transition-colors ${
                      currentPage === id
                        ? 'bg-accent/25 text-accent'
                        : 'text-white/90 hover:bg-white/10'
                    }`}
                  >
                    <IconItem className="w-5 h-5 shrink-0" aria-hidden />
                    <span>{t(key)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}
