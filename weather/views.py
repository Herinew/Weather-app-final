from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from django.core.exceptions import ObjectDoesNotExist
from .models import City
import json

# Create your views here.
def index(request):
    return render(request, "weather/index.html")

@csrf_exempt
def cities(request):

    if request.method == 'GET':
        cities = City.objects.all()
        if cities.count() == 0:
            return JsonResponse({"error": "Entries doesn't exist."})
        else:
            return JsonResponse([city.serialize() for city in cities], safe=False)
        
    elif request.method == 'POST':
        data = json.loads(request.body)
        name = data["name"]
        lat = data["lat"]
        lon = data["lon"]
        user = data["user"]

        obj = City.objects.filter(name=name, user=user).all()
        if obj.count() != 0:
            return JsonResponse({"error": "City, already exist!"})
        else:
            obj = City(name=name, lat=lat, lon=lon, user=user)
            obj.save()
            return JsonResponse({"success": True})
    else:
        return JsonResponse({"error": "GET or POST request required"})

@csrf_exempt
def cities_user(request, id):

    if request.method == 'GET':
        cities = City.objects.filter(user=id)
        if cities.count() == 0:
            return JsonResponse({"error": "Entry doesn't exist."})
        else:
            return JsonResponse([city.serialize() for city in cities], safe=False)

    else:
        return JsonResponse({"error": "GET request required"})

@csrf_exempt
def cities_user_del(request, name, id):

    if request.method == 'DELETE':
        cities = City.objects.filter(user=id, name=name)
        if cities.count() == 0:
            return JsonResponse({"error": "Entry doesn't exist."})
        else:      
            cities.delete()
            return JsonResponse({"success": True})

    else:
        return JsonResponse({"error": "DELETE request required"})
