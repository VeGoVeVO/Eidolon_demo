import { useEffect, useMemo, useState } from 'react';
import Navigation from '../components/Navigation';
import AnimatedBackground from '../components/AnimatedBackground';
import FloatingNotification from '../components/FloatingNotification';
import { useLanguage } from '../i18n/LanguageContext';
import { getDemoMarketplace } from '../utils/demoStorage';

function Marketplace({ user, onLogout }) {
  const { t } = useLanguage();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);

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
    const demoItems = getDemoMarketplace();
    setItems(demoItems);
  }, []);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), notification.duration ?? 2200);
    return () => clearTimeout(timer);
  }, [notification]);

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) {
      return items;
    }
    const query = searchTerm.toLowerCase();
    return items.filter((item) => {
      const title = item.title || '';
      const tags = (item.tags || []).join(' ').toLowerCase();
      return title.toLowerCase().includes(query) || tags.includes(query);
    });
  }, [items, searchTerm]);

  const handleFavorite = () => {
    setNotification({ type: 'success', message: t('demoFavoriteMessage') });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground isDarkMode={isDarkMode} />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navigation user={user} onLogout={onLogout} />

        <main className="flex-1 px-4 lg:px-12 pt-24 pb-16">
          <header className="max-w-6xl mx-auto mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-500 dark:text-emerald-300 font-semibold mb-2">
                {t('demoMarketBanner')}
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                {t('demoMarketplaceTitle')}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
                {t('demoMarketplaceSubtitle')}
              </p>
            </div>
            <div className="w-full md:w-72">
              <div className="relative">
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={t('searchMarketplacePlaceholder')}
                  className="w-full px-4 py-3 rounded-2xl bg-white/85 dark:bg-neutral-900/70 border border-gray-200/80 dark:border-white/10 text-sm text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                />
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 110-15 7.5 7.5 0 010 15z" />
                </svg>
              </div>
            </div>
          </header>

          <section className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => (
              <article
                key={item.id}
                className="group bg-white/85 dark:bg-neutral-900/70 border border-gray-200/70 dark:border-white/10 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 dark:bg-black/40 text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-200">
                    {t('demoMarketTag')}
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <header>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white leading-snug mb-2">
                      {item.title}
                    </h2>
                    <p className="text-sm text-emerald-600 dark:text-emerald-300 font-semibold">
                      {item.price}
                    </p>
                  </header>
                  {item.tags?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-[0.2em] bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleFavorite}
                      className="flex-1 px-4 py-3 rounded-xl bg-emerald-500 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                      {t('addToFavorites')}
                    </button>
                    <button
                      type="button"
                      onClick={handleFavorite}
                      className="px-4 py-3 rounded-xl border border-gray-200/80 dark:border-white/15 font-semibold text-gray-700 dark:text-gray-200 hover:border-emerald-400/80"
                    >
                      {t('learnMore')}
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {filteredItems.length === 0 && (
              <div className="sm:col-span-2 xl:col-span-3 py-16 text-center bg-white/80 dark:bg-neutral-900/70 border border-gray-200/70 dark:border-white/10 rounded-3xl">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  {t('noListingsMatchSearch')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('noListingsMatchSearchSubtitle')}
                </p>
              </div>
            )}
          </section>
        </main>
      </div>

      {notification && (
        <FloatingNotification
          type={notification.type}
          message={notification.message}
          duration={notification.duration}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

export default Marketplace;
