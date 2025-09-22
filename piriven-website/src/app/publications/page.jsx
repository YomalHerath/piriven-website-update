'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MainNavigation } from '@/components/MainNavigation';
import { MobileMenu } from '@/components/MobileMenu';
import T from '@/components/T';
import { fetchBooks, mediaUrl } from '@/lib/api';
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

export default function PublicationsPage() {
  const { lang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  // State to track which sections are visible for animations
  const [sectionsVisible, setSectionsVisible] = useState({});

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const data = await fetchBooks({ page_size: 100, ordering: '-published_at' });
        if (!ignore) setItems(Array.isArray(data) ? data : (data?.results || []));
      } catch (e) {
        if (!ignore) setErr(e?.message || 'Failed to load publications');
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

  const publications = useMemo(() => items.map((item) => {
    const title = preferLanguage(item?.title, item?.title_si, lang) || item?.title || '';
    const subtitle = preferLanguage(item?.subtitle, item?.subtitle_si, lang) || '';
    const authors = preferLanguage(item?.authors, item?.authors_si, lang) || '';
    const description = preferLanguage(item?.description, item?.description_si, lang) || '';
    const year = item?.year ? String(item.year) : '';
    const cover = mediaUrl(item?.cover);
    const pdf = mediaUrl(item?.pdf_file);
    const externalUrl = item?.external_url || '';
    const href = externalUrl || pdf || '';
    const isExternal = Boolean(externalUrl);
    return {
      id: item?.id ?? title,
      title,
      subtitle,
      authors,
      description,
      year,
      cover,
      href,
      isExternal,
      publishedAt: formatDate(item?.published_at),
    };
  }), [items, lang]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-fade-in">
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <MobileMenu mobileMenuOpen={mobileMenuOpen} />
      <MainNavigation />

      <main className="container mx-auto px-6 py-16 flex-grow">
        <section
          id="publications-header"
          data-animate
          className={`text-center mb-12 transition-all duration-1000 transform ${
            sectionsVisible['publications-header'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-light text-gray-900">
            <T>All Publications</T>
          </h1>
          {err ? <p className="mt-4 text-sm text-red-800 font-light">{err}</p> : null}
          {!err && loading ? (
            <p className="mt-4 text-sm text-neutral-600 font-light"><T>Loading publications…</T></p>
          ) : null}
        </section>

        {!loading && !publications.length ? (
          <div
            id="no-pubs-msg"
            data-animate
            className={`text-center text-neutral-600 font-light transition-all duration-1000 transform ${
              sectionsVisible['no-pubs-msg'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <T>No publications yet.</T>
          </div>
        ) : null}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {publications.map((book) => (
            <div
              key={book.id}
              id={`publication-${book.id}`}
              data-animate
              className={`transition-all duration-1000 transform ${
                sectionsVisible[`publication-${book.id}`] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <a
                href={book.href}
                target={book.isExternal ? '_blank' : '_self'}
                rel={book.isExternal ? 'noreferrer' : undefined}
                className="group block w-full overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative w-full aspect-[3/4]">
                  {book.cover ? (
                    <img
                      src={book.cover}
                      alt={book.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-neutral-200" />
                  )}

                  <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 md:p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="space-y-1">
                      <h3 className="text-white text-base md:text-lg font-light leading-snug line-clamp-2 drop-shadow">
                        {book.title || <T>Untitled</T>}
                      </h3>
                      {book.subtitle ? (
                        <p className="text-white/90 text-xs md:text-sm font-light line-clamp-1">{book.subtitle}</p>
                      ) : null}
                      {book.authors ? (
                        <p className="text-white/90 text-xs md:text-sm font-light line-clamp-1">
                          <T>Authors</T>: {book.authors}
                        </p>
                      ) : null}

                      <div className="mt-2">
                        <button className="bg-transparent border-2 border-white hover:bg-white text-white hover:text-black px-4 py-2 rounded-lg font-light text-xs transition-colors duration-300">
                          <T>View publication</T>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
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