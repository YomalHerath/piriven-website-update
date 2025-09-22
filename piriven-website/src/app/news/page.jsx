'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MainNavigation } from '@/components/MainNavigation';
import { MobileMenu } from '@/components/MobileMenu';
import T from '@/components/T';
import { fetchNews, mediaUrl } from '@/lib/api';
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

function formatTime(value) {
  if (!value) return '';
  try {
    return new Date(value).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (err) {
    return '';
  }
}

export default function NewsPage() {
  const { lang } = useLanguage();
  const router = useRouter();
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
        const data = await fetchNews();
        const list = Array.isArray(data) ? data : (data?.results || []);
        if (!ignore) setItems(list);
      } catch (e) {
        if (!ignore) setErr(e?.message || 'Failed to load news');
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

  const news = useMemo(() => items.map((item) => {
    const title = preferLanguage(item?.title, item?.title_si, lang) || item?.title || '';
    const excerpt = preferLanguage(item?.excerpt, item?.excerpt_si, lang) || '';
    const publishedAt = item?.published_at || '';
    const image = mediaUrl(item?.image);
    const slug = item?.slug || (item?.id ? String(item.id) : '');
    const href = slug ? `/news/${slug}` : '#';
    return {
      id: item?.id ?? item?.slug ?? title,
      slug,
      href,
      title,
      excerpt,
      date: formatDate(publishedAt),
      time: formatTime(publishedAt),
      image,
    };
  }), [items, lang]);

  useEffect(() => {
    if (!news.length) return;
    news.slice(0, 12).forEach((item) => {
      if (item.href && item.href.startsWith('/news/') && router && typeof router.prefetch === 'function') {
        try { router.prefetch(item.href); } catch {}
      }
    });
  }, [news, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-fade-in">
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <MobileMenu mobileMenuOpen={mobileMenuOpen} />
      <MainNavigation />

      <main className="mx-auto px-6 md:px-10 py-18 flex-grow">
        <section
          id="news-header"
          data-animate
          className={`text-center mb-12 transition-all duration-1000 transform ${
            sectionsVisible['news-header'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-light text-gray-900">
            <T>All News</T>
          </h1>
          {err ? <p className="mt-4 text-sm text-red-600 font-light">{err}</p> : null}
          {!err && loading ? (
            <p className="mt-4 text-sm text-neutral-600 font-light"><T>Loading news…</T></p>
          ) : null}
        </section>

        {!loading && !news.length ? (
          <div
            id="no-news-msg"
            data-animate
            className={`text-center text-neutral-600 font-light transition-all duration-1000 transform ${
              sectionsVisible['no-news-msg'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <T>No news articles yet.</T>
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <Link
              key={item.id}
              href={item.href}
              prefetch
              id={`news-item-${item.id}`}
              data-animate
              className={`group bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col ${
                sectionsVisible[`news-item-${item.id}`] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              onClick={() => {
                if (typeof window === 'undefined') return;
                try {
                  sessionStorage.setItem(`news-preview:${item.slug || item.id || item.href}`, JSON.stringify(item));
                } catch {}
              }}
            >
              <div className="relative h-56 bg-neutral-200">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : null}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <p className="text-xs font-light uppercase tracking-wide text-neutral-500">
                  {item.date}
                  {item.time ? <span className="ml-2 text-neutral-400">{item.time}</span> : null}
                </p>
                <h2 className="mt-3 text-xl font-light text-gray-900 leading-snug group-hover:text-red-800 transition-colors">
                  {item.title}
                </h2>
                {item.excerpt ? (
                  <p className="mt-3 text-sm text-neutral-600 font-light line-clamp-3">{item.excerpt}</p>
                ) : null}
                <div className="mt-auto pt-6">
                  <span className="inline-flex items-center text-sm font-light text-red-800">
                    <T>Read full story</T>
                  </span>
                </div>
              </div>
            </Link>
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
            <button className="cursor-pointer bg-transparent border-2 border-black hover:bg-black text-black hover:text-white px-8 py-4 rounded-lg font-light transition-colors duration-300">
              ← <T>Back to Home</T>
            </button>
          </Link>
        </div>
      </main>

      <Footer />
      
      {/* Add the necessary CSS keyframes for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}