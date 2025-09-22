'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ChevronLeft, ChevronRight, BookOpen, Users, GraduationCap, Link as LinkIcon } from 'lucide-react';
import { Header } from './Header';
import { MobileMenu } from './MobileMenu';
import { HeroSlider } from './HeroSlider';
import { MainNavigation } from './MainNavigation';
import { StatCard } from './StatCard';
import { NewsCard } from './NewsCard';
import { GallerySlider } from './GallerySlider';
import { NoticeCard } from './NoticeCard';
import { RightSideLink } from './RightSideLink';
import { CalendarComponent } from './Calendar';
import { PublicationsSection } from './Publications';
import { VideosSection } from './Videos';
import { NewsletterSection } from './NewsLetter';
import { Footer } from './Footer';
import T from '@/components/T';
import { fetchSlides, fetchNews, fetchFeaturedNews, fetchNotices, fetchVideos, fetchStats, fetchLinks, fetchAlbums, fetchHeroIntro, fetchSiteTextSnippets, mediaUrl } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { preferLanguage } from '@/lib/i18n';

// Swiper imports removed as per request

const ModernMinistryWebsite = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [gallerySlide, setGallerySlide] = useState(0);
  const [newsSlide, setNewsSlide] = useState(0); // Restored from the first file
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sectionsVisible, setSectionsVisible] = useState({});
  const { lang } = useLanguage();
  const router = useRouter();

  const [data, setData] = useState({
    heroIntro: null,
    textSnippets: {},
    slides: [],
    news: [],
    notices: [],
    videos: [],
    stats: [],
    links: [],
    albums: [],
  });

  const {
    heroIntro,
    textSnippets,
    slides: rawSlides,
    news: rawNews,
    notices: rawNotices,
    videos: rawVideos,
    stats: rawStats,
    links: rawLinks,
    albums: rawAlbums,
  } = data;

  const snippetText = (key, fallback = '') => {
    const snippet = textSnippets[key];
    if (!snippet) return fallback;
    return preferLanguage(snippet.text, snippet.text_si, lang) || fallback;
  };

  const heroHeading = heroIntro ? preferLanguage(heroIntro.heading, heroIntro.heading_si, lang) : '';
  const heroHighlight = heroIntro ? preferLanguage(heroIntro.highlight, heroIntro.highlight_si, lang) : '';
  const heroDescription = heroIntro ? preferLanguage(heroIntro.description, heroIntro.description_si, lang) : '';
  const heroPrimaryLabel = heroIntro ? preferLanguage(heroIntro.primary_label, heroIntro.primary_label_si, lang) : '';
  const heroSecondaryLabel = heroIntro ? preferLanguage(heroIntro.secondary_label, heroIntro.secondary_label_si, lang) : '';
  const heroPrimaryUrl = heroIntro?.primary_url || 'hero-intro';
  const heroSecondaryUrl = heroIntro?.secondary_url || '#';

  const fallbackHeroHeading = snippetText('home_hero_heading', '');
  const fallbackHeroHighlight = snippetText('home_hero_highlight', '');
  const fallbackHeroDescription = snippetText('home_hero_description', '');
  const fallbackPrimaryLabel = snippetText('home_hero_primary_label', '');
  const fallbackSecondaryLabel = snippetText('home_hero_secondary_label', '');
  const emptyHeroMessage = snippetText('home_hero_empty', 'Welcome section content will appear here once configured in the admin.');

  const resolvedHeading = heroIntro ? (heroHeading || fallbackHeroHeading) : '';
  const resolvedHighlight = heroIntro ? (heroHighlight || fallbackHeroHighlight) : '';
  const resolvedDescription = heroIntro ? (heroDescription || fallbackHeroDescription) : '';
  const resolvedPrimaryLabel = heroIntro ? (heroPrimaryLabel || fallbackPrimaryLabel) : '';
  const resolvedSecondaryLabel = heroIntro ? (heroSecondaryLabel || fallbackSecondaryLabel) : '';
  const HERO_DESCRIPTION_PREVIEW_LIMIT = 650;

  const heroDescriptionPreview = useMemo(() => {
    if (!resolvedDescription) return '';
    const cleaned = resolvedDescription.replace(/\s+/g, ' ').trim();
    if (cleaned.length <= HERO_DESCRIPTION_PREVIEW_LIMIT) return cleaned;
    const snippet = cleaned.slice(0, HERO_DESCRIPTION_PREVIEW_LIMIT).trim();
    return snippet.replace(/[\s\p{P}]+$/u, '') + '…';
  }, [resolvedDescription]);

  const mainSlides = useMemo(() => {
    if (!Array.isArray(rawSlides) || !rawSlides.length) return [];
    return [...rawSlides]
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map((slide) => ({
        image: mediaUrl(slide.image),
        title: preferLanguage(slide.title, slide.title_si, lang),
        subtitle: preferLanguage(slide.subtitle, slide.subtitle_si, lang),
      }));
  }, [rawSlides, lang]);

  const newsItems = useMemo(() => {
    if (!Array.isArray(rawNews) || !rawNews.length) return [];
    return rawNews.slice(0, 6).map((n, index) => {
      const title = preferLanguage(n.title, n.title_si, lang);
      const slug = n.slug || (n.id ? String(n.id) : '');
      const publishedAt = n.published_at ? new Date(n.published_at) : null;
      return {
        id: n.id ?? index,
        slug,
        href: slug ? `/news/${slug}` : '#',
        title,
        image: n.image ? mediaUrl(n.image) : `/images/newsItem${(index % 6) + 1}.jpg`,
        date: publishedAt
          ? publishedAt.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
          : '',
        time: publishedAt
          ? publishedAt.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
          : '',
      };
    });
  }, [rawNews, lang]);

  // Function to get visible news items (restored)
  const getVisibleNewsItems = () => {
    if (newsItems.length === 0) return [];
    if (newsItems.length <= 3) return newsItems;
    
    const items = [];
    for (let i = 0; i < 3; i++) {
      const index = (newsSlide + i) % newsItems.length;
      items.push(newsItems[index]);
    }
    return items;
  };

  const notices = useMemo(() => {
    if (!Array.isArray(rawNotices) || !rawNotices.length) return [];
    return rawNotices.slice(0, 8).map((n, index) => {
      const published = n.published_at ? new Date(n.published_at) : null;
      return {
        id: n.id ?? index,
        href: n.id ? `/notices/${n.id}` : n.url || '#',
        title: preferLanguage(n.title, n.title_si, lang),
        image: n.image ? mediaUrl(n.image) : '',
        date: published ? published.toDateString() : '',
      };
    });
  }, [rawNotices, lang]);

  useEffect(() => {
    if (!newsItems.length) return;
    newsItems.slice(0, 6).forEach((item) => {
      if (item.href && item.href.startsWith('/news/') && router && typeof router.prefetch === 'function') {
        try { router.prefetch(item.href); } catch {}
      }
    });
  }, [newsItems, router]);

  useEffect(() => {
    if (!notices.length) return;
    notices.slice(0, 6).forEach((item) => {
      if (item.href && item.href.startsWith('/notices/') && router && typeof router.prefetch === 'function') {
        try { router.prefetch(item.href); } catch {}
      }
    });
  }, [notices, router]);

  const videoList = useMemo(() => {
    if (!Array.isArray(rawVideos) || !rawVideos.length) return [];
    return rawVideos.map((v, index) => ({
      ...v,
      id: v.id ?? index,
      title: preferLanguage(v.title, v.title_si, lang),
      description: preferLanguage(v.description, v.description_si, lang),
    }));
  }, [rawVideos, lang]);

  const stats = useMemo(() => {
    if (!Array.isArray(rawStats) || !rawStats.length) return [];
    return rawStats.map((s, index) => ({
      number: preferLanguage(s.value, s.value_si, lang) || s.value,
      label: preferLanguage(s.label, s.label_si, lang),
      icon: [
        <BookOpen className="w-12 h-12" />,
        <Users className="w-12 h-12" />,
        <GraduationCap className="w-12 h-12" />,
        <Users className="w-12 h-12" />,
      ][index % 4],
    }));
  }, [rawStats, lang]);

  const quickLinks = useMemo(() => {
    if (!Array.isArray(rawLinks) || !rawLinks.length) return [];
    return rawLinks.map((link, index) => ({
      ...link,
      id: link.id ?? index,
      name: preferLanguage(link.name, link.name_si, lang),
    }));
  }, [rawLinks, lang]);

  const galleryImages = useMemo(() => {
    if (!Array.isArray(rawAlbums) || !rawAlbums.length) return [];
    const albumWithImages = rawAlbums.find((album) => Array.isArray(album.images) && album.images.length);
    if (!albumWithImages) return [];
    return albumWithImages.images.map((img) => mediaUrl(img.image));
  }, [rawAlbums]);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const results = await Promise.allSettled([
          fetchHeroIntro(),
          fetchSiteTextSnippets(),
          fetchSlides(),
          fetchFeaturedNews(),
          fetchNotices(),
          fetchVideos(),
          fetchStats(),
          fetchLinks(),
          fetchAlbums(),
        ]);

        if (cancelled) return;

        const [
          heroResult,
          snippetResult,
          slidesResult,
          newsResult,
          noticesResult,
          videosResult,
          statsResult,
          linksResult,
          albumsResult,
        ] = results;

        const heroList = heroResult.status === 'fulfilled'
          ? (Array.isArray(heroResult.value)
              ? heroResult.value
              : (heroResult.value?.results ?? []))
          : [];
        const heroIntro = heroList.length ? heroList[0] : null;

        const snippetsList = snippetResult.status === 'fulfilled'
          ? (Array.isArray(snippetResult.value)
              ? snippetResult.value
              : (snippetResult.value?.results ?? []))
          : [];
        const snippetsMap = snippetsList.reduce((acc, item) => {
          if (item?.key) acc[item.key] = item;
          return acc;
        }, {});

        const slides = slidesResult.status === 'fulfilled'
          ? (Array.isArray(slidesResult.value)
              ? slidesResult.value
              : (slidesResult.value?.results ?? []))
          : [];

        const news = newsResult.status === 'fulfilled'
          ? (Array.isArray(newsResult.value)
              ? newsResult.value
              : (newsResult.value?.results ?? []))
          : [];

        const notices = noticesResult.status === 'fulfilled'
          ? (Array.isArray(noticesResult.value)
              ? noticesResult.value
              : (noticesResult.value?.results ?? []))
          : [];

        const videos = videosResult.status === 'fulfilled'
          ? (Array.isArray(videosResult.value)
              ? videosResult.value
              : (videosResult.value?.results ?? []))
          : [];

        const stats = statsResult.status === 'fulfilled'
          ? (Array.isArray(statsResult.value)
              ? statsResult.value
              : (statsResult.value?.results ?? []))
          : [];

        const links = linksResult.status === 'fulfilled'
          ? (Array.isArray(linksResult.value)
              ? linksResult.value
              : (linksResult.value?.results ?? []))
          : [];

        const albums = albumsResult.status === 'fulfilled'
          ? (Array.isArray(albumsResult.value)
              ? albumsResult.value
              : (albumsResult.value?.results ?? []))
          : [];

        setData({
          heroIntro,
          textSnippets: snippetsMap,
          slides,
          news,
          notices,
          videos,
          stats,
          links,
          albums,
        });
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (isLoading) return;

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
      { threshold: 0.1, rootMargin: '50px' },
    );

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [isLoading]);

  useEffect(() => {
    if (!galleryImages.length) {
      setGallerySlide(0);
      return;
    }

    setGallerySlide((prev) => (prev >= galleryImages.length ? 0 : prev));
  }, [galleryImages.length]);

  useEffect(() => {
    if (galleryImages.length < 2) return;

    const timer = setInterval(() => {
      setGallerySlide((prev) => (prev + 1) % galleryImages.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [galleryImages.length]);

  // Restored news carousel timer
  useEffect(() => {
    if (newsItems.length < 4) return;
    const newsTimer = setInterval(() => {
      setNewsSlide((prev) => (prev + 1) % newsItems.length);
    }, 4000);
    return () => clearInterval(newsTimer);
  }, [newsItems.length]);
  
  useEffect(() => {
    setCurrentSlide((prev) => (mainSlides.length ? Math.min(prev, mainSlides.length - 1) : 0));
  }, [mainSlides.length]);

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <Header 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />
      <MobileMenu mobileMenuOpen={mobileMenuOpen} />
      <MainNavigation />
      <HeroSlider mainSlides={mainSlides} currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} />
      
      
      <main className="mx-auto px-6 md:px-10 py-18">
        
        {/* Welcome Section */}
        <section 
          id="welcome"
          data-animate
          className={`grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16 transition-all duration-1000 transform ${
            sectionsVisible.welcome 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="space-y-8">
            {heroIntro ? (
              <>
                {(resolvedHeading || resolvedHighlight) ? (
                  <h2 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight animate-slide-up tracking-wide">
                    {resolvedHeading ? <span className="block">{resolvedHeading}</span> : null}
                    {resolvedHighlight ? (
                      <span className="block bg-gradient-to-r from-red-500 via-blue-500 to-yellow-400 bg-clip-text text-transparent animate-gradient-x mt-2">
                        {resolvedHighlight}
                      </span>
                    ) : null}
                  </h2>
                ) : null}
                <p className="text-gray-600 leading-relaxed text-lg animate-slide-up animation-delay-200 font-light">
                  {heroDescriptionPreview || emptyHeroMessage}
                </p>
                {(resolvedPrimaryLabel || resolvedSecondaryLabel) ? (
                  <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0 animate-slide-up animation-delay-400">
                    {resolvedPrimaryLabel ? (
                      <Link href={heroPrimaryUrl}>
                        <button className="cursor-pointer bg-red-800 hover:bg-black text-white px-8 py-4 rounded-lg font-light transition-colors duration-300 border-2 border-transparent">
                          {resolvedPrimaryLabel}
                        </button>
                      </Link>
                    ) : null}
                    {resolvedSecondaryLabel ? (
                      <Link href={heroSecondaryUrl}>
                        <button className="cursor-pointer bg-transparent border-2 border-black hover:bg-black text-black hover:text-white px-8 py-4 rounded-lg font-light transition-colors duration-300">
                          {resolvedSecondaryLabel}
                        </button>
                      </Link>
                    ) : null}
                  </div>
                ) : null}
              </>
            ) : (
              <div className="bg-white border border-dashed border-gray-300 rounded-lg p-8 shadow-sm animate-slide-up">
                <p className="text-gray-500 text-lg font-light">{emptyHeroMessage}</p>
              </div>
            )}
          </div>
          <div className="animate-slide-up animation-delay-600">
            <GallerySlider galleryImages={galleryImages} gallerySlide={gallerySlide} setGallerySlide={setGallerySlide} />
          </div>
        </section>

        {/* Stats Section */}
        <section
          id="stats"
          data-animate
          className={`py-20 transition-all duration-1000 transform -mx-6 md:-mx-10 ${
            sectionsVisible.stats ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="block bg-gradient-to-r from-red-800 via-blue-500 to-yellow-400 animate-gradient-x px-6 md:px-10 py-16 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="animate-scale-up" style={{ animationDelay: `${index * 200}ms`, animationFillMode: 'both' }}>
                  <StatCard stat={stat} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* News Section (Restored to original logic) */}
        <section
          id="news"
          data-animate
          className={`grid grid-cols-1 lg:grid-cols-3 gap-16 py-20 transition-all duration-1000 transform ${
            sectionsVisible.news
              ? 'translate-y-0 opacity-100'
              : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="lg:col-span-2">
            <h2 className="text-4xl font-light text-gray-800 mb-12 tracking-wide animate-slide-up">
              {snippetText('homepage_latest_news_title', 'Latest News')}
            </h2>
            <div 
              className="relative"
            >
              <div 
                className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(0%)` }}
              >
                {getVisibleNewsItems().map((news, index) => (
                  <div
                    key={`${news.id}-${newsSlide}-${index}`}
                    className={`transition-all duration-500 ease-out transform ${
                      sectionsVisible.news 
                        ? 'translate-y-0 opacity-100' 
                        : 'translate-y-4 opacity-0'
                    }`}
                    style={{ transitionDelay: `${index * 100 + 200}ms` }}
                  >
                    <NewsCard news={news} />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Link
                href="/news"
                className="inline-block bg-transparent border-2 border-black hover:bg-black text-black hover:text-white px-8 py-4 rounded-lg font-light transition-colors duration-300"
              >
                {snippetText('homepage_latest_news_cta', 'View All News')}
              </Link>
            </div>
          </div>
          <div className="lg:col-span-1 animate-slide-up animation-delay-300">
            <h2 className="text-4xl font-light text-gray-800 mb-8 tracking-wide">{snippetText('homepage_notices_title', 'Notices')}</h2>
            <div className="bg-white rounded-lg p-6 shadow-lg h-96 overflow-y-auto hover:shadow-xl transition-shadow duration-300">
              <div className="space-y-6">
                <NoticeCard items={notices} />
              </div>
            </div>
            <div className="text-center mt-10">
              <Link
                href="/notices"
                className="inline-block bg-transparent border-2 border-black hover:bg-black text-black hover:text-white px-8 py-4 rounded-lg font-light transition-colors duration-300"
              >
                {snippetText('homepage_notices_cta', 'View All Notices')}
              </Link>
            </div>
          </div>
        </section>

        {/* Publications and Videos Section */}
        <section
  id="media"
  data-animate
  className={`py-20 transition-all duration-1000 transform ${
    sectionsVisible.media
      ? 'translate-y-0 opacity-100'
      : 'translate-y-10 opacity-0'
  }`}
>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
    <div className="animate-slide-left">
      <PublicationsSection />
    </div>
    <div className="animate-slide-right animation-delay-300">
      <VideosSection videos={videoList} />
    </div>
  </div>
</section>
        {/* Calendar and Links Section */}
        <section 
          id="calendar"
          data-animate
          className={`py-20 transition-all duration-1000 transform ${
            sectionsVisible.calendar 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 animate-slide-up">
              <h2 className="text-4xl font-light text-gray-800 mb-12 tracking-wide">{snippetText('homepage_calendar_title', 'Calendar')}</h2>
              <div className="bg-white rounded-lg shadow-xl p-8 hover:shadow-2xl transition-shadow duration-500">
                <CalendarComponent />
              </div>
            </div>
            <div className="lg:col-span-1 space-y-8 animate-slide-up animation-delay-300">
              <div className="space-y-6">
                {quickLinks.map((link, index) => (
                  <div key={index} className="animate-slide-right" style={{ animationDelay: `${index * 150 + 600}ms`, animationFillMode: 'both' }}>
                    <RightSideLink icon={<LinkIcon className="text-white w-6 h-6" />} text={link.name} textSi={link.name_si} url={link.url} />
                  </div>
                ))}
              </div>
              <div className="animate-fade-in animation-delay-1000">
                <NewsletterSection />
              </div>
            </div>
          </div>
        </section>
        
      </main>
      
      <Footer />

      {/* Custom CSS animations */}
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

        @keyframes scale-up {
          from { 
            opacity: 0;
            transform: scale(0.8);
          }
          to { 
            opacity: 1;
            transform: scale(1);
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

        

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animate-slide-left {
          animation: slide-left 0.8s ease-out;
        }

        .animate-slide-right {
          animation: slide-right 0.8s ease-out;
        }

        .animate-scale-up {
          animation: scale-up 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }

        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-600 { animation-delay: 600ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }

        /* Fixes for Swiper layout and hover */
        .swiper-wrapper {
          align-items: stretch;
        }
        .swiper-slide {
          height: auto;
        }
      `}</style>
    </div>
  );
};

export default ModernMinistryWebsite;
