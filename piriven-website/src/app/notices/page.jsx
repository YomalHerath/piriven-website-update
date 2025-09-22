'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MainNavigation } from '@/components/MainNavigation';
import { MobileMenu } from '@/components/MobileMenu';
import T from '@/components/T';
import { fetchNotices, mediaUrl } from '@/lib/api';
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

export default function NoticesPage() {
  const { lang } = useLanguage();
  const router = useRouter();
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
        const data = await fetchNotices();
        const list = Array.isArray(data) ? data : (data?.results || []);
        if (!ignore) setItems(list);
      } catch (e) {
        if (!ignore) setErr(e?.message || 'Failed to load notices');
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

  const notices = useMemo(() => items.map((item) => {
    const title = preferLanguage(item?.title, item?.title_si, lang) || item?.title || '';
    const content = preferLanguage(item?.content, item?.content_si, lang) || '';
    const id = item?.id ?? '';
    const href = id ? `/notices/${id}` : '#';
    return {
      id: id || title,
      href,
      title,
      content,
      date: formatDate(item?.published_at),
      expires: formatDate(item?.expires_at),
      image: mediaUrl(item?.image),
    };
  }), [items, lang]);

  useEffect(() => {
    if (!notices.length) return;
    notices.slice(0, 12).forEach((notice) => {
      if (notice.href && notice.href.startsWith('/notices/') && router && typeof router.prefetch === 'function') {
        try { router.prefetch(notice.href); } catch {}
      }
    });
  }, [notices, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-fade-in">
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <MobileMenu mobileMenuOpen={mobileMenuOpen} />
      <MainNavigation />

      <main className="container mx-auto px-6 py-16 flex-grow">
        <section
          id="notices-header"
          data-animate
          className={`text-center mb-12 transition-all duration-1000 transform ${
            sectionsVisible['notices-header'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-light text-gray-900">
            <T>All Notices</T>
          </h1>
          {err ? <p className="mt-4 text-sm text-red-800 font-light">{err}</p> : null}
          {!err && loading ? (
            <p className="mt-4 text-sm text-neutral-600 font-light"><T>Loading notices…</T></p>
          ) : null}
        </section>

        {!loading && !notices.length ? (
          <div
            id="no-notices-msg"
            data-animate
            className={`text-center text-neutral-600 font-light transition-all duration-1000 transform ${
              sectionsVisible['no-notices-msg'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <T>No notices available yet.</T>
          </div>
        ) : null}

        <div className="space-y-6">
          {notices.map((notice, index) => (
            <Link
              key={notice.id}
              href={notice.href}
              prefetch
              id={`notice-item-${notice.id}`}
              data-animate
              className={`group block bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                sectionsVisible[`notice-item-${notice.id}`] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              onClick={() => {
                if (typeof window === 'undefined') return;
                try {
                  sessionStorage.setItem(`notice-preview:${notice.id || notice.href}`, JSON.stringify(notice));
                } catch {}
              }}
            >
              <div className="md:flex">
                {notice.image ? (
                  <div className="md:w-1/3 aspect-video md:h-auto bg-neutral-200 relative">
                    <img
                      src={notice.image}
                      alt={notice.title}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : null}
                <div className="flex-1 p-6 md:p-8">
                  <p className="text-xs font-light uppercase tracking-wide text-neutral-500">
                    {notice.date || <T>Undated</T>}
                    {notice.expires ? (
                      <span className="ml-3 text-neutral-400">
                        <T>Expires</T>: {notice.expires}
                      </span>
                    ) : null}
                  </p>
                  <h2 className="mt-2 text-2xl font-light text-gray-900 leading-snug group-hover:text-red-800 transition-colors">
                    {notice.title}
                  </h2>
                  {notice.content ? (
                    <p className="mt-4 text-sm font-light text-neutral-600 whitespace-pre-line line-clamp-4">
                      {notice.content}
                    </p>
                  ) : null}
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