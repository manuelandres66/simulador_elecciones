# Generated by Django 3.2.5 on 2021-10-21 02:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('votaciones', '0002_partido_voto_en_blanco'),
    ]

    operations = [
        migrations.CreateModel(
            name='Politico',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=250)),
                ('orden', models.PositiveIntegerField()),
            ],
        ),
    ]
