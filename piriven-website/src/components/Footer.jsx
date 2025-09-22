
'use client';

import { useEffect, useMemo, useState } from 'react';
import T from '@/components/T';
import { MapPin, Mail, Phone } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { preferLanguage } from '@/lib/i18n';
import { fetchContactInfo, fetchFooterAbout, fetchFooterLinks } from '@/lib/api';

const FALLBACK_ABOUT = {
  en: 'The State Ministry is dedicated to the development and administration of Dhamma Schools, Piriven, and Bhikku Education in Sri Lanka.',
  si: 'ශ්‍රී ලංකාවේ ධර්ම පාසල්, පිරිවෙන් සහ භික්ෂු අධ්‍යාපනය සංවර්ධනය සහ කළමනාකරණය සඳහා අපගේ අමාත්‍යාංශය කැපවී සිටී.'
};

const FALLBACK_CONTACT = {
  organization: {
    en: 'Division of Piriven Education',
    si: 'පිරිවෙන් අධ්‍යාපන අංශය',
  },
  address: {
    en: 'Isurupaya, Battaramulla, Sri Lanka',
    si: 'ඉසුරුපාය, බත්තරමුල්ල, ශ්‍රී ලංකාව',
  },
  phone: '+94 112 785 141',
  email: 'info@moe.gov.lk',
  mapSrc: 'https://www.google.com/maps?q=Isurupaya,+Battaramulla,+Sri+Lanka&hl=en&z=16&output=embed',
};

const FALLBACK_LINKS = [
  { id: 'moe', name: 'Ministry of Education', url: 'https://moe.gov.lk/' },
  { id: 'doe', name: 'Department of Examinations', url: 'https://doenets.lk/' },
  { id: 'nie', name: 'National Institute of Education', url: 'https://nie.lk/' },
  { id: 'ugc', name: 'University Grants Commission', url: 'https://ugc.ac.lk/' },
];

