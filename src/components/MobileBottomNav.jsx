import { useMemo, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Shirt, Layers, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = useMemo(() => ([
    {
      path: '/profile',
      icon: User,
      label: t('profile'),
    },
    {
      path: '/wardrobe',
      icon: Shirt,
      label: t('wardrobe'),
    },
    {
      path: '/marketplace',
      icon: ShoppingBag,
      label: t('marketplace'),
    },
    {
      path: '/outfits',
      icon: Layers,
      label: 'Outfits',
    },
  ]), [t]);

  const [isSwitching, setIsSwitching] = useState(false);

  const activeIndex = useMemo(() => {
    const idx = navItems.findIndex(item => location.pathname.startsWith(item.path));
    return idx === -1 ? 0 : idx;
  }, [location.pathname, navItems]);

  useEffect(() => {
    setIsSwitching(true);
    const timeout = setTimeout(() => setIsSwitching(false), 500);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  const itemWidth = 100 / navItems.length;
  const indicatorLeft = activeIndex * itemWidth + itemWidth / 2;
  const brandGradient = 'from-[#9333EA] via-[#DB2777] to-[#F97316]';

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      aria-label="Primary navigation"
    >
      <div className="relative bg-white/90 dark:bg-neutral-900/95 border-t border-gray-200/60 dark:border-neutral-800/80 backdrop-blur-2xl shadow-[0_-20px_45px_rgba(0,0,0,0.25)]">
        <div
          className="relative flex items-center justify-around px-4 py-3"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 4px)' }}
        >
          <div
            className={`absolute bottom-1.5 h-1.5 rounded-full bg-gradient-to-r ${brandGradient} shadow-[0_0_18px_rgba(147,51,234,0.4)]`}
            style={{
              left: `${indicatorLeft}%`,
              transform: 'translateX(-50%)',
              width: '48px',
              transition: 'left 450ms cubic-bezier(0.22, 1, 0.36, 1), opacity 250ms ease',
              opacity: isSwitching ? 0.9 : 1,
            }}
            aria-hidden="true"
          />

          {navItems.map((item, index) => {
            const isActive = index === activeIndex;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className="relative flex flex-col items-center justify-center flex-1 gap-1 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#9333EA] dark:focus-visible:ring-[#F97316] focus-visible:ring-offset-transparent"
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="relative flex items-center justify-center">
                  <Icon
                    size={26}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={`transition-all duration-300 ${
                      isActive
                        ? 'text-[#F97316] drop-shadow-[0_0_12px_rgba(249,115,22,0.45)] scale-110'
                        : 'text-gray-500 dark:text-gray-400 scale-100'
                    }`}
                  />
                </div>
                <span
                  className={`text-[10px] font-semibold tracking-[0.18em] uppercase transition-colors duration-300 ${
                    isActive
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#9333EA] via-[#DB2777] to-[#F97316] drop-shadow-[0_2px_8px_rgba(147,51,234,0.35)]'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MobileBottomNav;
