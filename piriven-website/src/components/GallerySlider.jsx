import React from 'react';
import Link from 'next/link';
import T from '@/components/T';

export const GallerySlider = ({ galleryImages, gallerySlide, setGallerySlide }) => (
  <div className="space-y-6">
    <div className="relative h-96 rounded-lg overflow-hidden shadow-2xl group">
      {galleryImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ${
            index === gallerySlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
          }`}
        >
          <img 
            src={image} 
            alt={`Gallery ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
    <div className="flex justify-center space-x-2">
      {galleryImages.map((_, index) => (
        <button
          key={index}
          onClick={() => setGallerySlide(index)}
          className={`w-2 h-2 rounded-full transition-all cursor-pointer duration-300 ${
            index === gallerySlide ? 'bg-red-800 scale-125' : 'bg-gray-300 hover:bg-red-800'
          }`}
        />
      ))}
    </div>
    <div className="text-center">
      <Link href="/gallery">
        <button className="cursor-pointer bg-transparent border-2 border-black hover:bg-black text-black hover:text-white px-8 py-4 rounded-lg font-light transition-colors duration-300">
          <T>View More Images</T>
        </button>
      </Link>
    </div>
  </div>
);