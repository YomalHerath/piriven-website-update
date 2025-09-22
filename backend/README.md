# Django Backend for Piriven Website

This backend provides a Django admin + REST API (DRF) for the Next.js frontend.

## Quick start

1) Create a virtual environment and install deps

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
```

2) Run migrations and create superuser

```bash
python manage.py migrate
python manage.py createsuperuser
```

3) Start the server

```bash
python manage.py runserver 8000
```

- Admin: http://127.0.0.1:8000/admin/
- API root: http://127.0.0.1:8000/api/
- Media: http://127.0.0.1:8000/media/

## Environment

- `DJANGO_SECRET_KEY` (optional): overrides default secret.
- `DJANGO_DEBUG` (default `True`).
- `DJANGO_ALLOWED_HOST` (default `*`).

## API endpoints (examples)

- `GET /api/news/` — list news
- `GET /api/news/featured/` — featured news
- `GET /api/notices/` — list notices
- `GET /api/publications/` — list publications
- `GET /api/videos/` — list videos
- `GET /api/albums/` — list albums (with images)
- `POST /api/newsletter/` — subscribe with `{ "email": "you@example.com" }`

## Next.js integration examples

Example fetcher (app router):

```ts
// src/lib/api.ts
export async function fetchNews() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/news/`, { next: { revalidate: 60 }});
  if (!res.ok) throw new Error('Failed to fetch news');
  return res.json();
}
```

Add `.env.local` in Next.js:

```
NEXT_PUBLIC_API=http://127.0.0.1:8000/api
```

Use in a server component:

```tsx
import { fetchNews } from "@/lib/api";

export default async function NewsPage() {
  const news = await fetchNews();
  return (
    <div>
      {news.results?.map((item: any) => (
        <article key={item.id}>
          <h2>{item.title}</h2>
          <p>{item.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

For images/files, build URLs with `NEXT_PUBLIC_API` base and the `MEDIA_URL` paths returned by the API.

## Notes

- CORS is enabled for `http://localhost:3000` and `http://127.0.0.1:3000`.
- SQLite database lives at `backend/db.sqlite3`.
- Image support requires Pillow (installed via requirements).