export const Footer = () => {
  const { lang } = useLanguage();
  const isSinhala = lang === 'si';

  const [aboutEntries, setAboutEntries] = useState([]);
  const [footerLinks, setFooterLinks] = useState([]);
  const [contactInfo, setContactInfo] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const results = await Promise.allSettled([
        fetchFooterAbout(),
        fetchFooterLinks(),
        fetchContactInfo(),
      ]);

      if (cancelled) return;

      const [aboutResult, linksResult, contactResult] = results;

      const aboutList = aboutResult.status === 'fulfilled'
        ? (Array.isArray(aboutResult.value) ? aboutResult.value : (aboutResult.value?.results || []))
        : [];
      setAboutEntries(aboutList);

      const linksList = linksResult.status === 'fulfilled'
        ? (Array.isArray(linksResult.value) ? linksResult.value : (linksResult.value?.results || []))
        : [];
      setFooterLinks(linksList);

      const contactList = contactResult.status === 'fulfilled'
        ? (Array.isArray(contactResult.value) ? contactResult.value : (contactResult.value?.results || []))
        : [];
      setContactInfo(contactList.length ? contactList[0] : null);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const aboutContent = useMemo(() => {
    if (aboutEntries.length) {
      const entry = aboutEntries.find((item) => item && (item.body || item.body_si || item.title || item.title_si));
      if (entry) {
        return {
          title: preferLanguage(entry.title, entry.title_si, lang) || (isSinhala ? 'අප ගැන' : 'About Us'),
          body: preferLanguage(entry.body, entry.body_si, lang) || FALLBACK_ABOUT[isSinhala ? 'si' : 'en'],
        };
      }
    }

    return {
      title: isSinhala ? 'අප ගැන' : 'About Us',
      body: FALLBACK_ABOUT[isSinhala ? 'si' : 'en'],
    };
  }, [aboutEntries, isSinhala, lang]);

  const quickLinks = useMemo(() => {
    const source = footerLinks.length ? footerLinks : FALLBACK_LINKS;
    return source.map((link, index) => ({
      id: link.id ?? index,
      name: preferLanguage(link.name, link.name_si, lang) || link.name,
      url: link.url || '#',
    }));
  }, [footerLinks, lang]);

  const contact = useMemo(() => {
    if (contactInfo) {
      const organization = preferLanguage(contactInfo.organization, contactInfo.organization_si, lang)
        || FALLBACK_CONTACT.organization[isSinhala ? 'si' : 'en'];
      const address = preferLanguage(contactInfo.address, contactInfo.address_si, lang)
        || FALLBACK_CONTACT.address[isSinhala ? 'si' : 'en'];

      return {
        organization,
        address,
        phone: contactInfo.phone || FALLBACK_CONTACT.phone,
        email: contactInfo.email || FALLBACK_CONTACT.email,
        mapUrl: contactInfo.map_url || FALLBACK_CONTACT.mapSrc,
        mapEmbed: contactInfo.map_embed || '',
      };
    }

    return {
      organization: FALLBACK_CONTACT.organization[isSinhala ? 'si' : 'en'],
      address: FALLBACK_CONTACT.address[isSinhala ? 'si' : 'en'],
      phone: FALLBACK_CONTACT.phone,
      email: FALLBACK_CONTACT.email,
      mapUrl: FALLBACK_CONTACT.mapSrc,
      mapEmbed: '',
    };
  }, [contactInfo, isSinhala, lang]);

  return (
    <footer className="relative bg-gray-900 text-gray-300">
      <div className="absolute inset-0 bg-black pointer-events-none" />

      <div className="relative container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h4 className="font-bold text-xl mb-6 bg-yellow-300 bg-clip-text text-transparent">
              {aboutContent.title}
            </h4>
            <p className="leading-relaxed text-gray-400 hover:text-gray-200 transition-colors duration-300 whitespace-pre-line">
              {aboutContent.body}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-xl mb-6 bg-yellow-300 bg-clip-text text-transparent">
              {isSinhala ? 'ඉක්මන් සබැඳි' : 'Quick Links'}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.url}
                    className="group inline-block transition-all duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="relative text-gray-400 group-hover:text-yellow-300 transition-colors duration-300">
                      {link.name}
                    </span>
                    <span className="block h-[2px] max-w-0 group-hover:max-w-full bg-yellow-400 transition-all duration-500" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xl mb-6 bg-yellow-300 bg-clip-text text-transparent">
              {isSinhala ? 'අදහස් හා විමසුම්' : 'Contact Us'}
            </h4>
            <div className="space-y-4">
              <div className="text-sm text-gray-400 uppercase tracking-wide font-semibold">
                {contact.organization}
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-1 text-yellow-300" />
                <span>{contact.address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-yellow-300" />
                <a href={`mailto:${contact.email}`} className="text-gray-300 hover:text-yellow-300 transition-colors duration-300">
                  {contact.email}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-yellow-300" />
                <a href={`tel:${contact.phone}`} className="text-gray-300 hover:text-yellow-300 transition-colors duration-300">
                  {contact.phone}
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-xl mb-6 bg-yellow-300 bg-clip-text text-transparent">
              {isSinhala ? 'ස්ථානය' : 'Location'}
            </h4>
            <div className="w-full h-42 rounded-lg overflow-hidden shadow-lg">
              {contact.mapEmbed ? (
                <div
                  className="h-full w-full"
                  dangerouslySetInnerHTML={{ __html: contact.mapEmbed }}
                />
              ) : (
                <iframe
                  src={contact.mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location map"
                />
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-500 text-sm hover:text-gray-300 transition-colors duration-300">
            © {new Date().getFullYear()} State Ministry of Dhamma School, Piriven & Bhikku Education.{' '}
            <T>All Rights Reserved.</T>
          </p>
        </div>
      </div>
    </footer>
  );
};
