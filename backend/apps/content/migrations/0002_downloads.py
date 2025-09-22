from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="publication",
            name="external_url",
            field=models.URLField(blank=True, help_text="Optional external link instead of file"),
        ),
        migrations.AddField(
            model_name="publication",
            name="is_active",
            field=models.BooleanField(default=True),
        ),
        migrations.CreateModel(
            name="DownloadCategory",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("name", models.CharField(max_length=255)),
                ("description", models.TextField(blank=True)),
                ("position", models.PositiveIntegerField(default=0)),
            ],
            options={"ordering": ["position", "name"]},
        ),
        migrations.AddField(
            model_name="publication",
            name="category",
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="publications", to="content.downloadcategory"),
        ),
    ]

