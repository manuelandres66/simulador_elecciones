# Generated by Django 3.2.5 on 2021-10-21 02:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('votaciones', '0004_partido_politicos'),
    ]

    operations = [
        migrations.AlterField(
            model_name='partido',
            name='code',
            field=models.CharField(max_length=4, unique=True),
        ),
    ]
