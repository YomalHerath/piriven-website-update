import React, { useState, useMemo, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchEvents } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { preferLanguage } from '@/lib/i18n';

dayjs.extend(isBetween);

// Events fetched from backend; falls back to empty list

export const CalendarComponent = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [events, setEvents] = useState([]);
  const { lang } = useLanguage();

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchEvents();
        const list = Array.isArray(data) ? data : (data?.results || []);
        const mapped = list.map((event) => ({
          date: event.start_date || event.date,
          title: preferLanguage(event.title, event.title_si, lang),
        }));
        setEvents(mapped);
      } catch (e) {
        setEvents([]);
      }
    })();
  }, [lang]);

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, 'month'));
  };

  // Get days for the calendar grid
  const daysInMonth = useMemo(() => {
    const startOfMonth = currentDate.startOf('month');
    const endOfMonth = currentDate.endOf('month');
    const startOfGrid = startOfMonth.startOf('week');
    const endOfGrid = endOfMonth.endOf('week');
    
    const days = [];
    let currentDay = startOfGrid;
    
    while (currentDay.isBefore(endOfGrid) || currentDay.isSame(endOfGrid)) {
      days.push(currentDay);
      currentDay = currentDay.add(1, 'day');
    }
    
    return days;
  }, [currentDate]);

  // Filter events for the current month
  const currentMonthEvents = useMemo(() => {
    return events.filter(event => 
      dayjs(event.date).isBetween(currentDate.startOf('month'), currentDate.endOf('month'), 'day', '[]')
    );
  }, [currentDate, events]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        <div className="flex justify-between items-center mb-6">
          {/* Prev Month Button */}
          <button
            onClick={handlePrevMonth}
            className="cursor-pointer group bg-black/5 hover:bg-black/10 backdrop-blur-sm border border-gray-200 text-black p-3 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300" />
          </button>
          <h3 className="font-light text-xl text-gray-800 uppercase">
            {currentDate.format('MMMM YYYY')}
          </h3>
          {/* Next Month Button */}
          <button
            onClick={handleNextMonth}
            className="cursor-pointer group bg-black/5 hover:bg-black/10 backdrop-blur-sm border border-gray-200 text-black p-3 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
        <div className="grid grid-cols-7 text-center text-xs text-gray-500 font-light mb-4">
          <span className="py-2">SU</span>
          <span className="py-2">MO</span>
          <span className="py-2">TU</span>
          <span className="py-2">WE</span>
          <span className="py-2">TH</span>
          <span className="py-2">FR</span>
          <span className="py-2">SA</span>
        </div>
        <div className="grid grid-cols-7 text-center text-sm gap-1">
          {daysInMonth.map((day, index) => {
            const isToday = day.isSame(dayjs(), 'day');
            const hasEvent = currentMonthEvents.some(event => day.isSame(dayjs(event.date), 'day'));
            const isCurrentMonth = day.isSame(currentDate, 'month');

            return (
              <button
                key={index}
                className={`py-3 rounded-lg transition-all duration-300 relative flex items-center justify-center
                  ${isCurrentMonth
                    ? 'text-gray-700 hover:bg-gray-100 hover:text-black'
                    : 'text-gray-400 cursor-not-allowed'
                  }
                `}
                disabled={!isCurrentMonth}
              >
                {/* Event or Today marker */}
                {isToday && (
                  <span className="absolute w-10 h-10 rounded-full bg-red-800 opacity-80"></span>
                )}
                {!isToday && hasEvent && isCurrentMonth && (
                  <span className="absolute w-10 h-10 rounded-full bg-yellow-300 opacity-80"></span>
                )}
                <span className={`relative z-10 font-light ${isToday ? 'text-white' : ''}`}>
                  {day.format('D')}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="border-l border-gray-200 pl-8">
        <h4 className="font-light text-gray-500 text-sm mb-6 uppercase tracking-wider">
          EVENTS FOR {currentDate.format('MMMM').toUpperCase()}
        </h4>
        {currentMonthEvents.length > 0 ? (
          <ul className="space-y-4">
            {currentMonthEvents.map((event, index) => (
              <li key={index} className="p-4 bg-gray-50 rounded-lg shadow-sm transition-shadow duration-300 hover:shadow-md">
                <p className="text-xs text-gray-500 mb-1">{dayjs(event.date).format('MMMM D, YYYY')}</p>
                <p className="font-light text-gray-800">{event.title}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-400 py-12">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-light">No Events</p>
          </div>
        )}
      </div>
    </div>
  );
};