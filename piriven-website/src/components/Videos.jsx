'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Play, X } from 'lucide-react';
import T from '@/components/T';
import { mediaUrl } from '@/lib/api';

export const VideosSection = ({ videos }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const videoRef = useRef(null);

  const first = Array.isArray(videos) && videos.length ? videos[0] : null;
  const fileSrc = first?.file ? mediaUrl(first.file) : "";
  const linkSrc = first?.url || "";
  const videoPath = fileSrc || linkSrc;
  const isYouTube = !!linkSrc && /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/i.test(linkSrc);
  const thumbnailPath = first?.thumbnail ? mediaUrl(first.thumbnail) : "";

  const openVideo = (e) => {
    e.preventDefault();
    if (!videoPath && !isYouTube) return;
    setIsVideoOpen(true);
  };

  const closeVideo = () => {
    setIsVideoOpen(false);
    if (videoRef.current) {
      videoRef.current.pause?.();
    }
  };

  useEffect(() => () => {
    if (videoRef.current) videoRef.current.pause?.();
  }, []);

  if (!first) {
    return (
      <div>
        <h2 className="text-4xl font-light text-gray-800 mb-12 tracking-wide">
          <T>Videos</T>
        </h2>
        <div className="text-sm text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-lg px-4 py-6 text-center">
          <T>No videos available yet.</T>
        </div>
        <div className="pt-6 text-center">
          <Link
            href="/videos"
            className="inline-block bg-transparent border-2 border-black hover:bg-black text-black hover:text-white px-8 py-4 rounded-lg font-light transition-colors duration-300"
          >
            <T>View all videos</T>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-4xl font-light text-gray-800 mb-12 tracking-wide">
        <T>Videos</T>
      </h2>

      <div className="space-y-6">
        {!isVideoOpen ? (
          <button onClick={openVideo} className="group block relative rounded-lg overflow-hidden cursor-pointer w-full shadow-lg">
            {thumbnailPath ? (
              <img 
                src={thumbnailPath} 
                alt={first?.title || "Video Thumbnail"} 
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110" 
              />
            ) : (
              <div className="aspect-video w-full bg-gray-200 flex items-center justify-center text-gray-500">No thumbnail</div>
            )}
            {/* NEW PLAY BUTTON STYLING */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition-all duration-300">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full h-20 w-20 flex items-center justify-center group-hover:scale-125 transition-transform duration-300 border-4 border-white/30">
                <Play className="text-black w-8 h-8 ml-1" />
              </div>
            </div>
            {/* END OF NEW STYLING */}
          </button>
        ) : (
          <div className="relative">
            <button onClick={closeVideo} className="absolute -top-4 -right-4 z-10 bg-black text-white rounded-lg p-2 transition-all duration-300 hover:bg-red-800">
              <X size={18} />
            </button>

            {isYouTube ? (
              <div className="aspect-video w-full">
                <iframe
                  className="w-full h-full rounded-lg shadow-xl"
                  src={linkSrc.replace("watch?v=", "embed/")}
                  title={first?.title || "Video"}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : videoPath ? (
              <video
                ref={videoRef}
                className="rounded-lg shadow-xl w-full h-full"
                controls
                autoPlay
                src={videoPath}
              />
            ) : (
              <div className="text-sm text-gray-500">
                <T>No video source.</T>
              </div>
            )}
          </div>
        )}

        <h3 className="font-light text-gray-700 text-lg">
          {first?.title || "Untitled video"}
        </h3>
        {first?.description ? (
          <p className="text-gray-600 font-light">{first.description}</p>
        ) : null}
        <div className="pt-4 text-center">
          <Link
            href="/videos"
            className="inline-block bg-transparent border-2 border-black hover:bg-black text-black hover:text-white px-8 py-4 rounded-lg font-light transition-colors duration-300"
          >
            <T>View all videos</T>
          </Link>
        </div>
      </div>
    </div>
  );
};