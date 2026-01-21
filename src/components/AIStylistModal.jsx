import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const AIStylistModal = ({ isOpen, onClose, onGenerate, isGenerating }) => {
  const { t } = useLanguage();
  const [occasion, setOccasion] = useState('');
  const [vibe, setVibe] = useState('');
  const [weather, setWeather] = useState('');
  const [colorPref, setColorPref] = useState('');
  const [loadingStatus, setLoadingStatus] = useState('');

  const occasions = [
    'occasionCasual',
    'occasionFormal',
    'occasionBusiness',
    'occasionParty',
    'occasionDate',
    'occasionSports',
    'occasionBeach',
    'occasionTravel'
  ];

  const vibes = [
    'vibeElegant',
    'vibeEdgy',
    'vibeMinimalist',
    'vibeBold',
    'vibeComfortable',
    'vibeTrendy',
    'vibeClassic',
    'vibeBoho'
  ];

  const weathers = [
    'weatherHot',
    'weatherWarm',
    'weatherCool',
    'weatherCold',
    'weatherRainy'
  ];

  const colorPrefs = [
    'colorAny',
    'colorMonochrome',
    'colorBright',
    'colorPastel',
    'colorEarthy',
    'colorDark'
  ];

  // Loading status animation
  useEffect(() => {
    if (!isGenerating) {
      setLoadingStatus('');
      return;
    }

    const statuses = [
      'Analyzing your wardrobe...',
      'Understanding your style preferences...',
      'Matching colors and patterns...',
      'Creating the perfect combination...',
      'Finalizing your outfit...'
    ];

    let currentIndex = 0;
    setLoadingStatus(statuses[0]);

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % statuses.length;
      setLoadingStatus(statuses[currentIndex]);
    }, 2000);

    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerate = () => {
    if (!occasion || !vibe || !weather || !colorPref) {
      return;
    }

    onGenerate({
      occasion: t(occasion) || occasion,
      vibe: t(vibe) || vibe,
      weather: t(weather) || weather,
      colorPreference: t(colorPref) || colorPref
    });
  };

  const isFormValid = occasion && vibe && weather && colorPref;

  if (!isOpen) return null;

  // Full screen loading overlay (like scenery generation)
  if (isGenerating) {
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
            {t('aiStylist')}
          </h3>
          <p className="text-gray-300 text-lg mb-2">
            {loadingStatus}
          </p>
          <p className="text-gray-400 text-sm">
            {t('thisMayTakeAMoment')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 dark:border-neutral-800/50">
        {/* Header - Modern Design */}
        <div className="sticky top-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl p-6 border-b border-gray-200/50 dark:border-neutral-800/50 rounded-t-3xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {t('aiStylistTitle')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-0.5">
                  {t('aiStylistSubtitle')}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-xl w-10 h-10 flex items-center justify-center transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Question 1: Occasion */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-900 dark:text-white">
                  {t('occasion')}
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">What's the event?</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {occasions.map((occ) => (
                <button
                  key={occ}
                  onClick={() => setOccasion(occ)}
                  className={`relative px-5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    occasion === occ
                      ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-xl shadow-indigo-500/30 scale-105 ring-2 ring-indigo-400 ring-offset-2 dark:ring-offset-neutral-900'
                      : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 hover:scale-105 border border-gray-200 dark:border-neutral-700 shadow-sm hover:shadow-md'
                  }`}
                >
                  {t(occ)}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Vibe/Style */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-900 dark:text-white">
                  {t('vibeStyle')}
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">What's your mood?</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {vibes.map((v) => (
                <button
                  key={v}
                  onClick={() => setVibe(v)}
                  className={`relative px-5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    vibe === v
                      ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-xl shadow-purple-500/30 scale-105 ring-2 ring-purple-400 ring-offset-2 dark:ring-offset-neutral-900'
                      : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 hover:scale-105 border border-gray-200 dark:border-neutral-700 shadow-sm hover:shadow-md'
                  }`}
                >
                  {t(v)}
                </button>
              ))}
            </div>
          </div>

          {/* Question 3: Weather/Season */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-900 dark:text-white">
                  {t('weatherSeason')}
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">What's the weather like?</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {weathers.map((w) => (
                <button
                  key={w}
                  onClick={() => setWeather(w)}
                  className={`relative px-5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    weather === w
                      ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-xl shadow-emerald-500/30 scale-105 ring-2 ring-emerald-400 ring-offset-2 dark:ring-offset-neutral-900'
                      : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 hover:scale-105 border border-gray-200 dark:border-neutral-700 shadow-sm hover:shadow-md'
                  }`}
                >
                  {t(w)}
                </button>
              ))}
            </div>
          </div>

          {/* Question 4: Color Preference */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-900 dark:text-white">
                  {t('colorPreference')}
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">What colors do you prefer?</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {colorPrefs.map((c) => (
                <button
                  key={c}
                  onClick={() => setColorPref(c)}
                  className={`relative px-5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    colorPref === c
                      ? 'bg-gradient-to-br from-pink-600 to-pink-700 text-white shadow-xl shadow-pink-500/30 scale-105 ring-2 ring-pink-400 ring-offset-2 dark:ring-offset-neutral-900'
                      : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 hover:scale-105 border border-gray-200 dark:border-neutral-700 shadow-sm hover:shadow-md'
                  }`}
                >
                  {t(c)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl p-6 rounded-b-3xl border-t border-gray-200/50 dark:border-neutral-800/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full transition-all ${isFormValid ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-gray-300 dark:bg-neutral-600'}`}></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {isFormValid ? 'Ready to generate' : 'Please answer all questions'}
              </span>
            </div>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-500">
              {[occasion, vibe, weather, colorPref].filter(Boolean).length}/4
            </span>
          </div>
          <button
            onClick={handleGenerate}
            disabled={!isFormValid}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
              isFormValid
                ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-[1.02]'
                : 'bg-gray-300 dark:bg-neutral-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
            }`}
            style={isFormValid ? { backgroundSize: '200% 100%' } : {}}
          >
            <div className="flex items-center justify-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>{t('generateOutfit')}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIStylistModal;

