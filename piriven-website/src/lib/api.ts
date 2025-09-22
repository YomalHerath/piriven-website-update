export const API_BASE =
  (process.env.NEXT_PUBLIC_API || "http://127.0.0.1:8000/api").replace(/\/$/, "");

export async function apiFetch(path: string, init?: RequestInit) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, { cache: "no-store", ...init });
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/** Turn /media/... into http://127.0.0.1:8000/media/... */
export function mediaUrl(path?: string | null) {
  if (!path) return "";
  const base = API_BASE.replace(/\/api\/?$/, ""); // http://127.0.0.1:8000
  return path.startsWith("/media") ? `${base}${path}` : path;
}

type QueryValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryValue>;

function listify<T>(data: unknown): T[] {
  if (Array.isArray(data)) {
    return data as T[];
  }

  if (data && typeof data === "object") {
    const maybeResults = (data as { results?: unknown }).results;
    if (Array.isArray(maybeResults)) {
      return maybeResults as T[];
    }
  }

  return [];
}

async function getList<T = unknown>(path: string, params?: QueryParams) {
  const url = new URL(`${API_BASE}${path}`);
  if (params) for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  }
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`GET ${url} failed (${res.status})`);
  const json = await res.json();
  return listify<T>(json);
}

export function fetchBooks(params?: QueryParams) {
  return getList("/books/", { page_size: 6, ...params });
}
export function fetchBookCategories(params?: QueryParams) {
  return getList("/book-categories/", params);
}

export async function fetchSlides() {
  return apiFetch("/slides/");
}

export async function fetchDownloadCategories() {
  return apiFetch("/download-categories/");
}

export async function fetchNews(params?: string) {
  const q = params ? `?${params}` : '';
  return apiFetch(`/news/${q}`);
}

export async function fetchFeaturedNews() {
  return apiFetch('/news/featured/');
}

export async function fetchNewsDetail(slug: string) {
  if (!slug) throw new Error('Missing news slug');
  return apiFetch(`/news/${slug}/`);
}

export async function fetchNotices() {
  return apiFetch("/notices/");
}

export async function fetchNotice(noticeId: string | number) {
  if (noticeId === undefined || noticeId === null) {
    throw new Error('Missing notice id');
  }
  return apiFetch(`/notices/${noticeId}/`);
}

export async function fetchEvents() {
  return apiFetch("/events/");
}

export async function fetchVideos() {
  return apiFetch("/videos/");
}

export async function fetchStats() {
  return apiFetch("/stats/");
}

export async function fetchLinks() {
  return apiFetch("/links/");
}

export async function sendContact(payload: {name: string; email: string; subject?: string; message: string;}) {
  const res = await fetch(`${API_BASE}/contact/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to send message');
  return res.json();
}

export async function fetchContactInfo() {
  return apiFetch('/contact-info/');
}

export function fetchFooterAbout(params?: QueryParams) {
  return getList('/footer-about/', params);
}

export function fetchFooterLinks(params?: QueryParams) {
  return getList('/footer-links/', params);
}

export async function fetchPublications(params?: Record<string, string>) {
  const url = new URL(`${API_BASE}/publications/`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch publications");
  return res.json();
}

export async function fetchPublicationCategories() {
  const res = await fetch(`${API_BASE}/publication-categories/`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch publication categories");
  return res.json();
}

export function fetchAlbums(params?: QueryParams) {
  // pulls albums with nested images when serializer includes them
  return getList("/albums/", { is_active: "true", ordering: "position", page_size: 50, ...params });
}

export async function fetchAlbumBySlug(slug: string) {
  const list = await fetchAlbums({ slug });         // backend supports slug filter
  return Array.isArray(list) && list.length ? list[0] : null;
}

export function fetchAlbumImages(albumId: number, params?: QueryParams) {
  // direct images endpoint (useful if you disable nested images in AlbumSerializer or want pagination)
  return getList('/gallery/', { album: albumId, page_size: 200, ...params });
}

export async function fetchHeroIntro() {
  return apiFetch('/hero-intro/');
}

export async function fetchAboutSections() {
  return apiFetch('/about-sections/');
}

export async function fetchSiteTextSnippets() {
  return apiFetch('/text-snippets/');
}

export async function subscribeNewsletter(email: string) {
  const res = await fetch(`${API_BASE}/newsletter/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || 'Failed to subscribe');
  }
  return res.json();
}
