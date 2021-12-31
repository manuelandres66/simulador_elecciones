from django.contrib import admin
from .models import Departamento, Partido, Votacion, Politico
# Register your models here.

class Departament(admin.ModelAdmin):
    list_display = ('iso','nombre')

class Partid(admin.ModelAdmin):
    list_display = ('code','nombre')

admin.site.register(Departamento, Departament)
admin.site.register(Partido, Partid)
admin.site.register(Votacion)
admin.site.register(Politico)
