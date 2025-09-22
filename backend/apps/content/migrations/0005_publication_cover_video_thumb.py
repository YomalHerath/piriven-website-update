from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0004_contact_info"),
    ]

    operations = [
        migrations.AddField(
            model_name="publication",
            name="cover",
            field=models.ImageField(blank=True, null=True, upload_to="publication_covers"),
        ),
        migrations.AddField(
            model_name="video",
            name="thumbnail",
            field=models.ImageField(blank=True, null=True, upload_to="video_thumbs"),
        ),
    ]

