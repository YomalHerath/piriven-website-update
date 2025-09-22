from django.db import models
from django.utils.text import slugify
from django.core.exceptions import ValidationError


class TimeStamped(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class News(TimeStamped):
    title = models.CharField(max_length=255)
    title_si = models.CharField(max_length=255, blank=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    image = models.ImageField(upload_to="news", blank=True, null=True)
    excerpt = models.TextField(blank=True)
    excerpt_si = models.TextField(blank=True)
    content = models.TextField()
    content_si = models.TextField(blank=True)
    published_at = models.DateTimeField()
    is_featured = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "News"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class NewsImage(TimeStamped):
    news = models.ForeignKey(News, on_delete=models.CASCADE, related_name="gallery_images")
    image = models.ImageField(upload_to="news/gallery")
    caption = models.CharField(max_length=255, blank=True)
    caption_si = models.CharField(max_length=255, blank=True)
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["position", "id"]
        verbose_name = "News image"
        verbose_name_plural = "News images"

    def __str__(self):
        return self.caption or f"Image for {self.news.title}"


class Notice(TimeStamped):
    title = models.CharField(max_length=255)
    title_si = models.CharField(max_length=255, blank=True)
    content = models.TextField()
    content_si = models.TextField(blank=True)
    image = models.ImageField(upload_to="notice", blank=True, null=True)
    published_at = models.DateTimeField()
    expires_at = models.DateTimeField(blank=True, null=True)
    priority = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["-published_at", "-priority"]

    def __str__(self):
        return self.title


class NoticeImage(TimeStamped):
    notice = models.ForeignKey(Notice, on_delete=models.CASCADE, related_name="gallery_images")
    image = models.ImageField(upload_to="notice/gallery")
    caption = models.CharField(max_length=255, blank=True)
    caption_si = models.CharField(max_length=255, blank=True)
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["position", "id"]
        verbose_name = "Notice image"
        verbose_name_plural = "Notice images"

    def __str__(self):
        return self.caption or f"Image for {self.notice.title}"


class Publication(TimeStamped):
    title = models.CharField(max_length=255)
    title_si = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    description_si = models.TextField(blank=True)
    file = models.FileField(upload_to="publications")
    external_url = models.URLField(blank=True, help_text="Optional external link instead of file")
    published_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    cover = models.ImageField(upload_to="publication_covers", blank=True, null=True)
    department = models.CharField(max_length=255, blank=True)
    department_si = models.CharField(max_length=255, blank=True)
    # Category is added below via DownloadCategory foreign key once the model is declared

    class Meta:
        verbose_name = "Downloadable file"
        verbose_name_plural = "Downloadable files"

    def __str__(self):
        return self.title


class Video(TimeStamped):
    title = models.CharField(max_length=255)
    title_si = models.CharField(max_length=255, blank=True)
    url = models.URLField(
        blank=True,
        help_text="YouTube/Vimeo or direct URL. Leave empty if uploading a file."
    )
    file = models.FileField(
        upload_to="videos",
        blank=True,
        null=True,
        help_text="Upload MP4/WebM etc. Leave empty if using a URL."
    )
    description = models.TextField(blank=True)
    description_si = models.TextField(blank=True)
    published_at = models.DateTimeField()
    thumbnail = models.ImageField(upload_to="video_thumbs", blank=True, null=True)

    def clean(self):
        # Ensure at least one of file/url is set
        if not self.file and not self.url:
            raise ValidationError("Provide either a video file or an external URL.")
        return super().clean()

    @property
    def playback_url(self) -> str:
        """Prefer external URL; otherwise return the uploaded file URL."""
        if self.url:
            return self.url
        return self.file.url if self.file else ""

    def __str__(self):
        return self.title


class Album(TimeStamped):
    title = models.CharField(max_length=200)
    title_si = models.CharField(max_length=200, blank=True)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    description = models.TextField(blank=True)
    description_si = models.TextField(blank=True)
    cover = models.ImageField(upload_to="albums/covers/", blank=True, null=True)
    is_active = models.BooleanField(default=True)
    position = models.PositiveIntegerField(default=0)
    published_at = models.DateField(blank=True, null=True)

    class Meta:
        ordering = ["position", "-published_at", "-created_at"]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)[:220]
        super().save(*args, **kwargs)

class GalleryImage(TimeStamped):
    album = models.ForeignKey(Album, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="albums/images/")
    caption = models.CharField(max_length=255, blank=True)
    caption_si = models.CharField(max_length=255, blank=True)
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["position", "created_at"]

    def __str__(self):
        return f"{self.album.title} - {self.caption or self.image.name}"


class Event(TimeStamped):
    title = models.CharField(max_length=255)
    title_si = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    description_si = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.title


class Stat(TimeStamped):
    label = models.CharField(max_length=100)
    label_si = models.CharField(max_length=100, blank=True)
    value = models.CharField(max_length=50)
    value_si = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return f"{self.label}: {self.value}"


class ExternalLink(TimeStamped):
    name = models.CharField(max_length=255)
    name_si = models.CharField(max_length=255, blank=True)
    url = models.URLField()
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["position", "name"]

    def __str__(self):
        return self.name


class FooterLink(TimeStamped):
    name = models.CharField(max_length=255)
    name_si = models.CharField(max_length=255, blank=True)
    url = models.URLField()
    position = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["position", "name"]
        verbose_name = "Footer link"
        verbose_name_plural = "Footer links"

    def __str__(self):
        return self.name


class HeroSlide(TimeStamped):
    title = models.CharField(max_length=255)
    title_si = models.CharField(max_length=255, blank=True)
    subtitle = models.CharField(max_length=255, blank=True)
    subtitle_si = models.CharField(max_length=255, blank=True)
    image = models.ImageField(upload_to="slides")
    button_label = models.CharField(max_length=100, blank=True)
    button_label_si = models.CharField(max_length=100, blank=True)
    button_url = models.URLField(blank=True)
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["position", "-created_at"]

    def __str__(self):
        return self.title


class NewsletterSubscription(TimeStamped):
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.email


class DownloadCategory(TimeStamped):
    name = models.CharField(max_length=255)
    name_si = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    description_si = models.TextField(blank=True)
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["position", "name"]

    def __str__(self):
        return self.name


# Link Publication to DownloadCategory
Publication.add_to_class(
    "category",
    models.ForeignKey(
        DownloadCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="publications",
    ),
)






class LibraryPublicationCategory(TimeStamped):
    name = models.CharField(max_length=200, unique=True)
    name_si = models.CharField(max_length=200, blank=True)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    description = models.TextField(blank=True)
    description_si = models.TextField(blank=True)
    position = models.PositiveIntegerField(default=0, help_text="Order categories by this field (ascending).")

    class Meta:
        ordering = ["position", "name"]
        verbose_name = "Book category"
        verbose_name_plural = "Book categories"
        db_table = "library_publicationcategory"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)[:220]
        super().save(*args, **kwargs)


