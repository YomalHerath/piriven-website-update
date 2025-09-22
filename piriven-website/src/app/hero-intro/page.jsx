'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MainNavigation } from '@/components/MainNavigation';
import { MobileMenu } from '@/components/MobileMenu';
import { fetchHeroIntro } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { preferLanguage } from '@/lib/i18n';

const HeroIntroPage = () => {
  const { lang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [intro, setIntro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State to track which sections are visible for animations
  const [sectionsVisible, setSectionsVisible] = useState({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchHeroIntro();
        const list = Array.isArray(data) ? data : data?.results || [];
        if (mounted) {
          setIntro(list.length ? list[0] : null);
        }
      } catch (err) {
        if (mounted) {
          setError('Unable to load introduction details at this time.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
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
  }, [intro]);

  const content = useMemo(() => {
    if (!intro) return null;
    return {
      heading: preferLanguage(intro.heading, intro.heading_si, lang) || '',
      highlight: preferLanguage(intro.highlight, intro.highlight_si, lang) || '',
      description: preferLanguage(intro.description, intro.description_si, lang) || '',
    };
  }, [intro, lang]);

  const paragraphs = useMemo(() => {
    if (!content?.description) return [];
    return content.description
      .split(/\r?\n+/)
      .map((para) => para.trim())
      .filter(Boolean);
  }, [content]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-fade-in">
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <MobileMenu mobileMenuOpen={mobileMenuOpen} />
      <MainNavigation />

      <main className="mx-auto px-6 md:px-10 py-18 max-w-4xl flex-grow">
        <section
          id="back-link"
          data-animate
          className={`mb-10 transition-all duration-1000 transform ${
            sectionsVisible['back-link'] ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
          }`}
        >
          <Link href="/" className="text-sm text-red-800 hover:text-black transition-colors">
            ← {lang === 'si' ? 'මුල් පිටුවට' : 'Back to Home'}
          </Link>
        </section>

        {loading ? (
          <p
            id="loading-msg"
            data-animate
            className={`text-gray-600 text-sm transition-all duration-1000 transform ${
              sectionsVisible['loading-msg'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            {lang === 'si' ? 'දත්ත පූර්ව පූරණය වෙමින් පවතී…' : 'Loading introduction…'}
          </p>
        ) : error ? (
          <p
            id="error-msg"
            data-animate
            className={`text-red-700 text-sm transition-all duration-1000 transform ${
              sectionsVisible['error-msg'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            {error}
          </p>
        ) : !content ? (
          <p
            id="no-content-msg"
            data-animate
            className={`text-gray-600 text-sm transition-all duration-1000 transform ${
              sectionsVisible['no-content-msg'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            {lang === 'si'
              ? 'ඔබට පෙන්වීමට හේත්තාගත තොරතුරු දැනට නොමැත.'
              : 'No introduction details available yet.'}
          </p>
        ) : (
          <article className="space-y-8">
            <header
              id="intro-header"
              data-animate
              className={`space-y-4 transition-all duration-1000 transform ${
                sectionsVisible['intro-header'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              {content.heading ? (
                <h1 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight">
                  {content.heading}
                </h1>
              ) : null}
              {content.highlight ? (
                <h2 className="text-3xl font-semibold bg-gradient-to-r from-red-500 via-blue-500 to-yellow-400 bg-clip-text text-transparent animate-gradient-x">
                  {content.highlight}
                </h2>
              ) : null}
            </header>

            {paragraphs.length ? (
              <div className="space-y-5 text-gray-700 text-lg leading-relaxed font-light">
                {paragraphs.map((para, idx) => (
                  <p 
                    key={idx} 
                    id={`para-${idx}`}
                    data-animate
                    className={`transition-all duration-1000 transform ${
                      sectionsVisible[`para-${idx}`] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}
                  >
                    {para}
                  </p>
                ))}
              </div>
            ) : (
              <p
                id="no-description-msg"
                data-animate
                className={`text-gray-600 text-lg font-light transition-all duration-1000 transform ${
                  sectionsVisible['no-description-msg'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                {lang === 'si'
                  ? 'විස්තරාත්මක විස්තරයක් මෙතෙක් ඇතුළත් කර නොමැත.'
                  : 'Detailed introduction has not been provided yet.'}
              </p>
            )}
          </article>
        )}
      </main>

      <Footer />
      
      {/* Add the necessary CSS keyframes for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
      
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default HeroIntroPage;