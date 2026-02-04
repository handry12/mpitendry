import { Music, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-auto border-t border-primary/10 bg-primary/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-primary/80">
            <Music className="w-6 h-6 text-accent shrink-0" aria-hidden />
            <span className="font-semibold">{t('footerBrand')}</span>
          </div>
          <p className="text-sm text-primary/60 text-center sm:text-right max-w-md">
            {t('footerTagline')}
          </p>
        </div>
        <div className="mt-4 pt-4 border-t border-primary/10 flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2 text-sm text-primary/70">
          <span className="font-medium text-primary/80">{t('footerContact')}</span>
          <a
            href="tel:+261342047334"
            className="inline-flex items-center gap-2 text-accent hover:text-primary font-medium transition-colors"
          >
            <Phone className="w-4 h-4" aria-hidden />
            Hasina — +261 34 20 473 34
          </a>
        </div>
        <p className="text-xs text-primary/50 mt-4 text-center sm:text-left">
          {t('footerBilingual')}
        </p>
        <p className="text-xs text-primary/50 mt-3 text-center">
          <a
            href="https://www.eproject.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary/60 hover:text-accent hover:underline transition-colors"
          >
            {t('footerBy')}
          </a>
        </p>
      </div>
    </footer>
  );
}
