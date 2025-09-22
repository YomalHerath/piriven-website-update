import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# ==== Security / Environment ====
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "change-me-unsafe-secret-key")
DEBUG = os.getenv("DJANGO_DEBUG", "True") == "True"

# Allow single or comma-separated env vars:
_raw_hosts = os.getenv("DJANGO_ALLOWED_HOSTS") or os.getenv("DJANGO_ALLOWED_HOST", "127.0.0.1,localhost,piriven.moe.gov.lk,122.255.40.206")
ALLOWED_HOSTS = ["*"] if _raw_hosts.strip() == "*" else [h.strip() for h in _raw_hosts.split(",") if h.strip()]

# ==== Apps ====
INSTALLED_APPS = [
    # Admin theme (must be before django.contrib.admin)
    "jazzmin",

    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third-party
    "rest_framework",
    "corsheaders",
    "django_filters",

    # Local apps
    "apps.content",
]

# ==== Middleware ====
# NOTE: Place CorsMiddleware as high as possible and BEFORE CommonMiddleware.
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "piriven_backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "piriven_backend.wsgi.application"

# ==== Database ====
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# ==== Password validation ====
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ==== I18N / TZ ====
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# ==== Static & Media ====
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "static"
# If you keep extra project assets here, ensure the folder exists:
STATICFILES_DIRS = [BASE_DIR / "assets"]

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ==== DRF ====
REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 10,
    "PAGE_SIZE_QUERY_PARAM": "page_size",
}

# ==== CORS / CSRF ====
_default_cors_origins = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://piriven.moe.gov.lk",
    "http://piriven.moe.gov.lk",
    "https://122.255.40.206",
    "http://122.255.40.206",
]
_env_cors = os.getenv("DJANGO_CORS_ALLOWED_ORIGINS")
CORS_ALLOWED_ORIGINS = (
    [origin.strip() for origin in _env_cors.split(",") if origin.strip()]
    if _env_cors
    else _default_cors_origins
)
CORS_ALLOW_CREDENTIALS = True  # fine for dev; in prod, set only if you actually use cookies

_default_csrf = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "https://piriven.moe.gov.lk",
    "http://piriven.moe.gov.lk",
    "https://122.255.40.206",
    "http://122.255.40.206",
]
_env_csrf = os.getenv("DJANGO_CSRF_TRUSTED_ORIGINS")
CSRF_TRUSTED_ORIGINS = (
    [origin.strip() for origin in _env_csrf.split(",") if origin.strip()]
    if _env_csrf
    else _default_csrf
)

# ==== Jazzmin Admin customization ====
JAZZMIN_SETTINGS = {
    "site_title": "Admin",
    "site_header": "Admin",
    "site_brand": "Admin",
    "welcome_sign": "Site Content Management",
    # Branding graphics (paths are relative to STATIC_URL)
    "site_logo": None,
    "site_icon": None,
    "copyright": "",
    "search_model": "content.News",
    "show_ui_builder": False,
    "related_modal_active": True,
    "topmenu_links": [
        {"name": "Dashboard", "url": "admin:index", "permissions": ["auth.view_user"]},
        {"name": "Site", "url": "/", "new_window": True},
    ],
    "usermenu_links": [
        {"name": "View site", "url": "/", "new_window": True},
    ],
    "icons": {
        # content app
        "apps.content": "fas fa-layer-group",
        "content.Album": "fas fa-images",
        "content.GalleryImage": "far fa-image",
        "content.News": "far fa-newspaper",
        "content.Notice": "fas fa-bullhorn",
        "content.Publication": "fas fa-download",
        "content.DownloadCategory": "fas fa-folder-open",
        "content.Video": "fas fa-video",
        "content.Event": "far fa-calendar-alt",
        "content.Stat": "fas fa-chart-bar",
        "content.ExternalLink": "fas fa-link",
        "content.HeroSlide": "fas fa-photo-video",
        "content.NewsletterSubscription": "far fa-envelope",
        # library app (new publications)
        "library.PublicationEntry": "fas fa-book",
        "library.PublicationCategory": "fas fa-book-open",
        # auth
        "auth.User": "fas fa-user",
        "auth.Group": "fas fa-users",
    },
    "custom_css": "admin/custom.css",
    "custom_js": ["admin/custom.js"],
    "custom_links": {
        "content.News": [
            {
                "name": "View on site",
                "url": "/",
                "icon": "fas fa-external-link-alt",
                "new_window": True,
            }
        ]
    },
    "hide_apps": [],
    "hide_models": [],
}

JAZZMIN_UI_TWEAKS = {
    "theme": "flatly",
    "dark_mode_theme": None,
    "navbar": "navbar-dark bg-black",
    "sidebar": "sidebar-dark-danger",  # dark red accent like frontend
    "brand_colour": "navbar-dark bg-black",
    "accent": "danger",
    "actions_sticky_top": True,
    "button_classes": {
        "primary": "btn btn-danger",
        "secondary": "btn btn-outline-secondary",
        "success": "btn btn-success",
        "warning": "btn btn-warning",
        "info": "btn btn-info",
        "danger": "btn btn-outline-danger",
    },
}

