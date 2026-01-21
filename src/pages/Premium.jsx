import { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import AnimatedBackground from '../components/AnimatedBackground';
import { useLanguage } from '../i18n/LanguageContext';

const FEATURE_CARDS = [
  { id: 'looks', titleKey: 'premiumFeatureLooks', descriptionKey: 'premiumFeatureLooksDesc' },
  { id: 'scenes', titleKey: 'premiumFeatureScenes', descriptionKey: 'premiumFeatureScenesDesc' },
  { id: 'stylist', titleKey: 'premiumFeatureStylist', descriptionKey: 'premiumFeatureStylistDesc' },
];

function Premium({ user, onLogout }) {
  const { t } = useLanguage();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground isDarkMode={isDarkMode} />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navigation user={user} onLogout={onLogout} />

        <main className="flex-1 px-4 lg:px-12 pt-24 pb-16">
          <section className="max-w-5xl mx-auto text-center mb-12">
            <p className="text-xs uppercase tracking-[0.35em] text-amber-500 dark:text-amber-300 font-semibold mb-3">
              {t('demoPremiumBanner')}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('demoPremiumTitle')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('demoPremiumSubtitle')}
            </p>
          </section>

          <section className="max-w-5xl mx-auto mb-16 grid gap-6 md:grid-cols-3">
            {FEATURE_CARDS.map((feature) => (
              <article
                key={feature.id}
                className="rounded-3xl bg-white/85 dark:bg-neutral-900/70 border border-gray-200/70 dark:border-white/10 shadow-lg p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {t(feature.titleKey)}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t(feature.descriptionKey)}
                </p>
              </article>
            ))}
          </section>

          <section className="max-w-4xl mx-auto text-center">
            <div className="rounded-3xl bg-gradient-to-r from-amber-500 to-pink-500 text-white p-10 shadow-2xl">
              <h2 className="text-2xl font-bold mb-4">{t('demoPremiumPlanTitle')}</h2>
              <p className="text-lg opacity-90 mb-6">{t('demoPremiumPlanSubtitle')}</p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-6 mb-8">
                <div>
                  <p className="text-4xl font-extrabold">$29</p>
                  <p className="text-sm uppercase tracking-[0.35em]">{t('perMonth')}</p>
                </div>
                <ul className="text-left text-sm space-y-2">
                  <li>{t('demoPremiumPerkLooks')}</li>
                  <li>{t('demoPremiumPerkScenes')}</li>
                  <li>{t('demoPremiumPerkSupport')}</li>
                </ul>
              </div>
              <button
                type="button"
                className="px-8 py-3 rounded-full bg-white text-amber-600 font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {t('demoPremiumCta')}
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Premium;
