from django.contrib import admin
from django.utils.html import format_html
from . import models


class NewsImageInline(admin.TabularInline):
    model = models.NewsImage
    extra = 1
    fields = ("image", "caption", "caption_si", "position", "preview")
    readonly_fields = ("preview",)

    def preview(self, obj):
        try:
            return format_html('<img src="{}" style="height:60px;border-radius:4px;" />', obj.image.url)
        except Exception:
            return ""


@admin.register(models.News)
class NewsAdmin(admin.ModelAdmin):
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height:40px;border-radius:4px;" />', obj.image.url)
        return ""

    list_display = ("title", "published_at", "is_featured", "image_preview")
    list_filter = ("is_featured", "published_at")
    search_fields = ("title", "title_si", "excerpt", "excerpt_si")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("created_at", "updated_at")
    inlines = [NewsImageInline]
    fieldsets = (
        ("English", {"fields": ("title", "slug", "excerpt", "content")}),
        ("Sinhala", {"fields": ("title_si", "excerpt_si", "content_si")}),
        ("Media", {"fields": ("image",)}),
        ("Publishing", {"fields": ("is_featured", "published_at", "created_at", "updated_at")}),
    )


class NoticeImageInline(admin.TabularInline):
    model = models.NoticeImage
    extra = 1
    fields = ("image", "caption", "caption_si", "position", "preview")
    readonly_fields = ("preview",)

    def preview(self, obj):
        try:
            return format_html('<img src="{}" style="height:60px;border-radius:4px;" />', obj.image.url)
        except Exception:
            return ""


@admin.register(models.Notice)
class NoticeAdmin(admin.ModelAdmin):
    list_display = ("title", "published_at", "expires_at", "priority")
    list_filter = ("published_at", "expires_at")
    search_fields = ("title", "title_si", "content", "content_si")
    inlines = [NoticeImageInline]
    fieldsets = (
        ("English", {"fields": ("title", "content")}),
        ("Sinhala", {"fields": ("title_si", "content_si")}),
        ("Meta", {"fields": ("image", "published_at", "expires_at", "priority")}),
    )

    def image_preview(self, obj):
        return format_html('<img src="{}" style="height:40px;border-radius:4px" />', obj.image.url) if obj.image else "-"

    image_preview.short_description = "Image"


@admin.register(models.Publication)
class PublicationAdmin(admin.ModelAdmin):
    def cover_preview(self, obj):
        if getattr(obj, "cover", None):
            try:
                return format_html('<img src="{}" style="height:40px;border-radius:4px;" />', obj.cover.url)
            except Exception:
                return ""
        return ""

    list_display = ("title", "category", "published_at", "is_active")
    list_filter = ("category", "is_active", "published_at")
    search_fields = ("title", "title_si", "description", "description_si")
    autocomplete_fields = ("category",)
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        ("English", {"fields": ("title", "description", "department", "category")}),
        ("Sinhala", {"fields": ("title_si", "description_si", "department_si")}),
        ("File", {"fields": ("file",)}),
        ("Publishing", {"fields": ("is_active", "published_at", "created_at", "updated_at")}),
    )


@admin.register(models.Video)
class VideoAdmin(admin.ModelAdmin):
    def thumb(self, obj):
        if getattr(obj, "thumbnail", None):
            try:
                return format_html('<img src="{}" style="height:40px;border-radius:4px;" />', obj.thumbnail.url)
            except Exception:
                return ""
        return ""

    list_display = ("title", "published_at", "thumb")
    list_filter = ("published_at",)
    search_fields = ("title", "title_si", "description", "description_si")
    fieldsets = (
        ("English", {"fields": ("title", "description")}),
        ("Sinhala", {"fields": ("title_si", "description_si")}),
        ("Source", {"fields": ("file", "url")}),
        ("Media", {"fields": ("thumbnail",)}),
        ("Publishing", {"fields": ("published_at",)}),
    )


class GalleryImageInline(admin.TabularInline):
    model = models.GalleryImage
    extra = 3
    fields = ("image", "caption", "caption_si", "position", "preview")
    readonly_fields = ("preview",)

    def preview(self, obj):
        try:
            return format_html('<img src="{}" style="height:60px;border-radius:4px" />', obj.image.url)
        except Exception:
            return ""


@admin.register(models.Album)
class AlbumAdmin(admin.ModelAdmin):
    list_display = ("title", "is_active", "position", "published_at", "thumb")
    list_editable = ("is_active", "position")
    search_fields = ("title", "title_si", "description", "description_si")
    list_filter = ("is_active", "published_at")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [GalleryImageInline]
    fieldsets = (
        ("English", {"fields": ("title", "slug", "description")}),
        ("Sinhala", {"fields": ("title_si", "description_si")}),
        ("Cover", {"fields": ("cover",)}),
        ("Status", {"fields": ("is_active", "position", "published_at")}),
    )

    def thumb(self, obj):
        if obj.cover:
            try:
                return format_html('<img src="{}" style="height:40px;border-radius:4px" />', obj.cover.url)
            except Exception:
                return ""
        return ""


