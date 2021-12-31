# Generated by Django 3.2.5 on 2021-10-21 02:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('votaciones', '0003_politico'),
    ]

    operations = [
        migrations.AddField(
            model_name='partido',
            name='politicos',
            field=models.ManyToManyField(blank=True, related_name='partido', to='votaciones.Politico'),
        ),
    ]