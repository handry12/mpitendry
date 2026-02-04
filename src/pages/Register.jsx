import { useState } from 'react';
import { Lock, AlertTriangle, ChevronRight, ChevronLeft, Upload } from 'lucide-react';
import { createMember } from '../lib/api';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

const STEP_KEYS = ['regStep1', 'regStep2', 'regStep3'];

const initialForm = {
  photo: null,
  lastName: '',
  firstNames: '',
  dateOfBirth: '',
  phone: '',
  city: '',
  cinNumber: '',
  cinDateOfIssue: '',
  cinPlaceOfIssue: '',
  duplicataDate: '',
  duplicataPlace: '',
  instruments: '',
  yearsOfExperience: '',
  teaches: false,
  diplomas: '',
  collaborations: '',
};

export function Register({ onNavigate }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const { t } = useLanguage();

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const canNext1 = form.lastName.trim() && form.firstNames.trim() && form.dateOfBirth;
  const canNext2 = form.cinNumber.trim() && form.cinDateOfIssue && form.cinPlaceOfIssue.trim();
  const canNext3 = form.instruments.trim() && form.yearsOfExperience !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        teaches: Boolean(form.teaches),
        yearsOfExperience: String(form.yearsOfExperience),
      };
      delete payload.photo;
      const { id } = await createMember(payload);
      try {
        sessionStorage.setItem('mpitendry_last_member_id', String(id));
      } catch (_) {}
      addToast(t('regToastSuccess').replace(/\{id\}/g, String(id)), 'success');
      setForm(initialForm);
      setStep(1);
      if (onNavigate) onNavigate('member');
    } catch (err) {
      addToast(err.message || t('regToastError'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <header className="page-header">
        <h1 className="page-title">{t('regTitle')}</h1>
        <p className="page-description">{t('regDesc')}</p>
      </header>

      <div className="mb-8">
        <div className="flex gap-2 mb-3">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2.5 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-accent' : 'bg-primary/20'
              }`}
              aria-hidden
            />
          ))}
        </div>
        <div className="flex justify-between text-xs sm:text-sm text-primary/70">
          <span className={step >= 1 ? 'font-medium text-primary' : ''}>1. {t(STEP_KEYS[0])}</span>
          <span className={step >= 2 ? 'font-medium text-primary' : ''}>2. {t(STEP_KEYS[1])}</span>
          <span className={step >= 3 ? 'font-medium text-primary' : ''}>3. {t(STEP_KEYS[2])}</span>
        </div>
      </div>

      <div className="card shadow-card">
        <p className="text-sm font-semibold text-primary mb-6 flex items-center gap-2">
          {t('regStepLabel')} {step}: {t(STEP_KEYS[step - 1])}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">{t('regPhotoLabel')}</label>
                <div className="border-2 border-dashed border-accent/40 rounded-xl p-6 text-center text-primary/70 bg-primary/5 hover:border-accent/60 hover:bg-primary/10 transition-colors duration-200 cursor-default">
                  <Upload className="w-10 h-10 mx-auto mb-2 text-accent" aria-hidden />
                  <span className="text-sm">{t('regPhotoUpload')}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">{t('regLastNameLabel')}</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => update('lastName', e.target.value)}
                  className="input-base"
                  placeholder={t('regLastNamePlaceholder')}
                  maxLength={100}
                  required
                />
                <span className="text-xs text-primary/60 mt-0.5 block">{t('regLastNameHint')}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">{t('regFirstNamesLabel')}</label>
                <input
                  type="text"
                  value={form.firstNames}
                  onChange={(e) => update('firstNames', e.target.value)}
                  className="input-base"
                  placeholder={t('regFirstNamesPlaceholder')}
                  maxLength={200}
                  required
                />
                <span className="text-xs text-primary/60 mt-0.5 block">{t('regFirstNamesHint')}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">{t('regDobLabel')}</label>
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => update('dateOfBirth', e.target.value)}
                  className="input-base"
                  required
                />
                <span className="text-xs text-primary/60 mt-0.5 block">{t('regDobHint')}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">{t('regPhoneLabel')}</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  className="input-base"
                  placeholder={t('regPhonePlaceholder')}
                  maxLength={30}
                />
                <span className="text-xs text-primary/60 mt-0.5 block">{t('regPhoneHint')}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">{t('regCityLabel')}</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => update('city', e.target.value)}
                  className="input-base"
                  placeholder={t('regCityPlaceholder')}
                  maxLength={100}
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800">
                <Lock className="w-5 h-5 shrink-0 mt-0.5" aria-hidden />
                <div>
                  <p className="font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" aria-hidden />
                    {t('regConfidentialTitle')}
                  </p>
                  <p className="text-sm mt-1">{t('regConfidentialDesc')}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">{t('regCinLabel')}</label>
                <input
                  type="text"
                  value={form.cinNumber}
                  onChange={(e) => update('cinNumber', e.target.value)}
                  className="input-base"
                  placeholder={t('regCinPlaceholder')}
                  maxLength={30}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">{t('regCinDateLabel')}</label>
                <input
                  type="date"
                  value={form.cinDateOfIssue}
                  onChange={(e) => update('cinDateOfIssue', e.target.value)}
                  className="input-base"
                  required
                />
                <span className="text-xs text-primary/60 mt-0.5 block">{t('regCinDateHint')}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">{t('regCinPlaceLabel')}</label>
                <input
                  type="text"
                  value={form.cinPlaceOfIssue}
                  onChange={(e) => update('cinPlaceOfIssue', e.target.value)}
                  className="input-base"
                  placeholder={t('regCinPlacePlaceholder')}
                  maxLength={100}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">{t('regDuplicataDateLabel')}</label>
                <input
                  type="date"
                  value={form.duplicataDate}
                  onChange={(e) => update('duplicataDate', e.target.value)}
                  className="input-base"
                />
                <span className="text-xs text-primary/60 mt-0.5 block">{t('regDuplicataDateHint')}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">{t('regDuplicataPlaceLabel')}</label>
                <input
                  type="text"
                  value={form.duplicataPlace}
                  onChange={(e) => update('duplicataPlace', e.target.value)}
                  className="input-base"
                  placeholder={t('regDuplicataPlacePlaceholder')}
                  maxLength={100}
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">{t('regInstrumentsLabel')}</label>
                <input
                  type="text"
                  value={form.instruments}
                  onChange={(e) => update('instruments', e.target.value)}
                  className="input-base"
                  placeholder={t('regInstrumentsPlaceholder')}
                  maxLength={300}
                  required
                />
                <span className="text-xs text-primary/60 mt-0.5 block">{t('regInstrumentsHint')}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">{t('regExperienceLabel')}</label>
                <input
                  type="text"
                  value={form.yearsOfExperience}
                  onChange={(e) => update('yearsOfExperience', e.target.value)}
                  className="input-base"
                  placeholder={t('regExperiencePlaceholder')}
                  maxLength={80}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">{t('regTeachesLabel')}</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={form.teaches}
                    onClick={() => update('teaches', !form.teaches)}
                    className={`relative inline-flex h-9 w-16 rounded-full transition-colors duration-200 ${
                      form.teaches ? 'bg-accent' : 'bg-primary/30'
                    }`}
                  >
                    <span
                      className={`inline-block h-7 w-7 rounded-full bg-white shadow-soft transform transition-transform duration-200 mt-1 ${
                        form.teaches ? 'translate-x-8' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-sm font-medium text-primary">
                    {form.teaches ? t('dirTeachesYes') : t('dirTeachesNo')}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">{t('regDiplomasLabel')}</label>
                <textarea
                  value={form.diplomas}
                  onChange={(e) => update('diplomas', e.target.value)}
                  className="input-base"
                  rows={3}
                  maxLength={500}
                  placeholder={t('regDiplomasPlaceholder')}
                />
                <span className="text-xs text-primary/60 mt-0.5 block">{t('regDiplomasHint')}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">{t('regCollaborationsLabel')}</label>
                <textarea
                  value={form.collaborations}
                  onChange={(e) => update('collaborations', e.target.value)}
                  className="input-base"
                  rows={3}
                  maxLength={1000}
                  placeholder={t('regCollaborationsPlaceholder')}
                />
                <span className="text-xs text-primary/60 mt-0.5 block">{t('regCollaborationsHint')}</span>
              </div>
            </>
          )}

          <div className="flex flex-wrap gap-3 pt-6 border-t border-primary/10">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="btn-outline"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden /> {t('regBack')}
              </button>
            ) : (
              <span />
            )}
            <div className="flex-1 min-w-[1rem]" />
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={
                  (step === 1 && !canNext1) || (step === 2 && !canNext2) || (step === 3 && !canNext3)
                }
                className="btn-accent"
              >
                {t('regNext')} <ChevronRight className="w-4 h-4" aria-hidden />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? t('regSubmitting') : t('regSubmit')}
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