@admin.register(models.Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("title", "start_date", "end_date")
    list_filter = ("start_date", "end_date")
    search_fields = ("title", "title_si", "description", "description_si")
    fields = ("title", "title_si", "description", "description_si", "start_date", "end_date")


@admin.register(models.Stat)
class StatAdmin(admin.ModelAdmin):
    list_display = ("label", "value")
    search_fields = ("label", "label_si", "value", "value_si")
    fields = ("label", "label_si", "value", "value_si")


@admin.register(models.ExternalLink)
class ExternalLinkAdmin(admin.ModelAdmin):
    list_display = ("name", "url", "position")
    list_editable = ("position",)
    search_fields = ("name", "name_si")
    fields = ("name", "name_si", "url", "position")


@admin.register(models.FooterLink)
class FooterLinkAdmin(admin.ModelAdmin):
    list_display = ("name", "url", "position", "is_active")
    list_editable = ("position", "is_active")
    search_fields = ("name", "name_si")
    list_filter = ("is_active",)
    fields = ("name", "name_si", "url", "position", "is_active")


class PublicationInline(admin.TabularInline):
    model = models.Publication
    fields = ("title", "title_si", "file", "external_url", "published_at", "is_active")
    extra = 1


@admin.register(models.DownloadCategory)
class DownloadCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "position", "created_at")
    list_editable = ("position",)
    search_fields = ("name", "name_si", "description", "description_si")
    fields = ("name", "name_si", "description", "description_si", "position")
    inlines = [PublicationInline]


@admin.register(models.HeroSlide)
class HeroSlideAdmin(admin.ModelAdmin):
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height:40px;border-radius:4px;" />', obj.image.url)
        return ""

    list_display = ("title", "position", "created_at", "image_preview")
    list_editable = ("position",)
    search_fields = ("title", "title_si", "subtitle", "subtitle_si")
    readonly_fields = ("created_at", "updated_at")
    exclude = ("button_label", "button_label_si", "button_url")
    fieldsets = (
        ("English", {"fields": ("title", "subtitle")}),
        ("Sinhala", {"fields": ("title_si", "subtitle_si")}),
        ("Media", {"fields": ("image",)}),
        ("Ordering", {"fields": ("position",)}),
        ("Meta", {"fields": ("created_at", "updated_at")}),
    )


@admin.register(models.NewsletterSubscription)
class NewsletterSubscriptionAdmin(admin.ModelAdmin):
    list_display = ("email", "created_at")
    search_fields = ("email",)


@admin.register(models.ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "subject", "created_at", "is_handled")
    list_filter = ("is_handled", "created_at")
    search_fields = ("name", "email", "subject", "message")
    readonly_fields = ("created_at", "updated_at")

@admin.register(models.FooterAbout)
class FooterAboutAdmin(admin.ModelAdmin):
    list_display = ("title", "is_active", "updated_at")
    list_filter = ("is_active",)
    search_fields = ("title", "title_si", "body", "body_si")
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        ("English", {"fields": ("title", "body")}),
        ("Sinhala", {"fields": ("title_si", "body_si")}),
        ("Meta", {"fields": ("is_active", "created_at", "updated_at")}),
    )




class LibraryPublicationImageInline(admin.TabularInline):
    model = models.LibraryPublicationImage
    extra = 1


@admin.register(models.LibraryPublicationCategory)
class LibraryPublicationCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "position", "created_at")
    list_editable = ("position",)
    search_fields = ("name", "name_si", "description", "description_si")
    readonly_fields = ("created_at", "updated_at")
    prepopulated_fields = {"slug": ("name",)}
    fieldsets = (
        ("English", {"fields": ("name", "description")}),
        ("Sinhala", {"fields": ("name_si", "description_si")}),
        ("Ordering", {"fields": ("position",)}),
        ("System", {"fields": ("slug", "created_at", "updated_at")}),
    )


@admin.register(models.LibraryPublicationEntry)
class LibraryPublicationEntryAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "year", "published_at", "is_active", "is_featured")
    list_filter = ("is_active", "is_featured", "category", "year")
    search_fields = ("title", "title_si", "subtitle", "subtitle_si", "authors", "authors_si", "description", "description_si")
    readonly_fields = ("created_at", "updated_at")
    inlines = [LibraryPublicationImageInline]
    fieldsets = (
        ("English", {"fields": ("category", "title", "subtitle", "authors", "year", "description")}),
        ("Sinhala", {"fields": ("title_si", "subtitle_si", "authors_si", "description_si")}),
        ("Media", {"fields": ("cover", "pdf_file", "external_url")}),
        ("Status & Dates", {"fields": ("published_at", "is_active", "is_featured")}),
        ("System", {"fields": ("created_at", "updated_at")}),
    )
@admin.register(models.HeroIntro)
class HeroIntroAdmin(admin.ModelAdmin):
    list_display = ("heading", "highlight", "is_active", "updated_at")
    list_filter = ("is_active",)
    search_fields = ("heading", "highlight")
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        ("English", {"fields": ("heading", "highlight", "description", "primary_label", "secondary_label")}),
        ("Sinhala", {"fields": ("heading_si", "highlight_si", "description_si", "primary_label_si", "secondary_label_si")}),
        ("Links", {"fields": ("primary_url", "secondary_url")}),
        ("Status", {"fields": ("is_active", "created_at", "updated_at")}),
    )


@admin.register(models.AboutSection)
class AboutSectionAdmin(admin.ModelAdmin):
    list_display = ("nav_label", "title", "position", "is_active")
    list_editable = ("position", "is_active")
    list_filter = ("is_active",)
    search_fields = ("nav_label", "title", "body")
    prepopulated_fields = {"slug": ("nav_label",)}
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        ("Menu label", {"fields": ("nav_label", "nav_label_si", "slug", "position", "is_active")}),
        ("Content", {"fields": ("title", "title_si", "body", "body_si")}),
        ("System", {"fields": ("created_at", "updated_at")}),
    )


@admin.register(models.SiteTextSnippet)
class SiteTextSnippetAdmin(admin.ModelAdmin):
    list_display = ("key", "title", "is_active", "updated_at")
    list_filter = ("is_active",)
    search_fields = ("key", "title", "text")
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        (None, {"fields": ("key", "title", "notes", "is_active")}),
        ("English", {"fields": ("text",)}),
        ("Sinhala", {"fields": ("text_si",)}),
        ("System", {"fields": ("created_at", "updated_at")}),
    )