class LibraryPublicationEntry(TimeStamped):
    category = models.ForeignKey("LibraryPublicationCategory", on_delete=models.SET_NULL, null=True, blank=True, related_name="publications")
    title = models.CharField(max_length=255)
    title_si = models.CharField(max_length=255, blank=True)
    subtitle = models.CharField(max_length=255, blank=True)
    subtitle_si = models.CharField(max_length=255, blank=True)
    authors = models.CharField(max_length=255, blank=True, help_text="Comma-separated author names")
    authors_si = models.CharField(max_length=255, blank=True, help_text="Sinhala author names (optional)")
    year = models.PositiveIntegerField(null=True, blank=True)
    description = models.TextField(blank=True)
    description_si = models.TextField(blank=True)

    cover = models.ImageField(upload_to="publication_covers/", blank=True, null=True)
    pdf_file = models.FileField(upload_to="publications/", blank=True, null=True, help_text="Optional PDF for the book")
    external_url = models.URLField(blank=True, help_text="If provided, link to this instead of pdf_file")

    published_at = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False, help_text="Show in homepage Publications section")

    class Meta:
        ordering = ["-published_at", "-created_at"]
        verbose_name = "Book (Library)"
        verbose_name_plural = "Books (Library)"
        db_table = "library_publicationentry"

    def clean(self):
        if not self.pdf_file and not self.external_url:
            raise ValidationError("Upload a PDF file or provide an external URL.")

    def __str__(self):
        return self.title

    @property
    def download_href(self) -> str:
        if self.external_url:
            return self.external_url
        return self.pdf_file.url if self.pdf_file else ""


