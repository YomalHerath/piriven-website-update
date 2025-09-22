from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db import models as django_models

from . import models, serializers
from . import serializers as s


class NewsViewSet(viewsets.ModelViewSet):
    queryset = models.News.objects.all().prefetch_related("gallery_images").order_by("-published_at")
    serializer_class = s.NewsSerializer
    lookup_field = "slug"
    lookup_value_regex = "[0-9A-Za-z-]+"

    def get_object(self):
        lookup = self.kwargs.get(self.lookup_field)
        if not lookup:
            return super().get_object()

        queryset = self.filter_queryset(self.get_queryset())
        try:
            return queryset.get(**{self.lookup_field: lookup})
        except models.News.DoesNotExist:
            if lookup.isdigit():
                return queryset.get(pk=int(lookup))
            raise

    @action(detail=False, methods=["get"])
    def featured(self, request):
        qs = self.get_queryset().filter(is_featured=True)[:5]
        return Response(self.get_serializer(qs, many=True).data)


class NoticeViewSet(viewsets.ModelViewSet):
    queryset = models.Notice.objects.all().prefetch_related("gallery_images")
    serializer_class = s.NoticeSerializer


class PublicationViewSet(viewsets.ModelViewSet):
    queryset = models.Publication.objects.filter(is_active=True).order_by("-published_at")
    serializer_class = s.PublicationSerializer


class VideoViewSet(viewsets.ModelViewSet):
    queryset = models.Video.objects.all().order_by("-published_at")
    serializer_class = s.VideoSerializer


class AlbumViewSet(viewsets.ModelViewSet):
    queryset = models.Album.objects.all()
    serializer_class = serializers.AlbumSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["is_active", "slug"]
    search_fields = ["title", "description"]
    ordering_fields = ["position", "published_at", "created_at"]
    ordering = ["position", "-published_at", "-created_at"]

class GalleryImageViewSet(viewsets.ModelViewSet):
    queryset = models.GalleryImage.objects.all()
    serializer_class = serializers.GalleryImageSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["album"]
    ordering_fields = ["position", "created_at"]


class EventViewSet(viewsets.ModelViewSet):
    queryset = models.Event.objects.all().order_by("start_date")
    serializer_class = s.EventSerializer


class StatViewSet(viewsets.ModelViewSet):
    queryset = models.Stat.objects.all()
    serializer_class = s.StatSerializer


class ExternalLinkViewSet(viewsets.ModelViewSet):
    queryset = models.ExternalLink.objects.all()
    serializer_class = s.ExternalLinkSerializer


class FooterLinkViewSet(viewsets.ModelViewSet):
    queryset = models.FooterLink.objects.all().order_by("position", "name")
    serializer_class = s.FooterLinkSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        action = getattr(self, "action", None)
        if action in ("list", "retrieve"):
            return qs.filter(is_active=True)
        return qs


class HeroSlideViewSet(viewsets.ModelViewSet):
    queryset = models.HeroSlide.objects.all().order_by("position")
    serializer_class = s.HeroSlideSerializer


class NewsletterSubscriptionViewSet(mixins.CreateModelMixin,
                                    mixins.ListModelMixin,
                                    viewsets.GenericViewSet):
    queryset = models.NewsletterSubscription.objects.all().order_by("-created_at")
    serializer_class = s.NewsletterSubscriptionSerializer


class DownloadCategoryViewSet(viewsets.ModelViewSet):
    queryset = models.DownloadCategory.objects.all().order_by("position").prefetch_related(
        django_models.Prefetch(
            "publications",
            queryset=models.Publication.objects.filter(is_active=True).order_by("-published_at", "-created_at")
        )
    )
    serializer_class = s.DownloadCategorySerializer


class ContactMessageViewSet(mixins.CreateModelMixin,
                            mixins.ListModelMixin,
                            viewsets.GenericViewSet):
    queryset = models.ContactMessage.objects.all().order_by("-created_at")
    serializer_class = s.ContactMessageSerializer


class ContactInfoViewSet(viewsets.ModelViewSet):
    queryset = models.ContactInfo.objects.all().order_by("-created_at")
    serializer_class = s.ContactInfoSerializer


class FooterAboutViewSet(viewsets.ModelViewSet):
    queryset = models.FooterAbout.objects.all().order_by("-updated_at", "-created_at")
    serializer_class = s.FooterAboutSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        action = getattr(self, "action", None)
        if action in ("list", "retrieve"):
            return qs.filter(is_active=True)
        return qs


class HeroIntroViewSet(viewsets.ModelViewSet):
    serializer_class = s.HeroIntroSerializer

    def get_queryset(self):
        qs = models.HeroIntro.objects.all().order_by("-updated_at")
        action = getattr(self, "action", None)
        if action in ("list", "retrieve"):
            return qs.filter(is_active=True)
        return qs


class AboutSectionViewSet(viewsets.ModelViewSet):
    serializer_class = s.AboutSectionSerializer
    filter_backends = [OrderingFilter]
    ordering_fields = ["position", "created_at"]
    ordering = ["position", "created_at"]

    def get_queryset(self):
        qs = models.AboutSection.objects.all()
        action = getattr(self, "action", None)
        if action in ("list", "retrieve"):
            qs = qs.filter(is_active=True)
        return qs.order_by("position", "created_at")


class SiteTextSnippetViewSet(viewsets.ModelViewSet):
    serializer_class = s.SiteTextSnippetSerializer
    search_fields = ("key", "title", "text")

    def get_queryset(self):
        qs = models.SiteTextSnippet.objects.all().order_by("key")
        action = getattr(self, "action", None)
        if action in ("list", "retrieve"):
            return qs.filter(is_active=True)
        return qs

class LibraryPublicationEntryViewSet(viewsets.ModelViewSet):
    queryset = models.LibraryPublicationEntry.objects.all()
    serializer_class = s.LibraryPublicationEntrySerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ["category", "category__slug", "is_active", "is_featured", "year"]
    ordering_fields = ["published_at", "created_at", "year", "title"]
    search_fields = ["title", "subtitle", "authors", "description"]

    def get_queryset(self):
        qs = super().get_queryset()
        params = self.request.query_params

        if params.get("active", "true").lower() != "false":
            qs = qs.filter(is_active=True)

        if params.get("featured", "").lower() in ("true", "1", "yes"):
            qs = qs.filter(is_featured=True)

        category_value = params.get("category")
        if category_value:
            if category_value.isdigit():
                qs = qs.filter(category_id=int(category_value))
            else:
                qs = qs.filter(category__slug=category_value)

        return qs

    @action(detail=False, methods=["get"])
    def latest(self, request):
        limit = int(request.query_params.get("limit", 6))
        queryset = self.get_queryset().order_by("-published_at", "-created_at")[:limit]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class LibraryPublicationCategoryViewSet(viewsets.ModelViewSet):
    queryset = models.LibraryPublicationCategory.objects.all().order_by("position", "name")
    serializer_class = s.LibraryPublicationCategorySerializer
    filter_backends = [SearchFilter]
    search_fields = ["name", "description"]
