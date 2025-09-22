import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-xl">
        <p className="text-sm uppercase tracking-[0.4em] text-red-700 mb-4">Error 404</p>
        <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
          The page you are looking for could not be found.
        </h1>
        <p className="text-gray-600 font-light leading-relaxed mb-10">
          The link may be broken or the page may have been removed. Double-check the URL or head back to the homepage.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg border border-black text-black hover:bg-black hover:text-white transition-colors duration-300"
          >
            ← Back to Home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg border border-transparent bg-red-800 text-white hover:bg-black transition-colors duration-300"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
