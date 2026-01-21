import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const LoadingOverlay = ({ isLoading, title, statusMessages, interval = 2000 }) => {
  const { t } = useLanguage();
  const [loadingStatus, setLoadingStatus] = useState('');

  useEffect(() => {
    if (!isLoading || !statusMessages || statusMessages.length === 0) {
      setLoadingStatus('');
      return;
    }

    let currentIndex = 0;
    setLoadingStatus(statusMessages[0]);

    const statusInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % statusMessages.length;
      setLoadingStatus(statusMessages[currentIndex]);
    }, interval);

    return () => clearInterval(statusInterval);
  }, [isLoading, statusMessages, interval]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative mb-8">
          {/* Outer spinning ring */}
          <div className="w-32 h-32 border-8 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin mx-auto"></div>
          {/* Inner pulsing circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">
          {title}
        </h3>
        {loadingStatus && (
          <p className="text-gray-300 text-lg mb-2">
            {loadingStatus}
          </p>
        )}
        <p className="text-gray-400 text-sm">
          {t('thisMayTakeAMoment')}
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;

