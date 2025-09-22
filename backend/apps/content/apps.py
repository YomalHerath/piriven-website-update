from django.apps import AppConfig


class ContentConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.content"
    verbose_name = "Site Content"

    def ready(self):
        from django.contrib import admin
        admin.site.site_header = "Admin Dashboard"
        admin.site.site_title = "Piriven Admin"
        admin.site.index_title = "Site Content Management"
