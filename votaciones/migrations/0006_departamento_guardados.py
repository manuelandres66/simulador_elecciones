# Generated by Django 3.2.5 on 2021-10-23 21:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('votaciones', '0005_alter_partido_code'),
    ]

    operations = [
        migrations.AddField(
            model_name='departamento',
            name='guardados',
            field=models.PositiveIntegerField(default=0),
            preserve_default=False,
        ),
    ]