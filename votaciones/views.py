from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Avg, Max, Min, Sum, IntegerField
import json
from .models import Departamento, Partido, Votacion
# Create your views here.

def index(request):
    return render(request, 'index.html')

def department(request, code):
    department = Departamento.objects.get(iso=code)
    votos = Votacion.objects.filter(desde=department).order_by('-votos')
    return render(request, 'department.html', {'department': department, 'votos': votos})

def party(request, code):
    party = Partido.objects.get(code=code)
    votos_totales = Votacion.objects.aggregate(votos=Sum('votos'))
    votos_partido = Votacion.objects.filter(para=party).aggregate(suma=Sum('votos'), promedio=Avg('votos', output_field=IntegerField()), maximo=Max('votos'), minimo=Min('votos'))
    return render(request, 'partido.html', {'partido': party, 'votos_totales' : votos_totales, 'votos_partido' : votos_partido})

def save(request):
    if request.method != 'POST':
        return JsonResponse({"error" : "Invalid Method"})

    data = json.loads(request.body)
    if 'code' not in data or 'departments' not in data: 
        return JsonResponse({"error" : "No Valid Arguments"})

    departmento = Departamento.objects.get(iso=data['code'])

    total = 0
    for depa in data['departments']:
        partido = Partido.objects.get(code=depa['code'])
        vota = Votacion.objects.get(desde=departmento, para=partido)
        vota.votos = depa['votes']
        vota.save()
        total += depa['votes']

    departmento.guardados = total
    departmento.save()

    return JsonResponse({"message" : "okey"})