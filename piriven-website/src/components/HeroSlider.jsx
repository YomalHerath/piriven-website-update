'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const HeroSlider = ({ mainSlides, currentSlide, setCurrentSlide }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse tracking for parallax effect
  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (mainSlides.length < 2) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % mainSlides.length);
    }, 17000);
    return () => clearInterval(interval);
  }, [mainSlides.length, setCurrentSlide]);

  const nextSlide = () => {
    setCurrentSlide(currentSlide === mainSlides.length - 1 ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? mainSlides.length - 1 : currentSlide - 0);
  };

  if (!mainSlides || mainSlides.length === 0) {
    return (
      <section className="relative h-[600px] overflow-hidden bg-gray-900 flex items-center justify-center">
        <div className="text-white/70 text-center font-light text-xl">No slides yet</div>
      </section>
    );
  }

  return (
    <section 
      className="relative group h-[600px] overflow-hidden bg-gray-900"
      onMouseMove={handleMouseMove}
    >
      {/* Slide Content */}
      {mainSlides.map((slide, index) => {
        const isActive = index === currentSlide;
        const isPrev = index < currentSlide;
        const parallaxX = (mousePosition.x - 0.5) * 10;
        const parallaxY = (mousePosition.y - 0.5) * 10;
        
        return (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-[1200ms] ease-out ${
              isActive 
                ? 'opacity-100 translate-x-0 scale-100' 
                : isPrev
                  ? 'opacity-0 -translate-x-full scale-95' 
                  : 'opacity-0 translate-x-full scale-95'
            }`}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
              zIndex: isActive ? 10 : 1
            }}
          >
            {/* Background with Subtle Parallax */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute inset-0 w-[110%] h-[110%] -left-[5%] -top-[5%]"
                style={{
                  transform: isActive 
                    ? `translate(${parallaxX * 0.2}px, ${parallaxY * 0.2}px) scale(1)` 
                    : 'translate(0px, 0px) scale(1.05)',
                  transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
                }}
              >
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  style={{
                    filter: isActive 
                      ? 'brightness(0.75) contrast(1.1)' 
                      : 'brightness(0.6) contrast(0.9)',
                    transition: 'filter 1s cubic-bezier(0.23, 1, 0.32, 1)',
                  }}
                />
              </div>
            </div>
            
            {/* Professional Gradient Overlay */}
            <div className="absolute inset-0">
              <div className={`absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/30 transition-opacity duration-1000 ${
                isActive ? 'opacity-100' : 'opacity-70'
              }`}></div>
            </div>
            
            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-6">
                <div 
                  className="max-w-3xl text-white"
                  style={{
                    transform: isActive 
                      ? `translate(${parallaxX * 0.05}px, ${parallaxY * 0.05}px)` 
                      : 'translate(0px, 15px)',
                    transition: 'transform 0.5s ease-out',
                  }}
                >
                  
                  {/* Title with Stagger Animation */}
                  <div className="overflow-hidden mb-6">
                    <h1 className="text-5xl md:text-7xl font-light leading-tight tracking-wide">
                      {slide.title.split(' ').map((word, wordIndex) => (
                        <span
                          key={wordIndex}
                          className={`inline-block mr-4 text-white transition-all duration-1000 ease-out ${
                            isActive 
                              ? 'transform translate-y-0 opacity-100' 
                              : 'transform translate-y-16 opacity-0'
                          }`}
                          style={{
                            transitionDelay: isActive ? `${300 + wordIndex * 100}ms` : '0ms',
                            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                            textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                          }}
                        >
                          {word}
                        </span>
                      ))}
                    </h1>
                  </div>
                  
                  {/* Subtitle */}
                  <div className="overflow-hidden mb-8">
                    <p 
                      className={`text-xl md:text-2xl text-gray-200 font-light leading-relaxed transition-all duration-1000 ease-out ${
                        isActive 
                          ? 'transform translate-y-0 opacity-100' 
                          : 'transform translate-y-12 opacity-0'
                      }`}
                      style={{
                        transitionDelay: isActive ? '500ms' : '0ms',
                        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                        textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                      }}
                    >
                      {slide.subtitle}
                    </p>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Refined Navigation Arrows */}
      {mainSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="cursor-pointer absolute left-8 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white p-3 rounded-full transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/30 z-30 opacity-0 group-hover:opacity-100"
            style={{ transition: 'all 0.3s cubic-bezier(0.19, 1, 0.22, 1)' }}
          >
            <ChevronLeft className="w-6 h-6 transition-transform duration-300 group-hover:-translate-x-0.5" />
          </button>
                    <button
            onClick={nextSlide}
            className="cursor-pointer absolute right-8 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white p-3 rounded-full transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/30 z-30 opacity-0 group-hover:opacity-100"
            style={{ transition: 'all 0.3s cubic-bezier(0.19, 1, 0.22, 1)' }}
          >
            <ChevronRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </>
      )}

      {/* Matching Dot Navigation */}
      <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-30 opacity-0 group-hover:opacity-100"
        style={{ transition: 'all 0.3s cubic-bezier(0.19, 1, 0.22, 1)' }}
      >
        {mainSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`cursor-pointer relative w-2 h-2 transition-all duration-400 ease-out transform focus:outline-none focus:ring-2 focus:ring-white/50 active:scale-90 rounded-full ${
              index === currentSlide 
                ? 'bg-yellow-300 scale-100 w-6 h-2' 
                : 'bg-white/40 hover:bg-white/70'
            }`}
          >
            {/* Subtle glow for the active dot */}
            {index === currentSlide && (
              <span className="absolute inset-0 rounded-full bg-yellow-300 animate-pulse opacity-50"></span>
            )}
          </button>
        ))}
      </div>
      
      {/* Progress Bar - Moved to bottom */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black/10 z-20">
          <div 
            className="h-full bg-yellow-300 transition-all duration-300 ease-out"
            style={{ 
              width: `${((currentSlide + 1) / mainSlides.length) * 100}%`,
            }}
          />
        </div>
    </section>
  );
};