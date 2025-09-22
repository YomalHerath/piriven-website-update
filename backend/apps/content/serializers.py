from rest_framework import serializers
from . import models


class NewsImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.NewsImage
        fields = [
            "id",
            "image",
            "caption",
            "caption_si",
            "position",
            "created_at",
            "updated_at",
        ]


class NewsSerializer(serializers.ModelSerializer):
    gallery_images = NewsImageSerializer(many=True, read_only=True)

    class Meta:
        model = models.News
        fields = [
            "id",
            "title",
            "title_si",
            "slug",
            "image",
            "excerpt",
            "excerpt_si",
            "content",
            "content_si",
            "published_at",
            "is_featured",
            "created_at",
            "updated_at",
            "gallery_images",
        ]


class NoticeImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.NoticeImage
        fields = [
            "id",
            "image",
            "caption",
            "caption_si",
            "position",
            "created_at",
            "updated_at",
        ]


class NoticeSerializer(serializers.ModelSerializer):
    gallery_images = NoticeImageSerializer(many=True, read_only=True)

    class Meta:
        model = models.Notice
        fields = [
            "id",
            "title",
            "title_si",
            "content",
            "content_si",
            "image",
            "published_at",
            "expires_at",
            "priority",
            "created_at",
            "updated_at",
            "gallery_images",
        ]


class PublicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Publication
        fields = "__all__"


class DownloadCategorySerializer(serializers.ModelSerializer):
    publications = PublicationSerializer(many=True, read_only=True)

    class Meta:
        model = models.DownloadCategory
        fields = [
            "id",
            "name", "name_si",
            "description", "description_si",
            "position",
            "created_at",
            "updated_at",
            "publications",
        ]


class VideoSerializer(serializers.ModelSerializer):
    playback_url = serializers.SerializerMethodField()

    class Meta:
        model = models.Video
        fields = "__all__"   # includes file, url, thumbnail, etc.
        # Or list explicitly:
        # fields = ["id","title","file","url","thumbnail","description","published_at","created_at","updated_at","playback_url"]

    def get_playback_url(self, obj):
        # Return relative path for uploaded files (frontend uses mediaUrl to make it absolute)
        return obj.url or (obj.file.url if obj.file else "")


class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.GalleryImage
        fields = ["id", "image", "caption", "caption_si", "position", "created_at", "updated_at"]

class AlbumSerializer(serializers.ModelSerializer):
    images = GalleryImageSerializer(many=True, read_only=True)

    class Meta:
        model = models.Album
        fields = [
            "id", "title", "title_si", "slug", "description", "description_si", "cover",
            "is_active", "position", "published_at",
            "images", "created_at", "updated_at",
        ]


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Event
        fields = "__all__"


class StatSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Stat
        fields = "__all__"


class ExternalLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ExternalLink
        fields = "__all__"


class HeroSlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.HeroSlide
        fields = "__all__"


class NewsletterSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.NewsletterSubscription
        fields = "__all__"


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ContactMessage
        fields = ["id", "name", "email", "subject", "message", "created_at"]


class ContactInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ContactInfo
        fields = "__all__"


class FooterAboutSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.FooterAbout
        fields = "__all__"


class FooterLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.FooterLink
        fields = "__all__"


class HeroIntroSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.HeroIntro
        fields = "__all__"


class AboutSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AboutSection
        fields = [
            "id", "slug", "nav_label", "nav_label_si", "title", "title_si",
            "body", "body_si", "position", "is_active", "created_at", "updated_at",
        ]


class SiteTextSnippetSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.SiteTextSnippet
        fields = [
            "id", "key", "title", "text", "text_si", "notes", "is_active",
            "created_at", "updated_at",
        ]


class LibraryPublicationImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.LibraryPublicationImage
        fields = ["id", "image", "caption", "caption_si", "created_at", "updated_at"]


class LibraryPublicationCategoryMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.LibraryPublicationCategory
        fields = ["id", "name", "name_si", "slug"]


class LibraryPublicationEntrySerializer(serializers.ModelSerializer):
    category = LibraryPublicationCategoryMiniSerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=models.LibraryPublicationCategory.objects.all(),
        source="category",
        write_only=True,
        required=False,
        allow_null=True,
    )
    images = LibraryPublicationImageSerializer(many=True, read_only=True)
    download_href = serializers.ReadOnlyField()

    class Meta:
        model = models.LibraryPublicationEntry
        fields = [
            "id",
            "category", "category_id",
            "title", "title_si", "subtitle", "subtitle_si", "authors", "authors_si", "year", "description", "description_si",
            "cover", "pdf_file", "external_url", "download_href",
            "published_at", "is_active", "is_featured",
            "images",
            "created_at", "updated_at",
        ]


class LibraryPublicationCategorySerializer(serializers.ModelSerializer):
    publications_count = serializers.IntegerField(source="publications.count", read_only=True)

    class Meta:
        model = models.LibraryPublicationCategory
        fields = [
            "id",
            "name", "name_si",
            "slug",
            "description", "description_si",
            "position",
            "created_at",
            "updated_at",
            "publications_count",
        ]

