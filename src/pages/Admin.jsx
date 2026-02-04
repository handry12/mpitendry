import { useState, useEffect, useCallback } from 'react';
import { Shield, LogOut, Trash2, Lock, AlertCircle, RotateCcw } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import {
  getAdminToken,
  setAdminToken,
  adminLogin,
  getAdminMembers,
  deleteMember,
  seedDemo,
} from '../lib/api';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

function AdminLogin({ onSuccess }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { addToast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const token = await adminLogin(password);
      setAdminToken(token);
      addToast(t('adminLoginSuccess'), 'success');
      onSuccess();
    } catch (err) {
      setError(err.message || t('adminLoginError'));
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white rounded-2xl border border-primary/15 shadow-card p-8 animate-fade-in">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-xl bg-primary/10">
            <Shield className="w-10 h-10 text-primary" aria-hidden />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary">{t('adminTitle')}</h1>
            <p className="text-sm text-primary/70 mt-0.5">{t('adminSubtitle')}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-primary mb-1">
              {t('adminPasswordLabel')}
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-base"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>
          {error && (
            <p className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200" role="alert">
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden />
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3"
          >
            <Lock className="w-4 h-4" aria-hidden />
            {loading ? t('adminWaiting') : t('adminLoginBtn')}
          </button>
        </form>
      </div>
    </main>
  );
}

function AdminDashboard({ onLogout, onSessionExpired }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const { addToast } = useToast();
  const { t } = useLanguage();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getAdminMembers();
      setMembers(list);
    } catch (err) {
      addToast(err.message, 'error');
      if (err.message === 'Non autorisé') onSessionExpired?.();
    } finally {
      setLoading(false);
    }
  }, [addToast, onSessionExpired]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id) => {
    setConfirmId(id);
  };

  const confirmDelete = async (id) => {
    setConfirmId(null);
    setDeletingId(id);
    try {
      await deleteMember(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
      addToast('Nofafana soa aman-tsara. (Suppression réussie.)', 'success');
    } catch (err) {
      addToast(err.message, 'error');
      if (err.message === 'Non autorisé') onSessionExpired?.();
    } finally {
      setDeletingId(null);
    }
  };

  const cancelDelete = () => setConfirmId(null);

  const handleLogout = () => {
    setAdminToken(null);
    addToast(t('adminLogoutToast'), 'info');
    onLogout();
  };

  const handleSeedDemo = async () => {
    setSeeding(true);
    try {
      await seedDemo();
      await load();
      addToast(t('adminSeedSuccess'), 'success');
    } catch (err) {
      addToast(err.message, 'error');
      if (err.message === 'Non autorisé') onSessionExpired?.();
    } finally {
      setSeeding(false);
    }
  };

  const columns = [
    { key: 'id', labelKey: 'adminColId', className: 'w-12' },
    { key: 'lastName', labelKey: 'adminColLastName' },
    { key: 'firstNames', labelKey: 'adminColFirstNames' },
    { key: 'dateOfBirth', labelKey: 'adminColDob' },
    { key: 'cinNumber', labelKey: 'adminColCin', className: 'font-mono text-sm' },
    { key: 'instruments', labelKey: 'adminColInstruments' },
    { key: 'yearsOfExperience', labelKey: 'adminColExperience' },
    { key: 'teaches', labelKey: 'adminColTeaches' },
    { key: 'phone', labelKey: 'adminColPhone', className: 'font-mono text-xs' },
    { key: 'city', labelKey: 'adminColCity' },
    { key: 'actions', labelKey: '', className: 'w-20' },
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="page-title">{t('adminDashboardTitleFull')}</h1>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSeedDemo}
            disabled={seeding}
            className="btn-outline text-sm"
            title={t('adminSeedDemoTitle')}
          >
            <RotateCcw className="w-4 h-4" aria-hidden />
            {t('adminSeedDemo')}
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="btn-primary text-sm"
          >
            <LogOut className="w-4 h-4" aria-hidden />
            {t('adminLogout')}
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : members.length === 0 ? (
        <EmptyState
          title={t('adminNoMembers')}
          action={
            <button
              type="button"
              onClick={handleSeedDemo}
              disabled={seeding}
              className="btn-accent"
            >
              <RotateCcw className="w-4 h-4" aria-hidden />
              {t('adminLoadDemo')}
            </button>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-primary/15 bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-primary/20 bg-primary/5">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3.5 font-semibold text-primary ${col.className || ''}`}
                  >
                    {col.labelKey ? t(col.labelKey) : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => (
                <tr
                  key={m.id}
                  className={`border-b border-primary/10 transition-colors duration-150 ${
                    i % 2 === 1 ? 'bg-primary/[0.02]' : ''
                  } hover:bg-primary/5`}
                >
                  <td className="px-4 py-3">{m.id}</td>
                  <td className="px-4 py-3 font-medium">{m.lastName}</td>
                  <td className="px-4 py-3">{m.firstNames}</td>
                  <td className="px-4 py-3">{m.dateOfBirth}</td>
                  <td className="px-4 py-3 font-mono text-xs">{m.cinNumber}</td>
                  <td className="px-4 py-3 max-w-[180px] truncate" title={m.instruments}>{m.instruments}</td>
                  <td className="px-4 py-3">{m.yearsOfExperience}</td>
                  <td className="px-4 py-3">{m.teaches ? t('adminTeachesEny') : t('adminTeachesTsia')}</td>
                  <td className="px-4 py-3 font-mono text-xs">{m.phone ?? '—'}</td>
                  <td className="px-4 py-3">{m.city ?? '—'}</td>
                  <td className="px-4 py-3">
                    {confirmId === m.id ? (
                      <span className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => confirmDelete(m.id)}
                          disabled={deletingId === m.id}
                          className="text-xs px-2.5 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
                        >
                          {t('adminDeleteConfirmYes')}
                        </button>
                        <button
                          type="button"
                          onClick={cancelDelete}
                          className="text-xs px-2.5 py-1.5 rounded-lg border border-primary/30 text-primary hover:bg-primary/5 font-medium"
                        >
                          {t('adminDeleteConfirmNo')}
                        </button>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleDelete(m.id)}
                        disabled={deletingId !== null}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
                        title={t('adminDeleteTitle')}
                        aria-label={t('adminDeleteAria').replace(/\{name\}/g, `${m.lastName} ${m.firstNames}`)}
                      >
                        <Trash2 className="w-4 h-4" aria-hidden />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-6 text-sm text-primary/60 bg-primary/5 px-4 py-3 rounded-xl border border-primary/10">
        {t('adminDataNotice')}
      </p>
    </main>
  );
}

export function Admin({ onLogout }) {
  const [token, setToken] = useState(() => getAdminToken());

  const handleLoginSuccess = () => setToken(getAdminToken());
  const handleLogout = () => {
    setAdminToken(null);
    setToken(null);
    onLogout?.();
  };

  if (!token) {
    return <AdminLogin onSuccess={handleLoginSuccess} />;
  }

  return (
    <AdminDashboard
      onLogout={handleLogout}
      onSessionExpired={() => setToken(null)}
    />
  );
}
