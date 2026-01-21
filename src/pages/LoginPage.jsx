import { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import AnimatedBackground from '../components/AnimatedBackground';
import { SAMPLE_USER } from '../utils/demoData';
import { seedDemoData } from '../utils/demoStorage';

function LoginPage({ onLoginSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { t } = useLanguage();

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const handleDemoLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      seedDemoData();
      onLoginSuccess({ ...SAMPLE_USER });
    } catch (err) {
      console.error('Login error:', err);
      setError(t('authenticationFailed'));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      <AnimatedBackground isDarkMode={isDarkMode} />
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white dark:bg-neutral-800 bg-opacity-95 dark:bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-neutral-700">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Eidolon</h1>
            <p className="text-gray-600 dark:text-gray-300">{t('buildYourPerfectOutfit')}</p>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('getStarted')}</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {t('signInWithGoogle')}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full max-w-xs flex items-center justify-center gap-3 px-6 py-3 rounded-xl border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-100 font-semibold shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 533.5 544.3" aria-hidden="true">
                  <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.4-35.3-4.4-52.2H272v98.9h146.9c-6.3 34.3-25.3 63.5-54 82.9l87.3 67.7c51.1-47 81.3-116.1 81.3-197.3z" />
                  <path fill="#34A853" d="M272 544.3c73.5 0 135.3-24.3 180.4-66l-87.3-67.7c-24.1 16.3-55 25.8-93.1 25.8-71.5 0-132.1-47.9-153.8-112.6l-89.6 69.5c41.6 82.5 127.1 151 243.4 151z" />
                  <path fill="#FBBC05" d="M118.2 323.8c-11.1-34.3-11.1-70.9 0-105.2l-89.6-69.5c-39.7 78.7-39.7 170.5 0 249.2l89.6-69.5z" />
                  <path fill="#EA4335" d="M272 107.7c39.9-.6 78.2 14 107.4 41.2l80.1-80.1C412.8 24.4 344 0 272 0 155.7 0 70.2 68.5 28.6 151l89.6 69.5C139.9 155.6 200.5 107.7 272 107.7z" />
                </svg>
                <span>{t('signInWithGoogle')}</span>
              </button>
            </div>

            {loading && (
              <div className="flex flex-col items-center space-y-3 py-4">
                <div className="w-8 h-8 border-4 border-gray-200 dark:border-neutral-600 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{t('authenticating')}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-neutral-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {t('termsAndPrivacy')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

