import React from 'react';
import T from '@/components/T';
import { subscribeNewsletter } from '@/lib/api';

export const NewsletterSection = () => {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState('idle');
  const [message, setMessage] = React.useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      await subscribeNewsletter(email);
      setStatus('success');
      setMessage('Thank you for subscribing!');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(error?.message || 'Subscription failed. Please try again later.');
    }
  };

  return (
    <div className="bg-red-800 rounded-lg p-8 text-white shadow-xl">
      <div className="space-y-4">
        <h3 className="text-2xl font-light"><T>Subscribe to Our Newsletter</T></h3>
        <p className="text-white/90 font-light">
          <T>Stay updated with the latest news and announcements from our ministry.</T>
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-sm font-light text-white/80">
            <T>Email address</T>
          </label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full rounded-md px-4 py-2 text-black bg-white border-2 border-yellow-400 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
            placeholder="you@example.com"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="cursor-pointer bg-yellow-300 text-black hover:bg-black hover:text-white px-6 py-3 rounded-lg font-light transition-colors duration-300 disabled:opacity-60"
          >
            {status === 'loading' ? 'Subscribing…' : <T>Subscribe Now</T>}
          </button>
          {message ? (
            <p className={`text-sm ${status === 'error' ? 'text-yellow-200' : 'text-white/90'}`}>
              {message}
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
};
