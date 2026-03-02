import React from 'react';
import { Event } from '@/types/event.types';

interface EventBannerProps {
  event: Event;
}

export default function EventBanner({ event }: EventBannerProps) {
  return (
    <div className="relative group">
      {event.bannerUrl ? (
        <div className="relative overflow-hidden rounded-t-xl">
          <img 
            src={event.bannerUrl} 
            alt={event.title}
            className="w-full h-64 sm:h-80 md:h-96 lg:h-[32rem] object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10">
            <div className="max-w-4xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-2xl leading-tight">
                {event.title}
              </h1>
              {event.category && (
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white font-medium text-sm sm:text-base">{event.category.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="h-64 sm:h-80 md:h-96 lg:h-[32rem] bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-t-xl flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative text-center">
            <div className="text-white/30 text-6xl sm:text-7xl lg:text-8xl font-bold mb-4">EVENT</div>
            <div className="text-white/50 text-lg sm:text-xl">No Banner Available</div>
          </div>
        </div>
      )}
    </div>
  );
}
