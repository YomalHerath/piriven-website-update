'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MainNavigation } from '@/components/MainNavigation';
import { MobileMenu } from '@/components/MobileMenu';
import T from '@/components/T';

import { fetchAlbums, mediaUrl } from '@/lib/api';

export default function FullGallery() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sectionsVisible, setSectionsVisible] = useState({});
  const [fullScreenImage, setFullScreenImage] = useState(null);

  const [albums, setAlbums] = useState([]);
  const [err, setErr] = useState('');
  const [selectedSlug, setSelectedSlug] = useState('all');

  // Load albums (expects backend AlbumSerializer to include nested `images`)
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchAlbums(); // handles paginated/array
        const list = Array.isArray(data) ? data : (data?.results || []);
        setAlbums(list);

        // pick default from query (?album=<slug>) or show all
        if (typeof window !== 'undefined') {
          const q = new URLSearchParams(window.location.search);
          const qSlug = q.get('album') || q.get('slug');
          if (qSlug && list.some(a => a.slug === qSlug)) {
            setSelectedSlug(qSlug);
          } else if (list.length) {
            setSelectedSlug('all');
          }
        }
      } catch (e) {
        setErr(e?.message || 'Failed to load albums');
      }
    })();
  }, []);

  // IntersectionObserver for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setSectionsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    const els = document.querySelectorAll('[data-animate]');
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Build the images list based on selection
  const images = useMemo(() => {
    const make = img => ({
      id: img.id,
      url: mediaUrl(img.image),
      caption: img.caption || '',
    });

    if (!albums.length) return [];

    if (selectedSlug === 'all') {
      return albums.flatMap(a => Array.isArray(a.images) ? a.images.map(make) : []);
    }

    const album = albums.find(a => a.slug === selectedSlug);
    if (!album) return [];
    return Array.isArray(album.images) ? album.images.map(make) : [];
  }, [albums, selectedSlug]);

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in overflow-x-hidden">
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <MobileMenu mobileMenuOpen={mobileMenuOpen} />
      <MainNavigation />

      <main className="mx-auto px-6 md:px-10 py-18">
        {/* Header */}
        <section
          id="gallery-header"
          data-animate
          className={`text-center mb-8 transition-all duration-1000 transform ${
            sectionsVisible['gallery-header'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight">
            <T>Our Photo Gallery</T>
          </h1>
          {err ? <p className="mt-3 text-sm text-red-600 font-light">{err}</p> : null}
        </section>

        {/* Album filter pills */}
        <section
          id="gallery-albums"
          data-animate
          className={`mb-8 transition-all duration-1000 transform ${
            sectionsVisible['gallery-albums'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          {albums.length ? (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedSlug('all')}
                className={`cursor-pointer px-4 py-2 rounded-lg text-sm border transition ${
                  selectedSlug === 'all'
                    ? 'bg-black text-white border-black'
                    : 'bg-white hover:bg-gray-100 text-black border-gray-300'
                }`}
              >
                <T>All</T>
              </button>
              {albums.map(a => (
                <button
                  key={a.id}
                  onClick={() => setSelectedSlug(a.slug)}
                  className={`cursor-pointer px-4 py-2 rounded-lg text-sm border transition ${
                    selectedSlug === a.slug
                      ? 'bg-black text-white border-black'
                      : 'bg-white hover:bg-gray-100 text-black border-gray-300'
                  }`}
                  title={a.description || a.title}
                >
                  {a.title}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-sm text-neutral-600 font-light"><T>No albums yet.</T></div>
          )}
        </section>

        {/* Images grid */}
        <section
          id="gallery-grid"
          data-animate
          className={`transition-all duration-1000 transform ${
            sectionsVisible['gallery-grid'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          {!images.length ? (
            <div className="text-sm text-neutral-600 font-light"><T>No photos to display.</T></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {images.map((img, index) => (
                <div
                  key={img.id ?? index}
                  className="relative overflow-hidden rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in-up group transform hover:scale-105"
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                >
                  <img
                    src={img.url}
                    alt={img.caption || 'Gallery image'}
                    className="w-full h-full object-cover cursor-pointer"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button 
                        onClick={() => setFullScreenImage(img.url)}
                        className="cursor-pointer bg-transparent border-2 border-white hover:bg-transparent border-2 text-white hover:text-white px-8 py-4 rounded-lg font-light transition-colors duration-300"
                      >
                        <T>View Image</T>
                      </button>
                  </div>
                  {img.caption ? (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 font-light">
                      {img.caption}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="text-center pt-10 animate-fade-in-up animation-delay-600">
          <Link href="/">
            <button className="cursor-pointer bg-transparent border-2 border-black hover:bg-black text-black hover:text-white px-8 py-4 rounded-lg font-light transition-colors duration-300">
              ← <T>Back to Home</T>
            </button>
          </Link>
        </div>
      </main>

      <Footer />

      {/* Lightbox */}
      {fullScreenImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
          onClick={() => setFullScreenImage(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh] overflow-hidden rounded-lg">
            <img
              src={fullScreenImage}
              alt="Full screen view"
              className="max-w-full max-h-[90vh] object-contain cursor-zoom-out"
              onClick={e => e.stopPropagation()}
            />
            <button
              className="cursor-pointer absolute top-4 right-4 text-white text-4xl font-light hover:text-red-800 transition-colors"
              onClick={() => setFullScreenImage(null)}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .animate-slide-up { animation: slide-up 0.8s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }

        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-600 { animation-delay: 600ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
      `}</style>
    </div>
  );
}