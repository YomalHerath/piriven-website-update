"use client";

import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import Link from "next/link";
import { Download, FileText, Calendar, Users } from "lucide-react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MainNavigation } from "@/components/MainNavigation";
import { MobileMenu } from "@/components/MobileMenu";
import { fetchDownloadCategories, mediaUrl } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import { preferLanguage } from "@/lib/i18n";

const DownloadsPage = () => {
  const { lang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [sectionsVisible, setSectionsVisible] = useState({});

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await fetchDownloadCategories();
        const list = Array.isArray(data) ? data : data?.results || [];
        if (!mounted) return;
        setCategories(list);
        if (list.length) {
          setSelectedCategoryId(list[0].id ?? list[0].slug ?? list[0].name);
        } else {
          setSelectedCategoryId(null);
        }
      } catch (err) {
        console.warn("Failed to load download categories", err);
        if (mounted) {
          setCategories([]);
          setSelectedCategoryId(null);
        }
      }
    })();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSectionsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    const sections = document.querySelectorAll("[data-animate]");
    sections.forEach((section) => observer.observe(section));

    return () => {
      mounted = false;
      observer.disconnect();
    };
  }, []);

  const documents = useMemo(() => {
    return categories.map((cat) => ({
      id: cat.id ?? cat.slug ?? cat.name,
      name: preferLanguage(cat.name, cat.name_si, lang) || cat.name,
    }));
  }, [categories, lang]);

  const selectedCategory = useMemo(() => {
    if (!selectedCategoryId) return null;
    return (
      categories.find((cat) => (cat.id ?? cat.slug ?? cat.name) === selectedCategoryId) || null
    );
  }, [categories, selectedCategoryId]);

  return (
    <div className="min-h-screen bg-white flex flex-col animate-fade-in">
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <MobileMenu mobileMenuOpen={mobileMenuOpen} />
      <MainNavigation />

      <main className="mx-auto px-6 md:px-10 py-18 flex-grow flex flex-col md:flex-row gap-8">
        <div
          id="downloads-menu"
          data-animate
          className={`md:w-64 flex-shrink-0 transition-all duration-1000 transform ${sectionsVisible["downloads-menu"] ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
        >
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 sticky top-28">
            <h2 className="text-xl font-light text-gray-900 mb-4">Documents</h2>
            <nav className="flex flex-col space-y-2">
              {documents.length ? (
                documents.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedCategoryId(doc.id)}
                    className={`relative flex items-center justify-start w-full px-4 py-3 rounded-lg text-sm transition-all duration-300 transform ${selectedCategoryId === doc.id ? "text-red-800 font-semibold scale-105" : "text-gray-700 hover:bg-gray-100"}`}
                  >
                    <span className="flex-grow text-left">{doc.name}</span>
                    {selectedCategoryId === doc.id && (
                      <span className="absolute bottom-0 left-0 h-0.5 bg-red-800 w-full animate-underline-grow"></span>
                    )}
                  </button>
                ))
              ) : (
                <span className="text-sm text-gray-500">No categories yet.</span>
              )}
            </nav>
          </div>
        </div>

        <div
          id="documents-grid-container"
          data-animate
          className={`flex-grow transition-all duration-1000 transform ${sectionsVisible["documents-grid-container"] ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="text-center md:text-left mb-12">
            <h1 className="text-4xl font-light text-gray-900 mb-4 animate-slide-up">
              {selectedCategory
                ? preferLanguage(selectedCategory.name, selectedCategory.name_si, lang) || selectedCategory.name
                : "Documents"}
            </h1>
            <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start space-x-4 text-sm text-gray-500 animate-slide-up animation-delay-200">
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-1 text-red-800" />
                {(selectedCategory?.publications?.length || 0)} Documents
              </div>
              <span>•</span>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-red-800" /> Updated Monthly
              </div>
            </div>
          </div>

          {(selectedCategory?.publications?.length || 0) > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {selectedCategory.publications.map((pdf, index) => {
                const title = preferLanguage(pdf.title, pdf.title_si, lang) || pdf.title || "Untitled";
                const department = preferLanguage(pdf.department, pdf.department_si, lang) || pdf.department || "";
                const description = preferLanguage(pdf.description, pdf.description_si, lang) || pdf.description || "";
                const publishedDate = pdf.published_at ? dayjs(pdf.published_at).format("MMMM YYYY") : "";
                const downloadHref = pdf.external_url || (pdf.file ? mediaUrl(pdf.file) : "");
                const canDownload = Boolean(downloadHref);

                return (
                  <div
                    key={pdf.id ?? `${title}-${index}`}
                    className="group bg-white rounded-lg shadow-lg hover:shadow-lg transition-all duration-500 hover:-translate-y-3 border border-gray-200 hover:border-gray-300 overflow-hidden animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
                  >
                    <div className="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                      <FileText className="w-24 h-24 text-red-800 transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        PDF
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <h3 className="font-bold text-gray-800 leading-tight group-hover:text-red-800 transition-colors duration-300 text-lg">
                        {title}
                      </h3>

                      <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-red-800 flex-shrink-0" />
                          <span>{publishedDate || "Not dated"}</span>
                        </div>
                        {department ? (
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2 text-red-800 flex-shrink-0" />
                            <span>{department}</span>
                          </div>
                        ) : null}
                        {description ? (
                          <div className="flex flex-wrap gap-2">
                            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold border border-gray-200">
                              {description}
                            </span>
                          </div>
                        ) : null}
                      </div>

                      <Link
                        href={downloadHref || "#"}
                        target={canDownload ? "_blank" : undefined}
                        rel={canDownload ? "noopener noreferrer" : undefined}
                        className={`flex items-center justify-center w-full font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg mt-6 ${canDownload ? "bg-red-800 hover:bg-red-900 text-white hover:shadow-xl transform hover:-translate-y-1 group/btn" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                      >
                        <Download className="w-5 h-5 mr-2 group-hover/btn:animate-bounce" />
                        Download PDF
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="bg-gray-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <FileText className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-light text-gray-800 mb-4">No Documents Available</h3>
              <p className="text-gray-600 text-lg max-w-md mx-auto">
                Documents for this category are being prepared. Please check back later for updates.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slide-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes underline-grow {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }

        .animate-slide-up { animation: slide-up 0.8s ease-out; }
        .animate-slide-left { animation: slide-left 0.8s ease-out; }
        .animate-slide-right { animation: slide-right 0.8s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
        .animate-underline-grow { animation: underline-grow 0.3s ease-in-out forwards; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-600 { animation-delay: 600ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
      `}</style>
    </div>
  );
};

export default DownloadsPage;