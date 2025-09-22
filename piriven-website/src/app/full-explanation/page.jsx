'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MainNavigation } from '@/components/MainNavigation';
import { MobileMenu } from '@/components/MobileMenu';
import Link from 'next/link';

const FullExplanationSection = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <Header 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />
      <MobileMenu mobileMenuOpen={mobileMenuOpen} />
      <MainNavigation />
      
      <main className="mx-auto px-6 md:px-10 py-18">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight animate-slide-up">
              <span className="block">The Full Story of</span>
              <span className="block bg-gradient-to-r from-red-500 via-blue-500 to-yellow-400 bg-clip-text text-transparent animate-gradient-x mt-2">
                Piriven & Bhikkhu Education
              </span>
            </h1>
          </div>

          <p className="text-gray-600 font-light leading-relaxed text-lg animate-slide-up animation-delay-200">
            The history of Piriven & Bhikkhu Education is deeply interwoven with the spiritual and cultural fabric of Sri Lanka. From the time of the Buddha, the monastery, or <em className="text-gray-800 font-medium">Pirivena</em>, was not only a place of residence for monks but also a hub of learning, reflection, and discipline...
          </p>
          <p className="text-gray-600 font-light leading-relaxed text-lg animate-slide-up animation-delay-300">
            Over the centuries, Pirivenas grew into formal institutions where knowledge was shared and preserved with great care, ensuring that the profound teachings of the Dhamma would endure for future generations. They became sanctuaries where young novices entered with curiosity and humility and departed as wise Bhikkhus, capable of guiding both the monastic community and lay society.
          </p>
          <p className="text-gray-600 font-light leading-relaxed text-lg animate-slide-up animation-delay-400">
            In these sacred centers, education extended far beyond memorizing scriptures. It was a holistic process that shaped character, cultivated inner discipline, and encouraged a life rooted in compassion and service. Monks were trained to master the Tripitaka and other Buddhist texts, but also to embody the principles of morality, mindfulness, and wisdom in their daily lives...
          </p>
          <p className="text-gray-600 font-light leading-relaxed text-lg animate-slide-up animation-delay-500">
            With time, Pirivenas also became centers of scholarship and cultural preservation. Ancient texts were studied, copied, and safeguarded, while art, language, and philosophy flourished within their walls. Even during difficult periods of history, when external forces threatened to diminish the role of Buddhism in society, Pirivenas stood firm, silently carrying the responsibility of protecting and transmitting the Buddha Sasana.
          </p>
          <p className="text-gray-600 font-light leading-relaxed text-lg animate-slide-up animation-delay-600">
            Today, Piriven & Bhikkhu Education continues to thrive, striking a balance between tradition and modernity. While the foundations remain firmly rooted in the Dhamma and Vinaya, many Pirivenas also include modern subjects such as languages, science, and technology, ensuring that Bhikkhus are prepared to face the challenges of the present world...
          </p>
          <p className="text-gray-600 font-light leading-relaxed text-lg animate-slide-up animation-delay-700">
            The vision of Piriven & Bhikkhu Education is not only to preserve Buddhist teachings but also to nurture individuals who embody them in action. Every Pirivena is a reminder that education is not just about acquiring knowledge but about transforming lives. It is about shaping leaders who are humble yet strong, learned yet compassionate, disciplined yet approachable.
          </p>
          <p className="text-gray-600 font-light leading-relaxed text-lg animate-slide-up animation-delay-800">
            As we look to the future, the role of Piriven & Bhikkhu Education remains as vital as ever. In a world often filled with restlessness and uncertainty, these institutions continue to shine as places of refuge and renewal. They remind us that the path of the Buddha is not confined to the past but is alive in every generation that chooses to walk it...
          </p>

          <div className="text-center pt-10 animate-slide-up animation-delay-1000">
            <Link href="/">
              <button className="bg-transparent border-2 border-black hover:bg-black text-black hover:text-white px-8 py-4 rounded-lg font-light transition-colors duration-300">
                ← Back to Home
              </button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      {/* 🆕 Add the CSS animations */}
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

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }

        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-600 { animation-delay: 600ms; }
        .animation-delay-700 { animation-delay: 700ms; }
        .animation-delay-800 { animation-delay: 800ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
      `}</style>
    </div>
  );
};

export default FullExplanationSection;