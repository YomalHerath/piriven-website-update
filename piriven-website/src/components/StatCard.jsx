import React from 'react';

export const StatCard = ({ stat }) => (
  <div className="group relative overflow-hidden bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
    <div className="relative z-10 text-center">
      <div className="text-black mb-4 flex justify-center group-hover:text-red-800 transition-colors duration-300">
        {stat.icon}
      </div>
      <div className="text-4xl font-bold text-gray-800 mb-2 transition-colors duration-300">
        {stat.number}
      </div>
      <div className="text-gray-600 text-sm uppercase tracking-wide font-medium">
        {stat.label}
      </div>
    </div>
    <div className="absolute inset-0 border-2 border-transparent transition-colors duration-300 group-hover:border-red-800 rounded-lg"></div>
  </div>
);