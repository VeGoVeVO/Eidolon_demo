import { useEffect, useMemo, useState } from 'react';
import Navigation from '../components/Navigation';
import AnimatedBackground from '../components/AnimatedBackground';
import FloatingNotification from '../components/FloatingNotification';
import { useLanguage } from '../i18n/LanguageContext';
import { getDemoClothing } from '../utils/demoStorage';

const CATEGORY_ORDER = ['all', 'outerwear', 'top', 'bottom', 'dress', 'shoes', 'bag'];

const categoryLabel = (category, translate) => {
  if (category === 'all') {
    return translate('allCategories');
  }
  return translate(category) || category;
};

function Wardrobe({ user, onLogout }) {
  const { t } = useLanguage();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notification, setNotification] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [clothing, setClothing] = useState([]);

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
    const items = getDemoClothing();
    setClothing(items);
  }, []);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), notification.duration ?? 2800);
    return () => clearTimeout(timer);
  }, [notification]);

  const filteredClothing = useMemo(() => {
    if (selectedCategory === 'all') {
      return clothing;
    }
    return clothing.filter((item) => item.category === selectedCategory);
  }, [clothing, selectedCategory]);

  const openImageModal = (imageUrl) => {
    setModalImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
  };

  const handleCopyDescription = (description) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(description || '').then(() => {
        setNotification({ type: 'success', message: t('copiedDescription') });
      }).catch(() => {
        setNotification({ type: 'error', message: t('copyFailed') });
      });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground isDarkMode={isDarkMode} />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navigation user={user} onLogout={onLogout} />

        <main className="flex-1 px-4 lg:px-12 pt-24 pb-16">
          <header className="max-w-6xl mx-auto mb-10">
            <p className="text-xs uppercase tracking-[0.35em] text-indigo-500 dark:text-indigo-300 font-semibold mb-2">
              {t('demoExperience')}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              {t('demoWardrobeTitle')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
              {t('demoWardrobeSubtitle')}
            </p>
          </header>

          <section className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
              {CATEGORY_ORDER.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full border transition-all text-sm font-semibold whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                      : 'bg-white/80 dark:bg-neutral-900/80 border-gray-200/70 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-indigo-400/80'
                  }`}
                >
                  {categoryLabel(category, t)}
                </button>
              ))}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredClothing.map((item) => (
                <article
                  key={item.clothing_id}
                  className="group relative bg-white/85 dark:bg-neutral-900/70 border border-gray-200/70 dark:border-white/10 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={item.processed_image_url || item.original_image_url}
                      alt={item.description}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      onClick={() => openImageModal(item.processed_image_url || item.original_image_url)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 pointer-events-none" />
                    <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 dark:bg-black/40 text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-200">
                      {categoryLabel(item.category, t)}
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <header className="space-y-2">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight line-clamp-2">
                        {item.description}
                      </h2>
                      {item.clothing_type && (
                        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
                          <span className="inline-block w-2 h-2 rounded-full bg-indigo-400" />
                          {item.clothing_type}
                        </span>
                      )}
                    </header>

                    {item.colors?.length ? (
                      <div className="flex flex-wrap gap-3">
                        {item.colors.map((color) => (
                          <div key={color.color} className="flex items-center gap-2">
                            <span
                              className="w-5 h-5 rounded-full border border-white shadow"
                              style={{ backgroundColor: color.hex }}
                              title={color.color}
                            ></span>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                              {color.color}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => openImageModal(item.original_image_url)}
                        className="text-sm font-semibold text-indigo-600 dark:text-indigo-300 hover:text-indigo-500"
                      >
                        {t('viewOriginal')}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyDescription(item.description)}
                        className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      >
                        {t('copyDetails')}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4" onClick={closeImageModal}>
          <div className="relative max-w-3xl w-full" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={closeImageModal}
              className="absolute -top-10 right-0 text-white/80 hover:text-white"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img src={modalImage} alt={t('selectedItem')} className="w-full h-full object-contain bg-black" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Wardrobe;

