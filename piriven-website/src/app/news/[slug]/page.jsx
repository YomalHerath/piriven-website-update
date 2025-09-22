'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MainNavigation } from '@/components/MainNavigation';
import { MobileMenu } from '@/components/MobileMenu';
import T from '@/components/T';
import { fetchNewsDetail, mediaUrl } from '@/lib/api';
import { preferLanguage } from '@/lib/i18n';
import { useLanguage } from '@/context/LanguageContext';

function ensureString(value) {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

function formatDateTime(value) {
  if (!value) return { date: '', time: '' };
  try {
    const date = new Date(value);
    return {
      date: date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  } catch (error) {
    return { date: value, time: '' };
  }
}

export default function NewsDetailPage() {
  const { slug } = useParams();
  const effectiveSlug = ensureString(slug);
  const { lang } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!effectiveSlug) {
      setLoading(false);
      setErr('News not found');
      return;
    }

    let ignore = false;

    if (typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem(`news-preview:${effectiveSlug}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          setData((prev) => prev ?? parsed);
        }
      } catch {}
    }

    setLoading(true);
    setErr('');

    (async () => {
      try {
        const item = await fetchNewsDetail(effectiveSlug);
        if (!ignore) {
          setData(item);
          if (typeof window !== 'undefined') {
            try {
              sessionStorage.setItem(`news-preview:${effectiveSlug}`, JSON.stringify(item));
            } catch {}
          }
        }
      } catch (error) {
        if (!ignore) setErr(error?.message || 'Failed to load news');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [effectiveSlug]);

  const news = useMemo(() => {
    if (!data) return null;
    const title = preferLanguage(data?.title, data?.title_si, lang) || data?.title || '';
    const content = preferLanguage(data?.content, data?.content_si, lang) || data?.content || '';
    const excerpt = preferLanguage(data?.excerpt, data?.excerpt_si, lang) || '';
    const image = mediaUrl(data?.image);
    const gallery = Array.isArray(data?.gallery_images)
      ? data.gallery_images
          .map((item, index) => ({
            id: item?.id ?? index,
            src: mediaUrl(item?.image),
            caption: preferLanguage(item?.caption, item?.caption_si, lang),
          }))
          .filter((item) => item.src)
      : [];
    const { date, time } = formatDateTime(data?.published_at);
    return {
      title,
      content,
      excerpt,
      image,
      gallery,
      date,
      time,
    };
  }, [data, lang]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-fade-in">
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <MobileMenu mobileMenuOpen={mobileMenuOpen} />
      <MainNavigation />

      <main className="container mx-auto px-6 py-16 max-w-7xl flex-grow">
        {loading ? (
          <div className="text-center text-neutral-600 font-light mt-16">
            <T>Loading news…</T>
          </div>
        ) : null}

        {err ? (
          <div className="text-center text-sm text-red-800 font-light mt-16">
            Error: {err}
          </div>
        ) : null}

        {!loading && !err && news ? (
          <article className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Left Column: Text Content */}
            <div className="md:col-span-1">
              <div className="mb-8 animate-slide-up">
                <Link
                  href="/news"
                  className="inline-flex items-center text-sm font-light text-black hover:text-red-800 transition-colors"
                >
                  ← <span className="ml-2"><T>Back to all news</T></span>
                </Link>
              </div>

              <p className="text-xs font-light uppercase tracking-wide text-neutral-500 animate-slide-up animation-delay-200">
                {news.date}
                {news.time ? <span className="ml-2 text-neutral-400">{news.time}</span> : null}
              </p>
              <h1 className="mt-3 text-3xl md:text-4xl font-light text-gray-900 leading-tight animate-slide-up animation-delay-300">
                {news.title || <T>Untitled</T>}
              </h1>
              {news.excerpt ? (
                <p className="mt-4 text-base font-light text-neutral-600 animate-slide-up animation-delay-400">{news.excerpt}</p>
              ) : null}

              {news.content ? (
                <div
                  className="mt-8 text-gray-900 font-light animate-slide-up animation-delay-500"
                  dangerouslySetInnerHTML={{ __html: news.content }}
                />
              ) : (
                <p className="mt-8 text-sm font-light text-neutral-500 animate-slide-up animation-delay-500">
                  <T>Full content coming soon.</T>
                </p>
              )}
            </div>

            {/* Right Column: Image */}
            {news.image && (
              <div className="md:col-span-1 mt-8 md:mt-0">
                <div className="relative h-96 w-full overflow-hidden rounded-lg shadow-xl bg-neutral-200 animate-slide-up animation-delay-600">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </article>
        ) : null}

        {!loading && !err && news?.gallery?.length ? (
          <section className="mt-16">
            <h2 className="text-2xl font-light text-gray-900 mb-6 animate-slide-up animation-delay-700">
              <T>Gallery</T>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.gallery.map((item, index) => (
                <figure 
                  key={item.id} 
                  className={`group overflow-hidden rounded-lg shadow-lg bg-neutral-200 animate-slide-up`}
                  style={{ animationDelay: `${700 + 100 * (index + 1)}ms`}}
                >
                  <img
                    src={item.src}
                    alt={item.caption || news.title}
                    className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {item.caption ? (
                    <figcaption className="px-4 py-3 text-sm font-light text-gray-700 bg-white">
                      {item.caption}
                    </figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <Footer />
      
      {/* Add the necessary CSS keyframes for animations */}
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

        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-600 { animation-delay: 600ms; }
        .animation-delay-700 { animation-delay: 700ms; }
      `}</style>
    </div>
  );
}