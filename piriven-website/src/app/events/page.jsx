'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MainNavigation } from '@/components/MainNavigation';
import { MobileMenu } from '@/components/MobileMenu';
import T from '@/components/T';
import { fetchEvents } from '@/lib/api';
import { preferLanguage } from '@/lib/i18n';
import { useLanguage } from '@/context/LanguageContext';

function formatDate(value) {
  if (!value) return '';
  try {
    return new Date(value).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch (err) {
    return value;
  }
}

function eventStatus(startDate, endDate) {
  const now = new Date();
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : start;
  if (!start) return '';
  if (end && end < now) return 'past';
  if (start > now) return 'upcoming';
  return 'ongoing';
}

const statusLabels = {
  upcoming: 'Upcoming',
  ongoing: 'Ongoing',
  past: 'Concluded',
};

const statusStyles = {
  upcoming: 'bg-yellow-300 text-black',
  ongoing: 'bg-red-800 text-white',
  past: 'bg-gray-300 text-gray-800',
};

export default function EventsPage() {
  const { lang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  
  // New state to track which sections are visible for animations
  const [sectionsVisible, setSectionsVisible] = useState({});

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const data = await fetchEvents();
        const list = Array.isArray(data) ? data : (data?.results || []);
        if (!ignore) setItems(list);
      } catch (e) {
        if (!ignore) setErr(e?.message || 'Failed to load events');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);
  
  // New useEffect hook to handle the Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSectionsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px' }
    );

    const targets = document.querySelectorAll('[data-animate]');
    targets.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [items.length]);

  const events = useMemo(() => items.map((item) => {
    const title = preferLanguage(item?.title, item?.title_si, lang) || item?.title || '';
    const description = preferLanguage(item?.description, item?.description_si, lang) || '';
    const start = item?.start_date || '';
    const end = item?.end_date || '';
    const status = eventStatus(start, end);
    const badgeClass = 'inline-flex items-center px-3 py-1 rounded-lg text-xs font-light ' + (statusStyles[status] || '');
    return {
      id: item?.id ?? title,
      title,
      description,
      startFormatted: formatDate(start),
      endFormatted: formatDate(end),
      status,
      badgeClass,
      badgeLabel: status ? statusLabels[status] : '',
    };
  }), [items, lang]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-fade-in">
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <MobileMenu mobileMenuOpen={mobileMenuOpen} />
      <MainNavigation />

      <main className="container mx-auto px-6 py-16 flex-grow">
        <section
            id="events-header"
            data-animate
            className={`text-center mb-12 transition-all duration-1000 transform ${
                sectionsVisible['events-header'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
        >
          <h1 className="text-4xl md:text-5xl font-light text-gray-900">
            <T>All Events</T>
          </h1>
          {err ? <p className="mt-4 text-sm text-red-600 font-light">{err}</p> : null}
          {!err && loading ? (
            <p className="mt-4 text-sm text-neutral-600 font-light"><T>Loading events…</T></p>
          ) : null}
        </section>

        {!loading && !events.length ? (
          <div
            id="no-events"
            data-animate
            className={`text-center text-neutral-600 font-light transition-all duration-1000 transform ${
                sectionsVisible['no-events'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <T>No events scheduled yet.</T>
          </div>
        ) : null}

        <div className="space-y-6">
          {events.map((event) => (
            <article
              key={event.id}
              id={`event-${event.id}`}
              data-animate
              className={`group relative bg-white transition-all duration-300 p-6 md:p-8 hover:shadow-xl border-l-2 border-gray-300 hover:border-red-800 ${
                  sectionsVisible[`event-${event.id}`] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <div className="flex flex-wrap items-center gap-4 text-sm font-light text-neutral-500">
                <span>
                  {event.startFormatted || <T>Undated</T>}
                  {event.endFormatted ? (
                    <span className="text-neutral-400">
                      {' '}→ {event.endFormatted}
                    </span>
                  ) : null}
                </span>
                {event.badgeLabel ? (
                  <span className={event.badgeClass}>
                    <T>{event.badgeLabel}</T>
                  </span>
                ) : null}
              </div>
              <h2 className="mt-4 text-2xl font-light text-gray-900 leading-snug group-hover:text-red-800 transition-colors duration-300">
                {event.title}
              </h2>
              {event.description ? (
                <p className="mt-4 text-sm text-neutral-600 font-light whitespace-pre-line">
                  {event.description}
                </p>
              ) : null}
            </article>
          ))}
        </div>

        <div
            id="back-to-home"
            data-animate
            className={`text-center pt-12 transition-all duration-1000 transform ${
                sectionsVisible['back-to-home'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
        >
          <Link href="/">
            <button className="bg-transparent border-2 border-black hover:bg-black text-black hover:text-white px-8 py-4 rounded-lg font-light transition-colors duration-300">
              ← <T>Back to Home</T>
            </button>
          </Link>
        </div>
      </main>

      <Footer />
      
      {/* Re-add the CSS styles for the animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}