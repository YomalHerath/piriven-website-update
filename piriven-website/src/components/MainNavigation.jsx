'use client';

import React from 'react';
import { Home, Info, Download, Mail } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import T from '@/components/T';

export const MainNavigation = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'HOME', Icon: Home },
    { href: '/about', label: 'ABOUT US', Icon: Info },
    { href: '/downloads', label: 'DOWNLOADS', Icon: Download },
    { href: '/contact', label: 'CONTACT US', Icon: Mail },
  ];

  return (
    <nav className="bg-red-800 shadow-md relative z-20">
      <div className="container mx-auto px-4 md:px-8">
        <ul className="hidden md:flex justify-center space-x-12 text-white">
          {navItems.map(({ href, label, Icon }) => {
            const active = pathname === href;

            return (
              <li key={href} className="relative group">
                <Link
                  href={href}
                  className={`flex items-center space-x-2 py-4 font-light tracking-widest text-sm uppercase transition-all duration-300 ${
                    active ? 'text-yellow-300' : 'text-white hover:text-yellow-300'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors duration-300 ${
                      active ? 'text-yellow-300' : 'text-white group-hover:text-yellow-300'
                    }`}
                  />
                  <T>{label}</T>
                </Link>

                {/* Underline */}
                <span
                  className={`absolute left-0 bottom-0 h-0.5 transform origin-left transition-transform duration-300 ${
                    active
                      ? 'w-full bg-yellow-300 scale-x-100'
                      : 'w-full bg-yellow-300 scale-x-0 group-hover:scale-x-100'
                  }`}
                ></span>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};