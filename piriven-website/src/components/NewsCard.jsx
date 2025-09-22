// components/newsCard.jsx
import React from 'react';
import Link from 'next/link';
import { Calendar, ExternalLink, ChevronRight } from 'lucide-react';

const baseClasses = 'group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2';

export const NewsCard = ({ news = {} }) => {
  const href = news.href || (news.slug ? `/news/${news.slug}` : news.id ? `/news/${news.id}` : '#');
  const isLinkable = href && href !== '#';
  const dateParts = (news.date || '').split(' ');
  const day = dateParts[0] || '';
  const rest = dateParts.length > 1 ? dateParts.slice(1).join(' ') : '';

  const handleStorePreview = () => {
    if (!isLinkable || !news) return;
    if (typeof window === 'undefined') return;
    try {
      const key = `news-preview:${news.slug || news.id || href}`;
      sessionStorage.setItem(key, JSON.stringify(news));
    } catch {}
  };

  const CardContent = () => (
    <>
      <div
        className="h-48 relative overflow-hidden bg-cover bg-center bg-neutral-200"
        style={{ backgroundImage: news.image ? `url(${news.image})` : undefined }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
        {(day || rest) ? (
          <div className="absolute top-4 left-4 bg-black/70 text-white text-center rounded-lg px-3 py-2 backdrop-blur-sm">
            <p className="font-bold text-lg">{day}</p>
            <p className="text-xs opacity-90">{rest}</p>
          </div>
        ) : null}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
            <ExternalLink className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-red-800 transition-colors duration-300">
          {news.title}
        </h3>
        <p className="text-sm text-gray-500 mb-4 flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          {news.time}
        </p>
        <span className="text-red-800 text-sm font-semibold hover:text-red-800 transition-colors duration-300 flex items-center">
          VIEW DETAIL
          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
        </span>
      </div>
    </>
  );

  if (!isLinkable) {
    return (
      <div className={baseClasses}>
        <CardContent />
      </div>
    );
  }

  return (
    <Link href={href} prefetch onClick={handleStorePreview} className={`${baseClasses} block`}>
      <CardContent />
    </Link>
  );
};
