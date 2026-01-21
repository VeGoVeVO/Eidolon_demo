import { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import AnimatedBackground from '../components/AnimatedBackground';
import { useLanguage } from '../i18n/LanguageContext';

const Browse = ({ user, onLogout }) => {
  const { t } = useLanguage();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Keep background in sync with current theme
  useEffect(() => {
    const updateDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    updateDarkMode();
    const observer = new MutationObserver(updateDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground isDarkMode={isDarkMode} />
      <div className="relative z-10">
        <Navigation user={user} onLogout={onLogout} />
        <div className="max-w-6xl mx-auto px-4 py-10" aria-label={t('browse')}>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{t('browse')}</h1>
        </div>
      </div>
    </div>
  );
};

export default Browse;
