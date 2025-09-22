'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { MobileMenu } from '@/components/MobileMenu';
import { Footer } from '@/components/Footer';
import { MainNavigation } from '@/components/MainNavigation';
import { useLanguage } from '@/context/LanguageContext';
import { preferLanguage } from '@/lib/i18n';
import { fetchAboutSections, fetchSiteTextSnippets } from '@/lib/api';

const AboutPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sectionsVisible, setSectionsVisible] = useState({});
  const [sections, setSections] = useState([]);
  const [textSnippets, setTextSnippets] = useState({});
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { lang } = useLanguage();

  const snippetText = (key, fallback = '') => {
    const snippet = textSnippets[key];
    if (!snippet) return fallback;
    return preferLanguage(snippet.text, snippet.text_si, lang) || fallback;
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchAboutSections();
        const list = Array.isArray(data) ? data : (data?.results || []);
        setSections(list);
        if (list.length) {
          setSelectedSlug(list[0].slug);
        } else {
          setSelectedSlug(null);
        }
      } catch (error) {
        setSections([]);
        setSelectedSlug(null);
      } finally {
        setIsLoading(false);
      }
    })();

    (async () => {
      try {
        const data = await fetchSiteTextSnippets();
        const list = Array.isArray(data) ? data : (data?.results || []);
        const map = {};
        list.forEach((item) => {
          map[item.key] = item;
        });
        setTextSnippets(map);
      } catch (error) {
        setTextSnippets({});
      }
    })();
  }, []);

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
      { threshold: 0.1, rootMargin: '50px' }
    );

    const targets = document.querySelectorAll('[data-animate]');
    targets.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [sections.length, selectedSlug]);

  const selectedSection = selectedSlug
    ? sections.find((section) => section.slug === selectedSlug)
    : null;

  const sectionTitle = selectedSection
    ? preferLanguage(selectedSection.title, selectedSection.title_si, lang)
    : '';

  const sectionBody = selectedSection
    ? preferLanguage(selectedSection.body, selectedSection.body_si, lang)
    : '';

  const placeholderTitle = snippetText('about_section_placeholder_title', 'About this section');
  const placeholderBody = snippetText('about_section_empty', 'Content will appear here once it is added in the admin.');
  const emptyNavMessage = snippetText('about_nav_empty', 'No sections available yet.');
  const loadingMessage = snippetText('about_loading', 'Loading about page information...');

  return (
    <div className="min-h-screen bg-white flex flex-col animate-fade-in">
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <MobileMenu mobileMenuOpen={mobileMenuOpen} />
      <MainNavigation />

      <main className="mx-auto px-6 md:px-10 py-18 flex-grow flex flex-col md:flex-row gap-8">

        
        <div
          id="about-menu"
          data-animate
          className={`md:w-64 flex-shrink-0 transition-all duration-1000 transform ${
            sectionsVisible['about-menu'] ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
          }`}
        >
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 sticky top-28">
            <h2 className="text-xl font-light text-gray-900 mb-4 flex items-center">
              {snippetText('about_nav_title', 'Ministry Overview')}
            </h2>
            <nav className="flex flex-col space-y-2">
              {sections.length > 0 ? (
                sections.map((section) => {
                  const label = preferLanguage(section.nav_label, section.nav_label_si, lang) || snippetText('about_nav_untitled', 'Untitled section');
                  const isActive = selectedSlug === section.slug;
                  return (
                    <button
                      key={section.slug}
                      onClick={() => setSelectedSlug(section.slug)}
                      className={`relative flex items-center justify-start w-full px-4 py-3 rounded-lg font-light text-sm transition-all duration-300 transform ${
                        isActive ? 'text-red-800 font-light scale-105' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="flex-grow text-left">{label}</span>
                      {isActive && (
                        <span className="absolute bottom-0 left-0 h-0.5 bg-red-800 w-full animate-underline-grow"></span>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="text-sm text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-lg px-4 py-6 text-center">
                  {isLoading ? loadingMessage : emptyNavMessage}
                </div>
              )}
            </nav>
          </div>
        </div>

        <div
          id="about-content"
          data-animate
          className={`flex-grow transition-all duration-1000 transform ${
            sectionsVisible['about-content'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="text-center md:text-left mb-12">
            <h1 className="text-4xl font-light text-gray-900 mb-4 animate-slide-up">
              {sectionTitle || placeholderTitle}
            </h1>
          </div>
          {isLoading ? (
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500">
              {loadingMessage}
            </div>
          ) : selectedSection ? (
            sectionBody ? (
              <div
                className="prose lg:prose-lg text-gray-700 animate-slide-up animation-delay-200"
                dangerouslySetInnerHTML={{ __html: sectionBody }}
              />
            ) : (
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 animate-slide-up animation-delay-200">
                {placeholderBody}
              </div>
            )
          ) : (
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 animate-slide-up animation-delay-200">
              {emptyNavMessage}
            </div>
          )}
        </div>
      </main>

      <Footer />

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

        @keyframes slide-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes underline-grow {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animate-slide-left {
          animation: slide-left 0.8s ease-out;
        }

        .animate-slide-right {
          animation: slide-right 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-underline-grow {
          animation: underline-grow 0.3s ease-in-out forwards;
        }

        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-600 { animation-delay: 600ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
      `}</style>
    </div>
  );
};

export default AboutPage;
