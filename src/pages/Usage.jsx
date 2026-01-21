import { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import AnimatedBackground from '../components/AnimatedBackground';
import { useLanguage } from '../i18n/LanguageContext';
import { getDemoUsage, getDemoOutfitStats, getDemoOutfits } from '../utils/demoStorage';
import './Usage.css';

const clampPercentage = (value) => Math.max(0, Math.min(100, value));

function Usage({ user, onLogout }) {
  const { t } = useLanguage();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [usage, setUsage] = useState(null);
  const [stats, setStats] = useState(null);
  const [outfitCount, setOutfitCount] = useState(0);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setUsage(getDemoUsage());
    setStats(getDemoOutfitStats());
    setOutfitCount(getDemoOutfits().length);
  }, []);

  if (!usage) {
    return null;
  }

  const uploadPercent = clampPercentage(((usage.totalUploads || 0) / Math.max(1, usage.uploadsRemaining + (usage.totalUploads || 0))) * 100);
  const outfitPercent = clampPercentage(((usage.totalOutfits || 0) / Math.max(1, usage.outfitsRemaining + (usage.totalOutfits || 0))) * 100);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground isDarkMode={isDarkMode} />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navigation user={user} onLogout={onLogout} />

        <main className="flex-1 px-4 lg:px-12 pt-24 pb-16">
          <header className="max-w-6xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-[0.35em] text-blue-500 dark:text-blue-300 font-semibold mb-2">
              {t('demoInsightsBanner')}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              {t('demoUsageTitle')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
              {t('demoUsageSubtitle')}
            </p>
          </header>

          <section className="max-w-6xl mx-auto grid gap-6 xl:grid-cols-2">
            <div className="rounded-3xl bg-white/85 dark:bg-neutral-900/70 border border-gray-200/70 dark:border-white/10 shadow-lg p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('demoUsageSummary')}
              </h2>
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('uploadsUsed')}</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {(usage.totalUploads || 0)} / {(usage.totalUploads || 0) + usage.uploadsRemaining}
                    </span>
                  </div>
                  <div className="usage-progress">
                    <div className="usage-progress__bar" style={{ width: `${uploadPercent}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('outfitsGenerated')}</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {(usage.totalOutfits || 0)} / {(usage.totalOutfits || 0) + usage.outfitsRemaining}
                    </span>
                  </div>
                  <div className="usage-progress usage-progress--secondary">
                    <div className="usage-progress__bar" style={{ width: `${outfitPercent}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white/85 dark:bg-neutral-900/70 border border-gray-200/70 dark:border-white/10 shadow-lg p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('demoUsageMilestones')}
              </h2>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20">
                  <dt className="text-blue-600 dark:text-blue-300 font-semibold uppercase tracking-[0.2em] mb-2">{t('outfitsCompleted')}</dt>
                  <dd className="text-2xl font-bold text-gray-900 dark:text-white">{outfitCount}</dd>
                </div>
                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20">
                  <dt className="text-indigo-600 dark:text-indigo-300 font-semibold uppercase tracking-[0.2em] mb-2">{t('favoritesCollected')}</dt>
                  <dd className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.favorites ?? 0}</dd>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20">
                  <dt className="text-emerald-600 dark:text-emerald-300 font-semibold uppercase tracking-[0.2em] mb-2">{t('recentLooks')}</dt>
                  <dd className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.recent ?? 0}</dd>
                </div>
                <div className="p-4 rounded-2xl bg-pink-50 dark:bg-pink-900/20">
                  <dt className="text-pink-600 dark:text-pink-300 font-semibold uppercase tracking-[0.2em] mb-2">{t('sharedMoments')}</dt>
                  <dd className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.shared ?? 0}</dd>
                </div>
              </dl>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Usage;
