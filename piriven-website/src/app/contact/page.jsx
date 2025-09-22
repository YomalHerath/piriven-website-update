'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MainNavigation } from '@/components/MainNavigation';
import { MobileMenu } from '@/components/MobileMenu';
import { sendContact } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

const CONTACT_DATA = {
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

const ContactPage = () => {
  const { lang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sectionsVisible, setSectionsVisible] = useState({});
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const isSinhala = lang === 'si';
  const organization = CONTACT_DATA.organization[isSinhala ? 'si' : 'en'];
  const address = CONTACT_DATA.address[isSinhala ? 'si' : 'en'];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
        if (entry.isIntersecting) {
            setSectionsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <MobileMenu mobileMenuOpen={mobileMenuOpen} />
      <MainNavigation />

      <main className="mx-auto px-6 md:px-10 py-18">
        <section
          id="contact-header"
          data-animate
          className={`transition-all duration-1000 transform ${
            sectionsVisible['contact-header'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h1 className="text-4xl font-light text-gray-800 mb-8 animate-slide-up">
            {isSinhala ? 'ඇමතුම්' : 'Contact Us'}
          </h1>
          <p className="text-lg font-light text-gray-600 animate-slide-up animation-delay-200">
            {isSinhala
              ? 'නවතම තොරතුරු, විමසීම් සහ යෝජනා සඳහා පහත තොරතුරු භාවිතා කරන්න.'
              : 'Use the information below to reach us with your inquiries, suggestions, or official correspondence.'}
          </p>
        </section>

        <section
          id="contact-form"
          data-animate
          className={`mt-10 grid grid-cols-1 md:grid-cols-2 gap-12 transition-all duration-1000 transform ${
            sectionsVisible['contact-form'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div>
            <h2 className="text-2xl font-light text-gray-800 mb-4">
              {isSinhala ? 'අප වෙත පණිවිඩයක් යවන්න' : 'Send us a message'}
            </h2>
            <p className="font-light text-gray-600 mb-6">
              {isSinhala ? ' හැකි ඉක්මනින් ඔබට පිළිතුරු ලබාදෙන්නෙමු.' : 'We’ll get back to you as soon as possible.'}
            </p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setSubmitting(true);
                setError('');
                try {
                  await sendContact(form);
                  setSubmitted(true);
                  setForm({ name: '', email: '', subject: '', message: '' });
                } catch (err) {
                  setError(isSinhala ? 'පණිවිඩය යැවීමට බෑ විය. නැවත උත්සාහ කරන්න.' : 'Failed to send message. Please try again.');
                } finally {
                  setSubmitting(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-light text-gray-700">{isSinhala ? 'නම' : 'Name'}</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-red-800"
                />
              </div>
              <div>
                <label className="block text-sm font-light text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 text-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-800"
                />
              </div>
              <div>
                <label className="block text-sm font-light text-gray-700">{isSinhala ? 'මාතෘකා' : 'Subject'}</label>
                <input
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 text-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-800"
                />
              </div>
              <div>
                <label className="block text-sm font-light text-gray-700">{isSinhala ? 'පණිවිඩය' : 'Message'}</label>
                <textarea
                  required
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 text-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-800"
                />
              </div>
              {error && <p className="text-red-700 text-sm font-light">{error}</p>}
              {submitted && (
                <p className="text-green-700 text-sm font-light">
                  {isSinhala ? 'ඔබගේ පණිවිඩය අප වෙත ලැබී ඇත. ස්තුතියි!' : 'Thanks! Your message has been sent.'}
                </p>
              )}
              <button
                disabled={submitting}
                className="bg-red-800 disabled:opacity-60 hover:bg-black text-white px-8 py-3 rounded-lg font-light transition-colors duration-300"
              >
                {submitting ? (isSinhala ? 'යවමින්...' : 'Sending…') : (isSinhala ? 'පණිවිඩය යවන්න' : 'Send Message')}
              </button>
            </form>
          </div>

          <div>
            <h3 className="text-xl font-light text-gray-800 mb-4">{isSinhala ? 'අපගේ සම්බන්ධතා තොරතුරු' : 'Contact details'}</h3>
            <div className="space-y-2 text-gray-700 font-light">
              <p className="font-light">{organization}</p>
              <p>{address}</p>
              <p>
                {isSinhala ? 'දුරකථන:' : 'Phone:'}{' '}
                <a className="text-red-800" href={`tel:${CONTACT_DATA.phone}`}>
                  {CONTACT_DATA.phone}
                </a>
              </p>
              <p>
                Email:{' '}
                <a className="text-red-800" href={`mailto:${CONTACT_DATA.email}`}>
                  {CONTACT_DATA.email}
                </a>
              </p>
            </div>
            <div className="mt-6 rounded-lg overflow-hidden shadow-lg border">
              <iframe
                title="map"
                src={CONTACT_DATA.mapSrc}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
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

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animation-delay-200 { animation-delay: 200ms; }
      `}</style>
    </div>
  );
};

export default ContactPage;
