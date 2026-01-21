import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import Navigation from '../components/Navigation';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import AnimatedBackground from '../components/AnimatedBackground';

function MainApp({ user, onLogout }) {
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

  const beforeImage = '/test_images/test_profile_pic.png';
  const afterImage = '/test_images/test_profile_pic_nobg.png';

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground isDarkMode={isDarkMode} />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navigation user={user} onLogout={onLogout} />

        <main className="flex-1 px-4 lg:px-12 pt-24 pb-16 flex flex-col items-center justify-center">
          <section className="w-full max-w-3xl bg-white/80 dark:bg-neutral-900/70 backdrop-blur-lg border border-white/20 dark:border-neutral-700 rounded-3xl shadow-2xl p-6 sm:p-10">
            <div className="flex items-center justify-center">
              <div className="w-full max-w-2xl rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-700 shadow-xl">
                <BeforeAfterSlider
                  beforeImage={beforeImage}
                  afterImage={afterImage}
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default MainApp;

