import { useState, useEffect } from 'react';
import { getMemberById } from '../lib/api';
import { ShieldCheck, Music, Award, Users, Phone, MapPin, UsersRound, LogIn } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';

function MemberCard({ m }) {
  const { t } = useLanguage();
  return (
    <article className="card shadow-card max-w-lg mx-auto">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <UsersRound className="w-7 h-7 text-primary/60" aria-hidden />
          </div>
          <div>
            <h2 className="font-semibold text-primary text-xl">
              {m.lastName} {m.firstNames}
            </h2>
            <p className="text-sm text-primary/60">{t('memberAdherentNumber')} {m.id}</p>
          </div>
        </div>
        <span className="badge-success shrink-0">
          <ShieldCheck className="w-3 h-3" aria-hidden />
          {t('memberCinVerified')}
        </span>
      </div>
      <dl className="space-y-2.5 text-sm text-primary/80">
        <div className="flex items-start gap-2">
          <Music className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden />
          <div>
            <span className="font-medium text-primary/90">{t('dirInstruments')}</span>
            <span className="ml-1">{m.instruments || '—'}</span>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Award className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden />
          <div>
            <span className="font-medium text-primary/90">{t('dirExperience')}</span>
            <span className="ml-1">{m.yearsOfExperience ?? '—'}</span>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Users className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden />
          <div>
            <span className="font-medium text-primary/90">{t('dirTeaches')}</span>
            <span className="ml-1">{m.teaches ? t('dirTeachesYes') : t('dirTeachesNo')}</span>
          </div>
        </div>
        {m.phone && (
          <div className="flex items-start gap-2">
            <Phone className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden />
            <div>
              <span className="font-medium text-primary/90">{t('dirPhone')}</span>
              <span className="ml-1">
                <a href={`tel:${m.phone.replace(/\s/g, '')}`} className="text-accent hover:underline">
                  {m.phone}
                </a>
              </span>
            </div>
          </div>
        )}
        {m.city && (
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden />
            <div>
              <span className="font-medium text-primary/90">{t('dirCity')}</span>
              <span className="ml-1">{m.city}</span>
            </div>
          </div>
        )}
      </dl>
    </article>
  );
}

const STORED_ID_KEY = 'mpitendry_last_member_id';

export function MemberSpace({ onNavigate }) {
  const [memberId, setMemberId] = useState(() => {
    try {
      return sessionStorage.getItem(STORED_ID_KEY) || '';
    } catch {
      return '';
    }
  });
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToast } = useToast();
  const { t } = useLanguage();

  // Après inscription : charger automatiquement la fiche si un ID est en session
  useEffect(() => {
    let cancelled = false;
    const stored = memberId.trim();
    if (!stored) return;
    const id = Number(stored);
    if (!Number.isInteger(id) || id < 1) return;
    setLoading(true);
    getMemberById(id)
      .then((data) => {
        if (!cancelled) setMember(data);
        try {
          sessionStorage.removeItem(STORED_ID_KEY);
        } catch (_) {}
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          addToast(err.message, 'error');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- exécution une seule fois au montage si ID en session
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = memberId.trim();
    if (!id) return;
    setLoading(true);
    setError(null);
    setMember(null);
    try {
      const data = await getMemberById(Number(id));
      setMember(data);
    } catch (err) {
      setError(err.message);
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <header className="page-header">
        <h1 className="page-title">{t('memberTitle')}</h1>
        <p className="page-description">{t('memberDesc')}</p>
      </header>

      <div className="card shadow-card mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="member-id" className="block text-sm font-medium text-primary mb-1">
              {t('memberIdLabel')}
            </label>
            <input
              id="member-id"
              type="text"
              inputMode="numeric"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="input-base"
              placeholder={t('memberIdPlaceholder')}
              aria-describedby="member-id-hint"
            />
            <p id="member-id-hint" className="text-xs text-primary/60 mt-1">
              {t('memberIdHintFull')}
            </p>
          </div>
          <button type="submit" disabled={loading || !memberId.trim()} className="btn-accent w-full sm:w-auto">
            <LogIn className="w-4 h-4" aria-hidden />
            {loading ? t('loading') : t('memberViewBtn')}
          </button>
        </form>
      </div>

      {loading && <LoadingSpinner label={t('memberLoadingLabel')} />}

      {error && !loading && (
        <EmptyState
          title={t('memberNotFound')}
          description={error}
          action={
            <button type="button" onClick={() => onNavigate('register')} className="btn-outline mt-4">
              {t('memberRegisterBtn')}
            </button>
          }
        />
      )}

      {member && !loading && <MemberCard m={member} />}

      {!member && !loading && !error && (
        <p className="text-center text-primary/60 text-sm">
          {t('memberNotRegistered')}{' '}
          <button
            type="button"
            onClick={() => onNavigate('register')}
            className="text-accent font-medium hover:underline"
          >
            {t('memberRegisterBtn')}
          </button>
        </p>
      )}
    </main>
  );
}
