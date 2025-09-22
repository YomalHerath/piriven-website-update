import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { preferLanguage } from '@/lib/i18n';

export const RightSideLink = ({ icon, text, textSi, url }) => {
  const { lang } = useLanguage();
  const label = preferLanguage(text, textSi, lang);
  return (
    <a 
      href={url || '#'} 
      target={url ? '_blank' : undefined} 
      rel={url ? 'noopener noreferrer' : undefined} 
      className="flex items-center space-x-3 group transition-all duration-300 transform hover:scale-105"
    >
      {React.cloneElement(icon, { 
        className: 'text-gray-600 w-6 h-6 group-hover:text-red-800 transition-colors duration-300' 
      })}
      <span className="relative text-lg font-light text-gray-800 group-hover:text-red-800 transition-colors duration-300">
        {label}
        <span 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-red-800 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"
        ></span>
      </span>
    </a>
  );
};