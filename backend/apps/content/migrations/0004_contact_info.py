from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0003_contact_message"),
    ]

    operations = [
        migrations.CreateModel(
            name="ContactInfo",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("organization", models.CharField(blank=True, max_length=255)),
                ("phone", models.CharField(blank=True, max_length=100)),
                ("email", models.EmailField(blank=True, max_length=254)),
                ("address", models.TextField(blank=True)),
                ("map_url", models.URLField(blank=True, help_text="Google Maps embed URL or share link")),
                ("map_embed", models.TextField(blank=True, help_text="Optional full <iframe> code for the map")),
            ],
            options={
                "verbose_name": "Contact information",
                "verbose_name_plural": "Contact information",
            },
        ),
    ]

