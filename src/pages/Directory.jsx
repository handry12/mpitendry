import { useState, useEffect, useCallback, useMemo } from 'react';
import { getMembers } from '../lib/api';
import { Search, ShieldCheck, Music, Award, Users, UsersRound, Phone, MapPin, Filter, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';

// Extrait le premier nombre d'années du champ expérience (ex. "25 ans d'expérience" → 25, "18" → 18)
function parseYearsOfExperience(str) {
  if (!str || typeof str !== 'string') return null;
  const match = str.trim().match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

export function Directory() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [disciplineFilter, setDisciplineFilter] = useState('');
  const [teachesFilter, setTeachesFilter] = useState('all'); // 'all' | 'yes' | 'no'
  const [experienceMin, setExperienceMin] = useState(''); // "10" = plus de 10 ans
  const { addToast } = useToast();
  const { t } = useLanguage();

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getMembers();
      setMembers(list);
    } catch (err) {
      setMembers([]);
      setError(err.message);
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const uniqueCities = useMemo(() => {
    const cities = [...new Set(members.map((m) => m.city).filter(Boolean))];
    return cities.sort((a, b) => String(a).localeCompare(String(b)));
  }, [members]);

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const q = search.trim().toLowerCase();
      if (q) {
        const name = `${(m.lastName || '')} ${(m.firstNames || '')}`.toLowerCase();
        const instruments = (m.instruments || '').toLowerCase();
        const city = (m.city || '').toLowerCase();
        if (!name.includes(q) && !instruments.includes(q) && !city.includes(q)) return false;
      }
      if (cityFilter && (m.city || '') !== cityFilter) return false;
      const disc = disciplineFilter.trim().toLowerCase();
      if (disc && !(m.instruments || '').toLowerCase().includes(disc)) return false;
      if (teachesFilter === 'yes' && !m.teaches) return false;
      if (teachesFilter === 'no' && m.teaches) return false;
      const minYears = experienceMin.trim() === '' ? null : parseInt(experienceMin.trim(), 10);
      if (minYears != null && !Number.isNaN(minYears)) {
        const years = parseYearsOfExperience(m.yearsOfExperience);
        if (years == null || years < minYears) return false;
      }
      return true;
    });
  }, [members, search, cityFilter, disciplineFilter, teachesFilter, experienceMin]);

  const hasActiveFilters = cityFilter || disciplineFilter.trim() || teachesFilter !== 'all' || experienceMin.trim() !== '';

  const clearFilters = () => {
    setCityFilter('');
    setDisciplineFilter('');
    setTeachesFilter('all');
    setExperienceMin('');
    setSearch('');
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <header className="page-header">
        <h1 className="page-title">{t('dirTitle')}</h1>
        <p className="page-description mb-2">{t('dirSubtitle')}</p>
        <p className="text-sm text-primary/70">{t('dirIntro')}</p>
      </header>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 sm:mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50 pointer-events-none" aria-hidden />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('dirSearchPlaceholder')}
            className="input-base pl-10"
            aria-label={t('dirAriaSearch')}
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm font-medium shrink-0">
          <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden />
          <span>{t('dirCinBadge')}</span>
        </div>
      </div>

      {/* Filtres */}
      {!loading && !error && members.length > 0 && (
        <div className="card mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-accent shrink-0" aria-hidden />
            <span className="text-sm font-semibold text-primary">{t('dirFilters')}</span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="ml-auto inline-flex items-center gap-1 text-xs text-accent font-medium hover:underline"
              >
                <X className="w-3.5 h-3.5" aria-hidden />
                {t('clearFilters')}
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="filter-city" className="block text-xs font-medium text-primary/80 mb-1">
                {t('dirFilterCity')}
              </label>
              <select
                id="filter-city"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="input-base py-2"
                aria-label={t('dirAriaFilterCity')}
              >
                <option value="">{t('dirFilterCityAll')}</option>
                {uniqueCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="filter-discipline" className="block text-xs font-medium text-primary/80 mb-1">
                {t('dirFilterDiscipline')}
              </label>
              <input
                id="filter-discipline"
                type="text"
                value={disciplineFilter}
                onChange={(e) => setDisciplineFilter(e.target.value)}
                className="input-base py-2"
                placeholder={t('dirFilterDisciplinePlaceholder')}
                aria-label={t('dirAriaFilterDiscipline')}
              />
            </div>
            <div>
              <label htmlFor="filter-teaches" className="block text-xs font-medium text-primary/80 mb-1">
                {t('dirFilterTeaches')}
              </label>
              <select
                id="filter-teaches"
                value={teachesFilter}
                onChange={(e) => setTeachesFilter(e.target.value)}
                className="input-base py-2"
                aria-label={t('dirAriaFilterTeaches')}
              >
                <option value="all">{t('dirFilterTeachesAll')}</option>
                <option value="yes">{t('dirFilterTeachesYes')}</option>
                <option value="no">{t('dirFilterTeachesNo')}</option>
              </select>
            </div>
            <div>
              <label htmlFor="filter-experience" className="block text-xs font-medium text-primary/80 mb-1">
                {t('dirFilterExperience')}
              </label>
              <input
                id="filter-experience"
                type="number"
                min={0}
                max={99}
                value={experienceMin}
                onChange={(e) => setExperienceMin(e.target.value)}
                className="input-base py-2"
                placeholder={t('dirExperiencePlaceholder')}
                aria-label={t('dirFilterExperienceHint')}
              />
              <span className="text-xs text-primary/60 mt-0.5 block">{t('dirFilterExperienceHint')}</span>
            </div>
          </div>
          <p className="text-xs text-primary/60 mt-2">
            {filtered.length} {t('dirResultCount')} — {members.length} {t('dirTotal')}
          </p>
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <EmptyState
          title={t('errorTitle')}
          description={
            <span>
              {error}
              <span className="block mt-2 text-sm text-primary/70">
                {t('dirErrorHint')} — <code className="bg-primary/10 px-1 rounded">npm run server</code>
              </span>
            </span>
          }
          action={
            <button type="button" onClick={fetchMembers} className="btn-accent mt-4">
              {t('retry')}
            </button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={t('dirNoResults')}
          description={
            members.length === 0 ? t('dirEmptyDbLong') : t('dirNoResultsDesc')
          }
          action={
            members.length > 0 ? (
              <button type="button" onClick={clearFilters} className="btn-outline mt-4">
                {t('clearSearchAndFilters')}
              </button>
            ) : (
              <button type="button" onClick={fetchMembers} className="btn-outline mt-4">
                {t('retry')}
              </button>
            )
          }
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {filtered.map((m) => (
            <li key={m.id} className="card-hover">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <UsersRound className="w-6 h-6 text-primary/60" aria-hidden />
                  </div>
                  <h2 className="font-semibold text-primary text-lg truncate">
                    {m.lastName} {m.firstNames}
                  </h2>
                </div>
                <span className="badge-success shrink-0">
                  <ShieldCheck className="w-3 h-3" aria-hidden />
                  {t('dirCinVerified')}
                </span>
              </div>
              <dl className="space-y-2 text-sm text-primary/80">
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
                {(m.phone || m.city) && (
                  <>
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
                  </>
                )}
              </dl>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
