from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Avg, Max, Min, Sum, IntegerField
import json
from .models import Departamento, Partido, Votacion

#Algortimos

def get_votes():
    respuesta = {}
    partidos = Partido.objects.all()
    for partido in partidos:
        votaciones = Votacion.objects.filter(para=partido)
        votos_totales = sum(votacion.votos for votacion in votaciones)
        respuesta[partido.code] = votos_totales
    return respuesta

def dhondt():
    votosT = Votacion.objects.aggregate(votos=Sum('votos'))
    umbral = votosT['votos'] * 0.03

    #Eliminado Partido que no pasan el umbral
    votos_por_partido = get_votes()
    votos_reales_partido = {} #Guardar los partidos que si pasan
    for partido in votos_por_partido:
        votos = votos_por_partido[partido]
        if votos > umbral:
            votos_reales_partido[partido] = votos
    
    votaciones_divididas = [] #Para guardar /1 /2 /3 etc...
    for partido in votos_reales_partido:
        votos_partido = votos_por_partido[partido]
        for i in range(1, 101):
            votaciones_divididas.append((partido, votos_partido / i))

    votaciones_divididas.sort(
        key=lambda x: x[1], reverse=True
    )
    votaciones_divididas = votaciones_divididas[:100]
    partidos = list(map(lambda x: x[0], votaciones_divididas))
    return {partido.code: partidos.count(partido.code) for partido in Partido.objects.all()}
        
        


# Create your views here.

def index(request):
    print(dhondt())
    return render(request, 'index.html')

def department(request, code):
    department = Departamento.objects.get(iso=code)
    votos = Votacion.objects.filter(desde=department).order_by('-votos')
    return render(request, 'department.html', {'department': department, 'votos': votos})

def party(request, code):
    party = Partido.objects.get(code=code)
    votos_totales = Votacion.objects.aggregate(votos=Sum('votos'))
    votos_partido = Votacion.objects.filter(para=party).aggregate(suma=Sum('votos'), promedio=Avg('votos', output_field=IntegerField()), maximo=Max('votos'), minimo=Min('votos'))
    escanos = dhondt()[party.code]
    return render(request, 'partido.html', {'partido': party, 'votos_totales' : votos_totales, 'votos_partido' : votos_partido, 'escanos' : escanos})

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