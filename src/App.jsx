import { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Directory } from './pages/Directory';
import { MemberSpace } from './pages/MemberSpace';
import { Admin } from './pages/Admin';

function AppContent() {
  const [page, setPage] = useState('home');
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg"
      >
        {t('skipLink')}
      </a>
      <Navbar currentPage={page} onNavigate={setPage} />
      <div id="main-content" className="flex-1" tabIndex={-1}>
        {page === 'home' && <Home onNavigate={setPage} />}
        {page === 'register' && <Register onNavigate={setPage} />}
        {page === 'directory' && <Directory />}
        {page === 'member' && <MemberSpace onNavigate={setPage} />}
        {page === 'admin' && <Admin onLogout={() => setPage('home')} />}
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
