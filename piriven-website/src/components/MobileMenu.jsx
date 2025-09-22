'use client';

import React from 'react';
import { Home, Info, Download, Mail } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Phone, Globe } from 'lucide-react';
import T from '@/components/T';
import { useLanguage } from '@/context/LanguageContext';
import { preferLanguage } from '@/lib/i18n';

export const MobileMenu = ({ mobileMenuOpen }) => {
  const pathname = usePathname();
  const { lang, setLang } = useLanguage();

  const handleLanguageChange = (newLang) => {
    setLang(newLang);
  };

  const navItems = [
    { href: '/', label: 'HOME', Icon: Home },
    { href: '/about', label: 'ABOUT US', Icon: Info },
    { href: '/downloads', label: 'DOWNLOADS', Icon: Download },
    { href: '/contact', label: 'CONTACT US', Icon: Mail },
  ];

  return (
    <div
      className={`relative md:hidden top-0 left-0 right-0 z-40 bg-red-800 transform transition-all duration-500 ease-in-out overflow-hidden ${
        mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <ul className="flex flex-col space-y-2 p-4">
        {navItems.map(({ href, label, Icon }, index) => {
          const active = pathname === href;

          return (
            <li
              key={href}
              style={{ transitionDelay: `${index * 100}ms` }}
              className={`transform transition-all duration-300 ${
                mobileMenuOpen
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 -translate-y-4'
              }`}
            >
              <Link
                href={href}
                className={`flex w-full items-center space-x-3 px-4 py-3 font-light tracking-widest uppercase text-sm transition-colors duration-300 ${
                  active
                    ? 'bg-red-900 text-yellow-300'
                    : 'text-white hover:bg-red-700 hover:text-yellow-300'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-colors duration-300 ${
                    active ? 'text-yellow-300' : 'text-white'
                  }`}
                />
                <T>{label}</T>
              </Link>
            </li>
          );
        })}

        <li
          style={{ transitionDelay: `${navItems.length * 100}ms` }}
          className={`transform transition-all duration-300 ${
            mobileMenuOpen
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-4'
          }`}
        >
          <div className="h-px bg-white/20 my-2"></div>
          <a
            href="https://pdms.moe.gov.lk/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center space-x-3 px-4 py-3 font-light tracking-widest uppercase text-sm transition-colors duration-300 text-white hover:bg-red-700 hover:text-yellow-300"
          >
            <Phone className="w-5 h-5 text-white transition-colors duration-300" />
            <span>PDMS</span>
          </a>
        </li>

        <li
          style={{ transitionDelay: `${(navItems.length + 1) * 100}ms` }}
          className={`transform transition-all duration-300 ${
            mobileMenuOpen
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-4'
          }`}
        >
          <div className="h-px bg-white/20 my-2"></div>
          <div className="flex w-full items-center space-x-3 px-4 py-3 transition-colors duration-300">
            <Globe className="w-5 h-5 text-white" />
            <div className="flex-1 flex justify-evenly">
              <Link href="/" onClick={() => handleLanguageChange('si')}>
                <button className={`text-sm font-light hover:text-yellow-300 transition-colors duration-300 ${lang === 'si' ? 'text-yellow-300' : 'text-white'}`}>
                  සිංහල
                </button>
              </Link>
              <div className="h-4 w-px bg-gray-400"></div>
              <Link href="/" onClick={() => handleLanguageChange('en')}>
                <button className={`text-sm font-light hover:text-yellow-300 transition-colors duration-300 ${lang === 'en' ? 'text-yellow-300' : 'text-white'}`}>
                  English
                </button>
              </Link>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};