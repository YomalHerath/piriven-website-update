from rest_framework.routers import DefaultRouter
from django.urls import path, include
from . import views

router = DefaultRouter()
router.register(r"news", views.NewsViewSet, basename="news")
router.register(r"notices", views.NoticeViewSet, basename="notices")
router.register(r"publications", views.PublicationViewSet, basename="publications")
router.register(r"download-categories", views.DownloadCategoryViewSet, basename="download-categories")
router.register(r"videos", views.VideoViewSet, basename="videos")
router.register(r"albums", views.AlbumViewSet, basename="albums")
router.register(r"gallery", views.GalleryImageViewSet, basename="gallery")
router.register(r"events", views.EventViewSet, basename="events")
router.register(r"stats", views.StatViewSet, basename="stats")
router.register(r"links", views.ExternalLinkViewSet, basename="links")
router.register(r"footer-links", views.FooterLinkViewSet, basename="footer-links")
router.register(r"slides", views.HeroSlideViewSet, basename="slides")
router.register(r"hero-intro", views.HeroIntroViewSet, basename="hero-intro")
router.register(r"about-sections", views.AboutSectionViewSet, basename="about-sections")
router.register(r"text-snippets", views.SiteTextSnippetViewSet, basename="text-snippets")
router.register(r"book-categories", views.LibraryPublicationCategoryViewSet, basename="book-categories")
router.register(r"books", views.LibraryPublicationEntryViewSet, basename="books")
router.register(r"newsletter", views.NewsletterSubscriptionViewSet, basename="newsletter")
router.register(r"contact", views.ContactMessageViewSet, basename="contact")
router.register(r"contact-info", views.ContactInfoViewSet, basename="contact-info")
router.register(r"footer-about", views.FooterAboutViewSet, basename="footer-about")

urlpatterns = [
    path("", include(router.urls)),
]

