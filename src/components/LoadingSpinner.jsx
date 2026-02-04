import { useLanguage } from '../context/LanguageContext';

export function LoadingSpinner({ label }) {
  const { t } = useLanguage();
  const displayLabel = label ?? t('loading');
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-primary/70" role="status" aria-live="polite">
      <div className="w-12 h-12 border-2 border-accent/30 border-t-accent rounded-full animate-spin mb-5" aria-hidden />
      <p className="text-sm font-medium text-primary/80">{displayLabel}</p>
    </div>
  );
}