class LibraryPublicationImage(TimeStamped):
    publication = models.ForeignKey("LibraryPublicationEntry", on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="publication_images/")
    caption = models.CharField(max_length=255, blank=True)
    caption_si = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ["created_at"]
        verbose_name = "Publication Image"
        verbose_name_plural = "Publication Images"
        db_table = "library_publicationimage"

    def __str__(self):
        return f"Image for {self.publication.title}"


class HeroIntro(TimeStamped):
    heading = models.CharField(max_length=255, blank=True)
    heading_si = models.CharField(max_length=255, blank=True)
    highlight = models.CharField(max_length=255, blank=True)
    highlight_si = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    description_si = models.TextField(blank=True)
    primary_label = models.CharField(max_length=120, blank=True)
    primary_label_si = models.CharField(max_length=120, blank=True)
    primary_url = models.URLField(blank=True)
    secondary_label = models.CharField(max_length=120, blank=True)
    secondary_label_si = models.CharField(max_length=120, blank=True)
    secondary_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Hero intro"
        verbose_name_plural = "Hero intro"

    def __str__(self):
        return self.heading or "Hero intro"


class AboutSection(TimeStamped):
    slug = models.SlugField(max_length=160, unique=True)
    nav_label = models.CharField(max_length=255)
    nav_label_si = models.CharField(max_length=255, blank=True)
    title = models.CharField(max_length=255)
    title_si = models.CharField(max_length=255, blank=True)
    body = models.TextField(blank=True)
    body_si = models.TextField(blank=True)
    position = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["position", "nav_label"]
        verbose_name = "About section"
        verbose_name_plural = "About sections"

    def __str__(self):
        return self.nav_label


class SiteTextSnippet(TimeStamped):
    key = models.CharField(max_length=150, unique=True)
    title = models.CharField(max_length=255, blank=True)
    text = models.TextField(blank=True)
    text_si = models.TextField(blank=True)
    notes = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["key"]
        verbose_name = "Site text snippet"
        verbose_name_plural = "Site text snippets"

    def __str__(self):
        return self.title or self.key


class ContactMessage(TimeStamped):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    subject = models.CharField(max_length=255, blank=True)
    message = models.TextField()
    is_handled = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} - {self.subject or 'Message'}"


class ContactInfo(TimeStamped):
    organization = models.CharField(max_length=255, blank=True)
    organization_si = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=100, blank=True)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    address_si = models.TextField(blank=True)
    map_url = models.URLField(blank=True, help_text="Google Maps embed URL or share link")
    map_embed = models.TextField(blank=True, help_text="Optional full <iframe> code for the map")
    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        blank=True,
        null=True,
        help_text="Decimal latitude (e.g. 7.290572)",
    )
    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        blank=True,
        null=True,
        help_text="Decimal longitude (e.g. 80.633728)",
    )
    map_zoom = models.PositiveSmallIntegerField(
        default=15,
        help_text="Map zoom level for embeds (1-20)",
    )

    class Meta:
        verbose_name = "Contact information"
        verbose_name_plural = "Contact information"

    def __str__(self):
        return self.organization or "Contact Info"


class FooterAbout(TimeStamped):
    title = models.CharField(max_length=255, blank=True)
    title_si = models.CharField(max_length=255, blank=True)
    body = models.TextField(blank=True)
    body_si = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["-updated_at", "-created_at"]
        verbose_name = "Footer about"
        verbose_name_plural = "Footer about"

    def __str__(self):
        return self.title or "Footer about"

