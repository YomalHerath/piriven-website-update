'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Play } from 'lucide-react';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MainNavigation } from '@/components/MainNavigation';
import { MobileMenu } from '@/components/MobileMenu';
import T from '@/components/T';
import { fetchVideos, mediaUrl } from '@/lib/api';
import { preferLanguage } from '@/lib/i18n';
import { useLanguage } from '@/context/LanguageContext';

export default function VideosPage() {
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
        const data = await fetchVideos();
        const list = Array.isArray(data) ? data : (data?.results || []);
        if (!ignore) setItems(list);
      } catch (e) {
        if (!ignore) setErr(e?.message || 'Failed to load videos');
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

  const videos = useMemo(() => items.map((item) => {
    const title = preferLanguage(item?.title, item?.title_si, lang) || item?.title || '';
    const description = preferLanguage(item?.description, item?.description_si, lang) || '';
    const playback = item?.url || mediaUrl(item?.file) || '';
    const thumbnail = mediaUrl(item?.thumbnail);
    return {
      id: item?.id ?? title,
      title,
      description,
      playback,
      thumbnail,
      hasExternal: Boolean(item?.url),
    };
  }), [items, lang]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-fade-in">
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <MobileMenu mobileMenuOpen={mobileMenuOpen} />
      <MainNavigation />

      <main className="container mx-auto px-6 py-16 flex-grow">
        <section
          id="videos-header"
          data-animate
          className={`text-center mb-12 transition-all duration-1000 transform ${
            sectionsVisible['videos-header'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-light text-gray-900">
            <T>All Videos</T>
          </h1>
          {err ? <p className="mt-4 text-sm text-red-800 font-light">{err}</p> : null}
          {!err && loading ? (
            <p className="mt-4 text-sm text-neutral-600 font-light"><T>Loading videos…</T></p>
          ) : null}
        </section>

        {!loading && !videos.length ? (
          <div
            id="no-videos-msg"
            data-animate
            className={`text-center text-neutral-600 font-light transition-all duration-1000 transform ${
              sectionsVisible['no-videos-msg'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <T>No videos published yet.</T>
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {videos.map((video) => (
            <article
              key={video.id}
              id={`video-item-${video.id}`}
              data-animate
              className={`bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col ${
                sectionsVisible[`video-item-${video.id}`] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <div className="relative h-56 bg-neutral-200 group">
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-neutral-500 text-sm">
                    <T>No thumbnail</T>
                  </div>
                )}
                
                {/* Wrap the thumbnail and play button in a Link/a tag */}
                {video.playback ? (
                  <a
                    href={video.playback}
                    target={video.hasExternal ? '_blank' : '_self'}
                    rel={video.hasExternal ? 'noreferrer' : undefined}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto"
                  >
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full h-16 w-16 flex items-center justify-center group-hover:scale-125 transition-transform duration-300 border-4 border-white/30 cursor-pointer">
                        <Play className="text-black w-6 h-6 ml-1" />
                    </div>
                  </a>
                ) : null}
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-xl font-light text-gray-900 leading-snug">
                  {video.title}
                </h2>
                {video.description ? (
                  <p className="mt-3 text-sm text-neutral-600 font-light line-clamp-4">{video.description}</p>
                ) : null}
                <div className="mt-auto pt-6">
                  {/* The play video link is removed as requested */}
                  {video.playback ? null : (
                    <span className="inline-flex items-center text-sm font-light text-neutral-400">
                      <T>Video unavailable</T>
                    </span>
                  )}
                </div>
              </div>
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