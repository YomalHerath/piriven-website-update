from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0002_downloads"),
    ]

    operations = [
        migrations.CreateModel(
            name="ContactMessage",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("name", models.CharField(max_length=255)),
                ("email", models.EmailField(max_length=254)),
                ("subject", models.CharField(blank=True, max_length=255)),
                ("message", models.TextField()),
                ("is_handled", models.BooleanField(default=False)),
            ],
            options={"ordering": ["-created_at"]},
        ),
    ]

