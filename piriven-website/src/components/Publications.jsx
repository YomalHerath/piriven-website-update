'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import T from '@/components/T';
import { fetchBooks, mediaUrl } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { preferLanguage } from '@/lib/i18n';

export const PublicationsSection = () => {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState('');
  const [usedFallback, setUsedFallback] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    (async () => {
      try {
        let list = await fetchBooks({ featured: 'true', active: 'true' });
        if (!list?.length) {
          list = await fetchBooks({ active: 'true', ordering: '-published_at' });
          setUsedFallback(true);
        }
        setItems((list || []).slice(0, 2)); // keep the original two-card layout
      } catch (e) {
        setErr(e?.message || 'Failed to load publications');
      }
    })();
  }, []);

  if (err) {
    return (
      <section>
        <h2 className="text-4xl font-light text-gray-800 mb-12 tracking-wide">
          <T>Latest Publications</T>
        </h2>
        <div className="text-red-600 text-sm">Error: {err}</div>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section>
        <h2 className="text-4xl font-light text-gray-800 mb-12 tracking-wide">
          <T>Latest Publications</T>
        </h2>
        <p className="text-sm text-neutral-600"><T>No publications yet.</T></p>
      </section>
    );
  }

  return (
    <div className="animate-slide-left"> {/* <--- I added this wrapper div */}
      <section>
        <h2 className="text-4xl font-light text-gray-800 mb-12 tracking-wide">
          <T>Latest Publications</T>{' '}
          {usedFallback ? (
            <span className="align-middle text-sm font-normal text-neutral-500">
              (<T>Latest</T>)
            </span>
          ) : null}
        </h2>

        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
          {items.map((book) => {
            const cover = mediaUrl(book?.cover);
            const href = book?.external_url || mediaUrl(book?.pdf_file) || '#';
            const isExternal = Boolean(book?.external_url);
            const localizedTitle = preferLanguage(book?.title, book?.title_si, lang) || book?.title || 'Publication';
            const subtitleParts = [
              preferLanguage(book?.subtitle, book?.subtitle_si, lang),
              preferLanguage(book?.authors, book?.authors_si, lang),
              book?.year,
            ].filter(Boolean);
            const subtitle = subtitleParts.join(' - ');

            return (
              <div key={book?.id} className="w-full">
                <a
                  href={href}
                  target={isExternal ? '_blank' : '_self'}
                  rel={isExternal ? 'noreferrer' : undefined}
                  className="group block w-full overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative w-full aspect-[3/4]">
                    {cover ? (
                      <img
                        src={cover}
                        alt={localizedTitle}
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
                          {localizedTitle || <T>Untitled</T>}
                        </h3>
                        {subtitle ? (
                          <p className="text-white/90 text-xs md:text-sm font-light line-clamp-1">{subtitle}</p>
                        ) : null}

                        <div className="mt-2">
                          <button className="cursor-pointer bg-transparent border-2 border-white hover:bg-white text-white hover:text-black px-4 py-2 rounded-lg font-light text-xs transition-colors duration-300">
                            <T>View publication</T>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link href="/publications">
            <button className="cursor-pointer inline-block bg-transparent border-2 border-black hover:bg-black text-black hover:text-white px-8 py-4 rounded-lg font-light transition-colors duration-300">
              <T>Browse all publications</T>
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};