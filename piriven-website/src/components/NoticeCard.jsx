import React from 'react';
import Link from 'next/link';
import { Calendar } from 'lucide-react';

export const NoticeCard = ({ items }) => {
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="text-sm text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-xl px-4 py-6 text-center">
        No notices available at the moment.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((notice) => {
        const href = notice.href || notice.url || '#';
        const isExternal = Boolean(notice.url && !notice.href);

        const handleStorePreview = () => {
          if (isExternal) return;
          if (typeof window === 'undefined') return;
          try {
            const key = `notice-preview:${notice.id || notice.slug || href}`;
            sessionStorage.setItem(key, JSON.stringify(notice));
          } catch {}
        };

        return (
          <div
            key={notice.id || notice.slug || `${notice.title}-${notice.published_at}`}
            className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-300 group"
          >
            <div className="w-16 h-12 bg-gray-200 rounded-lg flex-shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
            {notice.image ? (
              <img
                src={notice.image}
                alt={notice.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : null}
          </div>
          <div>
            <Link
              href={href}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              prefetch={!isExternal}
              onClick={handleStorePreview}
              className="text-gray-700 hover:text-red-800 font-semibold line-clamp-2 transition-colors duration-300"
            >
              {notice.title}
            </Link>
            <p className="text-sm text-gray-500 mt-2 flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {notice.date || ''}
            </p>
          </div>
        </div>
        );
      })}
    </div>
  );
};
