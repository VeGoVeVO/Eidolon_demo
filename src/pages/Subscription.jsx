import { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import AnimatedBackground from '../components/AnimatedBackground';
import { useLanguage } from '../i18n/LanguageContext';
import { getDemoSubscription, getDemoPayments } from '../utils/demoStorage';

function formatCurrency(amount, currency) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
  }).format(amount / 100);
}

function Subscription({ user, onLogout }) {
  const { t } = useLanguage();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [payments, setPayments] = useState([]);

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
    setSubscription(getDemoSubscription());
    setPayments(getDemoPayments());
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground isDarkMode={isDarkMode} />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navigation user={user} onLogout={onLogout} />

        <main className="flex-1 px-4 lg:px-12 pt-24 pb-16">
          <header className="max-w-4xl mx-auto text-center mb-12">
            <p className="text-xs uppercase tracking-[0.35em] text-sky-500 dark:text-sky-300 font-semibold mb-2">
              {t('demoSubscriptionBanner')}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('demoSubscriptionTitle')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('demoSubscriptionSubtitle')}
            </p>
          </header>

          <section className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
            <article className="rounded-3xl bg-white/85 dark:bg-neutral-900/70 border border-gray-200/70 dark:border-white/10 shadow-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('demoSubscriptionCurrentPlan')}
              </h2>
              {subscription ? (
                <div className="space-y-3">
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
                    {subscription.plan}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {t('demoSubscriptionStatus', { status: subscription.status })}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('demoSubscriptionRenews', {
                      date: new Date(subscription.renewalDate).toLocaleDateString(),
                    })}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-300">{t('demoSubscriptionLoading')}</p>
              )}
              <button
                type="button"
                className="w-full px-4 py-3 rounded-xl bg-indigo-500 text-white font-semibold shadow-md hover:shadow-lg transition-all"
              >
                {t('demoSubscriptionUpgradeCta')}
              </button>
            </article>

            <article className="rounded-3xl bg-white/85 dark:bg-neutral-900/70 border border-gray-200/70 dark:border-white/10 shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('demoSubscriptionHistory')}
              </h2>
              <ul className="space-y-4">
                {payments.map((payment) => (
                  <li key={payment.id} className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-800/60 border border-gray-200/80 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(payment.amount, payment.currency.toUpperCase())}
                      </span>
                      <span className="text-xs uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-300">
                        {payment.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(payment.created).toLocaleDateString()} — {payment.description}
                    </p>
                  </li>
                ))}
              </ul>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Subscription;
