from django.db import models

# Create your models here.
class Departamento(models.Model):
    nombre = models.CharField(max_length=250)
    iso = models.CharField(max_length=6, unique=True)
    aptos = models.PositiveIntegerField()
    usuales = models.PositiveIntegerField()
    guardados = models.PositiveIntegerField()

class Votacion(models.Model):
    votos = models.PositiveIntegerField()
    desde = models.ForeignKey(Departamento, related_name='votos', on_delete=models.CASCADE)
    para = models.ForeignKey('Partido', related_name='votos', on_delete=models.CASCADE)
    usuales = models.PositiveIntegerField()

class Politico(models.Model):
    nombre = models.CharField(max_length=250)
    orden = models.PositiveIntegerField()

class Partido(models.Model):
    nombre = models.CharField(max_length=250)
    code = models.CharField(max_length=4, unique=True)
    voto_en_blanco = models.BooleanField(default=False)
    politicos = models.ManyToManyField(Politico, related_name='partido', blank=True)
    color = models.CharField(max_length=7, default="#000000")
