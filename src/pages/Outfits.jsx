import { useEffect, useMemo, useState } from 'react';
import Navigation from '../components/Navigation';
import AnimatedBackground from '../components/AnimatedBackground';
import FloatingNotification from '../components/FloatingNotification';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import { useLanguage } from '../i18n/LanguageContext';
import { getDemoOutfits } from '../utils/demoStorage';
import './Outfits.css';

function Outfits({ user, onLogout }) {
  const { t } = useLanguage();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notification, setNotification] = useState(null);
  const [outfits, setOutfits] = useState([]);
  const [selectedOutfitId, setSelectedOutfitId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
    const demo = getDemoOutfits();
    setOutfits(demo);
  }, []);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), notification.duration ?? 2400);
    return () => clearTimeout(timer);
  }, [notification]);

  const filteredOutfits = useMemo(() => {
    if (!searchTerm.trim()) {
      return outfits;
    }
    const query = searchTerm.toLowerCase();
    return outfits.filter((outfit) => {
      const title = outfit.title || '';
      const description = outfit.description || '';
      return title.toLowerCase().includes(query) || description.toLowerCase().includes(query);
    });
  }, [outfits, searchTerm]);

  const selectedOutfit = filteredOutfits.find((outfit) => outfit.outfit_id === selectedOutfitId) || null;

  const openOutfit = (outfitId) => {
    setSelectedOutfitId(outfitId);
  };

  const closeOutfit = () => {
    setSelectedOutfitId(null);
  };

  const handleShare = () => {
    setNotification({ type: 'success', message: t('demoShareMessage') });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground isDarkMode={isDarkMode} />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navigation user={user} onLogout={onLogout} />

        <main className="flex-1 px-4 lg:px-12 pt-24 pb-16">
          <header className="max-w-6xl mx-auto mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-pink-500 dark:text-pink-300 font-semibold mb-2">
                {t('demoGallery')}
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                {t('demoOutfitsTitle')}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
                {t('demoOutfitsSubtitle')}
              </p>
            </div>
            <div className="w-full md:w-72">
              <div className="relative">
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={t('searchLooksPlaceholder')}
                  className="w-full px-4 py-3 rounded-2xl bg-white/85 dark:bg-neutral-900/70 border border-gray-200/80 dark:border-white/10 text-sm text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                />
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 110-15 7.5 7.5 0 010 15z" />
                </svg>
              </div>
            </div>
          </header>

          <section className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredOutfits.map((outfit) => (
              <article
                key={outfit.outfit_id}
                className="group bg-white/85 dark:bg-neutral-900/70 border border-gray-200/70 dark:border-white/10 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={outfit.result_image_processed || outfit.result_image}
                    alt={outfit.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                    <h2 className="text-lg font-semibold text-white leading-snug">
                      {outfit.title || t('untitledLook')}
                    </h2>
                    <p className="text-sm text-white/70 line-clamp-2">
                      {outfit.description || t('outfitDescriptionPlaceholder')}
                    </p>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-indigo-500 dark:text-indigo-300 font-semibold">
                    {t('createdJustNow')}
                  </p>
                  <button
                    type="button"
                    onClick={() => openOutfit(outfit.outfit_id)}
                    className="w-full px-4 py-3 rounded-xl bg-indigo-500 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                  >
                    {t('viewTryOn')}
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200/80 dark:border-white/15 font-semibold text-gray-700 dark:text-gray-200 hover:border-indigo-400/80"
                  >
                    {t('shareLook')}
                  </button>
                </div>
              </article>
            ))}

            {filteredOutfits.length === 0 && (
              <div className="sm:col-span-2 xl:col-span-3 py-16 text-center bg-white/80 dark:bg-neutral-900/70 border border-gray-200/70 dark:border-white/10 rounded-3xl">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  {t('noOutfitsMatchSearch')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('noOutfitsMatchSearchSubtitle')}
                </p>
              </div>
            )}
          </section>
        </main>
      </div>

      {selectedOutfit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-10 bg-black/70 backdrop-blur-sm" onClick={closeOutfit}>
          <div className="relative max-w-5xl w-full" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={closeOutfit}
              className="absolute -top-12 right-0 text-white/80 hover:text-white"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 shadow-2xl">
              <div className="grid md:grid-cols-2">
                <div className="relative border-b md:border-b-0 md:border-r border-gray-200/80 dark:border-white/10">
                  <BeforeAfterSlider
                    beforeImage={selectedOutfit.original_image || selectedOutfit.originalImage}
                    afterImage={selectedOutfit.result_image_processed || selectedOutfit.result_image}
                  />
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-pink-500 dark:text-pink-300 font-semibold mb-2">
                      {t('demoSpotlight')}
                    </p>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {selectedOutfit.title || t('untitledLook')}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {selectedOutfit.description || t('outfitDescriptionPlaceholder')}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/10 border border-indigo-200/70 dark:border-indigo-400/40 p-4">
                    <h3 className="text-xs uppercase tracking-[0.35em] text-indigo-600 dark:text-indigo-300 font-semibold mb-2">
                      {t('lookHighlights')}
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
                      <li>{t('demoHighlightFit')}</li>
                      <li>{t('demoHighlightPalette')}</li>
                      <li>{t('demoHighlightOccasion')}</li>
                    </ul>
                  </div>
                  <div className="flex flex-wrap gap-3 pt-2">
                    {(selectedOutfit.tags || ['Evening', 'Gallery', 'Editorial']).map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-[0.2em] bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

export default Outfits;
