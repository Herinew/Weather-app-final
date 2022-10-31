# Weather App. Final project CS50’s Web Programming with Python and JavaScript.

Weather App is a dynamic website that allows you to obtain the current weather status and forecast up to 8 days later, both in metric and imperial measurements of the current location or searches by city names. This website obtains and displays important data such as the coordinates, time zone, date and time of the site where the query is made.

It not only presents the information, but also allows a graphic display with the icons of each weather state. It contains a search engine that automatically completes the request at the top of the main content area in which the added cities are displayed, since the application offers the user the possibility of consulting, saving or deleting cities from a follow-up list for future consultation. Not allowing to duplicate the cities that are already in the watchlist showing an error: “City, already exists!”. 
 
It presents an additional content space that allows minimizing or expanding the information to be consulted. In addition, it allows you to change the measurements from Celsius °C to Fahrenheit °F. Closing the Weather App saves the information and opening it later keeps the watchlist. 
 
This project was built with the Django framework for the back-end, SQLlite by default as the database, JavaScript on the front-end along with HTML and CSS for structure and design, thus creating a dynamic app. 
 
The app complies with mobile-responsive, being compatible with all mobile devices, tables and desktops.


## Distinctiveness and Complexity:

This project is a set of techniques and methods learned during the course. 
 
It has similarities and at the same time differences with other projects. Its complexity lies in the fact that the app uses fetch to make all data requests to both the local API and the OpenWeather API. The first API allows you to consult, save and delete the cities that the user wants to have a complete follow-up according to their needs. On the other hand, the second API allows you to obtain all the data that describes the weather by responding to the city that you enter or the user's location. 
 
Regarding the functionality of the project, it can also be said that, unlike the previous ones, it consumes two different APIs using asynchronous techniques which allow for more interactive user interfaces, thus avoiding constant rendering from the server.


## Requirements: 
 
Django.


## Facility: 
 
In the requirements.txt file are all the dependencies used in the project. Executing the command:

    pip install –r requirements.txt 

installs everything necessary for its correct execution. 
 
Make and apply the migrations to the database, we execute:

    python manage.py makemigrations weather

 and then: 
 
    python manage.py migrate. 
 
Finally, to start the web server, we execute: 

    python manage.py runserver.


## Files and directories: 

    * weather - main directory. 

        * models.py - contains the City model used for this project. 

        * urls.py - in it are all the urls that the project responds. 

        * views.py - in this file all views of the project are processed by calling the corresponding functions according to the specified url. 

        * \templates\weather\ 

            * layout.html - part of the app structure the links to css libraries and external scripts used. 

            * Index.html - rest of the main structure of the app. 

        * \static\weather\ 

            * img  

                * cloudy-day.svg - used as main logo. 

                * navigation.svg - used as a button to initiate access to the user's location. 

            * Js 

                * index.js - are all the functions that are executed in the front-end of the app. 

                * momenttimezonewithdata.js - file to work with time zone from moment.js library. 

            * css 

                * styles.css - in it are the custom cascading styles that the app uses. 

Note: the rest of the files are from the Django installation and have not been modified. 


## Models.py

    from django.db import models

    class City(models.Model):
        name = models.CharField(max_length=100)
        lat = models.FloatField(max_length=12)
        lon = models.FloatField(max_length=12)
        user = models.IntegerField("user-id")

        def serialize(self):
            return {
                "id": self.id,
                "name": self.name,
                "lat": self.lat,
                "lon": self.lon,
                "user": self.user
            }


## Urls.py

    from django.urls import path
    from django.urls.resolvers import URLPattern
    from . import views

    urlpatterns = [
        path('', views.index, name='index'),
        path('cities', views.cities, name='cities'),
        path('cities/<int:id>', views.cities_user, name='cities_user'),
        path('cities/<int:id>/<str:name>/del', views.cities_user_del, name='cities_user_del')
    ]


## Views.py

    from django.shortcuts import render
    from django.http import HttpResponse, JsonResponse
    from django.views.decorators.csrf import csrf_exempt
    from django.db import IntegrityError
    from django.core.exceptions import ObjectDoesNotExist
    from .models import City
    import json

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


## Layout.html

    {% load static %}

    <!DOCTYPE html>
    <html lang="en">

        <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        <link rel="stylesheet" href="{% static 'weather/css/styles.css' %}">
        <title>{% block title %}Weather App{% endblock %}</title>
        </head>

        <body>
            <div class="container">
                <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <div class="container">
                    <a class="navbar-brand" href="#"><img class="d-inline-block aling-top"
                        src="{% static 'weather/img/cloudy-day.svg' %}" id="navbar-brand-logo" alt="">WeatherApp</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                    <form class="d-flex ms-auto">
                        <input list="search-cities" name="cities" class="form-control form-control-sm me-1" placeholder="City name"
                        id="input-search">
                        <datalist id="search-cities">
                        </datalist>
                        <button class="btn btn-outline-primary btn-sm" type="button" id="search" disabled>Search</button>
                    </form>
                    <div class="ms-auto mt-2">
                        <a href="#"><img src="{% static 'weather/img/navigation.svg' %}" style="width: 20px; height: 20px;" id="location-logo" alt=""></a>
                        <div class="d-inline-flex btn-group-sm ms-1" role="group" aria-label="Basic radio toggle button group">
                        <input type="radio" class="btn-check" name="btnradio" id="btnradio1" value="metric" autocomplete="off">
                        <label class="btn btn-outline-primary me-1" for="btnradio1">Metric: °C. m/s</label>
                        <input type="radio" class="btn-check" name="btnradio" id="btnradio2" value="imperial" autocomplete="off" checked>
                        <label class="btn btn-outline-primary" for="btnradio2">Imperial: °F, mph</label>
                        </div>
                    </div>
                    </div>
                </div>
                </nav>
                <header class="py-3 mb-3 border-bottom">
                <div class="d-flex flex-column flex-md-row" style="max-width: fit-content;">
                    <div class="d-flex flex-column flex-md-row mb-2" id="div_button_cities"></div>
                    <div class="d-flex mb-2"><button class="btn btn-outline-primary btn-sm w-100" type="button" id="add_city">Add city</button></div>
                </div>
                </header>

                <div class="body">
                {% block body %}
                {% endblock %}
                </div>

                <footer class="footer mt-5 py-3 bg-light">
                <div class="container">
                    <span class="text-muted">Coordinates: </span>
                    <span id="lat"></span>
                    <span id="lon"></span>
                </div>
                </footer>

                {% block script %}
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous">
                </script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"
                integrity="sha512-qTXRIMyZIFb8iQcfjXWCO8+M5Tbc38Qi5WzdPOYZHIlZpzBHG3L3by84BBBOiRGiEb7KKtAOAs5qYdUiZiQNNQ=="
                crossorigin="anonymous" referrerpolicy="no-referrer"></script>
                <script src="{% static 'weather/js/momenttimezonewithdata.js' %}"></script>
                <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
                <script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>
                <script src="{% static 'weather/js/index.js' %}"></script>
                {% endblock %}
            </div>
        </body>
    </html>


## Index.html

    {% extends "weather/layout.html" %}
    {% load static %}
    {% block body %}
    <div class="position-relative mb-5 d-flex flex-lg-row flex-column justify-content-between" id="body-container">

    <div class="d-flex flex-column mt-5">
        <div class="d-flex justify-content-center">
        <div class="card bg-transparent text-dark text-center border-0">
            <div class="card-body">
            <h1 class="card-title" id="time"></h1>
            <h5 class="card-text" id="date"></h5>
            </div>
        </div>
        </div>

        <div class="current-forecast" style="display: none;">
        <div class="card">
            <img class="card-img-top" id="weather_img" alt="..." style="width: 25%;">
            <div class="card-body pt-0">
            <h5 class="card-title" id="temp"></h5>
            <p class="card-text" id="weather-resume"></p>
            <div class="row">
                <div class="col" id="wind-speed"></div>
                <div class="col" id="pressure"></div>
            </div>
            <div class="row">
                <div class="col" id="uv"></div>
                <div class="col" id="dew_point"></div>
            </div>
            <div class="row">
                <div class="col" id="humidity"></div>
                <div class="col" id="visibility"></div>
            </div>
            <div class="row">
                <div class="col" id="sunrise"></div>
                <div class="col" id="sunset"></div>
            </div>
            </div>
        </div>
        </div>
    </div>

        <div class="d-flex flex-column mt-5">
        <div class="d-flex justify-content-center">
            <div class="card bg-transparent text-dark border-0">
            <div class="card-body">
                <h3 class="card-title" id="timezone"></h3>
                <h5 class="card-text" id="country"></h5>
            </div>
            </div>
        </div>

        <div class="future-forecast mt-2">
            <div class="accordion" id="accordionExample"></div>
        </div>
        </div>

    </div>
    {% endblock %}


## Index.js

    const API_KEY = '48880413066e1675a42b475c276ef24b';
    const weather_img = document.querySelector('#weather_img');
    const time = document.querySelector('#time');
    const date = document.querySelector('#date');
    const time_zone = document.querySelector('#timezone');
    const country = document.querySelector('#country');
    const temp = document.querySelector('#temp');
    const weather_resume = document.querySelector('#weather-resume');
    const wind_speed = document.querySelector('#wind-speed');
    const uv = document.querySelector('#uv');
    const dew_point = document.querySelector('#dew_point');
    const pressure = document.querySelector('#pressure');
    const humidity = document.querySelector('#humidity');
    const visibility = document.querySelector('#visibility');
    const sunrise = document.querySelector('#sunrise');
    const sunset = document.querySelector('#sunset');
    const accordion = document.querySelector('#accordionExample');
    const metric = document.querySelector('#btnradio1');
    const imperial = document.querySelector('#btnradio2');
    const button_cities = document.querySelector('#div_button_cities');
    const latitude = document.querySelector('#lat');
    const longitude = document.querySelector('#lon');
    const current_forecast_view = document.querySelector('.current-forecast');

    document.addEventListener('DOMContentLoaded', function() {
        document.querySelector('#search').addEventListener('click', () => get_current_weather_data());
        document.querySelector('#input-search').addEventListener('input', () => get_all_current_weather_data());
        document.querySelector('#location-logo').addEventListener('click', () => get_coords_weather_data());
        document.querySelector('#add_city').addEventListener('click', () => add_tracking_cities(country.innerHTML, latitude.innerHTML, longitude.innerHTML));
        get_coords_weather_data();
        get_tracking_cities();
    })

    function notification(message) {
        const toast_container = document.createElement('div');
        toast_container.className = 'toast-container position-absolute p-3 top-0 start-50 translate-middle-x';
        toast_container.id = 'toastPlacement';
        document.querySelector('#body-container').append(toast_container);
            
        const div_toast = document.createElement('div');
        div_toast.className = 'toast text-white bg-primary align-items-center';
        div_toast.id = 'toastLiveExample';
        div_toast.setAttribute('role', 'alert');
        div_toast.setAttribute('aria-live', 'assertive');
        div_toast.setAttribute('aria-atomic', true);
        div_toast.dataset.bsAnimation = true;
        toast_container.append(div_toast);       

        const flex_div = document.createElement('div');
        flex_div.className = 'd-flex';
        div_toast.append(flex_div);

        const body_div = document.createElement('div');
        body_div.className = 'toast-body';
        body_div.innerText = message;
        flex_div.append(body_div);

        const button_close = document.createElement('button');
        button_close.className = 'btn-close btn-close-white me-2 m-auto';
        button_close.dataset.bsDismiss = 'toast';
        flex_div.append(button_close);

        var myToastEl = document.getElementById('toastLiveExample');
        var myToast = bootstrap.Toast.getOrCreateInstance(myToastEl);

        myToast.show();

        myToastEl.addEventListener('hidden.bs.toast', function () {
            document.querySelector('#toastPlacement').remove();
        })
    }

    function get_coords_weather_data() {
        const units = metric.checked? metric.value : imperial.value;
        navigator.geolocation.getCurrentPosition((sucess) => {
            let {latitude, longitude} = sucess.coords;

            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&units=${units}&appid=${API_KEY}`)
            .then(res => res.json())
            .then(res => {
                view_weather_data(res, units);
                get_coords_name_location(res.lat, res.lon);
            })
        })
    }

    function get_coords_name_location(lat, lon) {
        
        fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
        .then(res => res.json())
        .then(res => {
            country.innerHTML = `${res[0].name}${res[0].state? ', ' + res[0].state + ', ' : ', '}${res[0].country}`
        })
    }

    function get_all_current_weather_data() {
        const input_search = document.querySelector('#input-search').value;
        const datalist_cities = document.querySelector('#search-cities');

        if (input_search != '' && input_search.length >= 2) {
            document.querySelector('#search').removeAttribute('disabled');
            fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${input_search}&appid=${API_KEY}`)
            .then(res => res.json())
            .then(res => {
                if (res.cod != 404 && res != []) {
                    datalist_cities.innerHTML = '';
                    res.forEach(element => {
                        const datalist_option = document.createElement('option');
                        datalist_option.value = `${element.name}${element.state? ', ' + element.state + ', ' : ', '}${element.country}`;
                        datalist_cities.appendChild(datalist_option);
                    })
                }
            })
        } else {
            document.querySelector('#search').setAttribute('disabled', true);
        }
    }

    function get_current_weather_data(name) {
        const units = metric.checked? metric.value : imperial.value;
        const input = document.querySelector('#input-search').value;
        const search = name? name : input;
        
        fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${search}&appid=${API_KEY}`)
        .then(res => res.json())
        .then(res => {
            if (res.length != 0) {
                fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${res[0].lat}&lon=${res[0].lon}&exclude=minutely,hourly&units=${units}&appid=${API_KEY}`)
                .then(res => res.json())
                .then(res => {
                    view_weather_data(res, units);
                    get_coords_name_location(res.lat, res.lon);
                })
            } else {
                notification("Not found!");
            }
        })
    }

    function wind_direction(direction) {

        let cardinal_direction;
        if (direction >= 348.75 && direction <= 360 || direction >= 0 && direction < 11.25) {
            cardinal_direction = "N";
        }else if (direction >= 11.25 && direction < 33.75) {
            cardinal_direction = "NNE"
        }else if (direction >= 33.75 && direction < 56.25) {
            cardinal_direction = "NE";
        }else if (direction >= 56.25 && direction < 78.75) {
            cardinal_direction = "ENE";
        }else if (direction >= 78.75 && direction < 101.25) {
            cardinal_direction = "E";
        }else if (direction >= 101.25 && direction < 123.75) {
            cardinal_direction = "ESE";
        }else if (direction >= 123.75 && direction < 146.25) {
            cardinal_direction = "SE";
        }else if (direction >= 146.25 && direction < 168.75) {
            cardinal_direction = "SSE";
        }else if (direction >= 168.75 && direction < 191.25) {
            cardinal_direction = "S";
        }else if (direction >= 191.25 && direction < 213.75) {
            cardinal_direction = "SSW";
        }else if (direction >= 213.75 && direction < 236.25) {
            cardinal_direction = "SW";
        }else if (direction >= 236.25 && direction < 258.75) {
            cardinal_direction = "WSW";
        }else if (direction >= 258.75 && direction < 281.25) {
            cardinal_direction = "W";
        }else if (direction >= 281.25 && direction < 303.75) {
            cardinal_direction = "WNW";
        }else if (direction >= 303.75 && direction < 326.25) {
            cardinal_direction = "NW";
        }else if (direction >= 326.25 && direction < 348.75) {
            cardinal_direction = "NNW";
        }
        return cardinal_direction;
    }

    function toTimeZone(time, zone) {
        var format = 'YYYY/MM/DD HH:mm:ss ZZ';
        var new_time = new Date(time * 1000);
        return moment(new_time, format).tz(zone);
    }

    function add_tracking_cities(name, lat, lon) {
        const user_id = localStorage.getItem("id")? localStorage.getItem("id") : Math.floor(Math.random() * 1000);

        fetch('http://localhost:8000/cities', {
            method: 'POST',
            body: JSON.stringify({
                name: name,
                lat: lat,
                lon: lon,
                user: user_id
            })
        })
        .then(res => res.json())
        .then(res => {
            if (res.success) {
                localStorage.setItem("id", user_id);
                get_tracking_cities();
            }else if (res.error) {          
                notification(res.error);
            }
        })
    }

    function get_tracking_cities() {
        const user_id = localStorage.getItem("id");
        if (user_id != '' && user_id != undefined) {
            fetch(`http://localhost:8000/cities/${user_id}`)
            .then(res => res.json())
            .then(res => {
                button_cities.innerHTML = '';
                if (!res.error) {
                    res.forEach(function (element, index, array) {
                        const button_city = document.createElement('button');
                        button_city.className = 'btn btn-outline-primary btn-sm';
                        button_city.id = `button-city-${index}`;
                        button_city.innerHTML = `${element.name} <span class='badge bg-light text-dark' id='close_city_${index}'><ion-icon name="close"></ion-icon></span>`;
                        button_cities.append(button_city);

                        document.querySelector(`#button-city-${index}`).addEventListener('click', () => get_current_weather_data(array[index].name));
                        document.querySelector(`#close_city_${index}`).addEventListener('click', () => del_tracking_cities(array[index].name));
                    })
                }
            })
        }
    }

    function del_tracking_cities(city) {
        const user_id = localStorage.getItem("id");
        fetch(`http://localhost:8000/cities/${user_id}/${city}/del`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(res => {
            get_tracking_cities();
        })
    }

    function view_weather_data(data, unit) {

        current_forecast_view.style.display = 'block';
        time.innerHTML = toTimeZone(data.current.dt, data.timezone).format('h:mm A');
        date.innerHTML = toTimeZone(data.current.dt, data.timezone).format('ddd, MMM DD');
        const grad = unit=='metric'? '°C' : '°F';
        const vel = unit=='metric'? 'm/s' : 'mph';
        weather_img.src = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`;
        time_zone.innerHTML = data.timezone;
        temp.innerHTML = `${Math.round(data.current.temp)} ${grad}`;
        weather_resume.innerHTML = `Feels like: ${Math.round(data.current.feels_like)} ${grad} ${data.current.weather[0].main}, ${data.current.weather[0].description}`;
        wind_speed.innerHTML = `<img src="https://img.icons8.com/small/16/000000/wind.png"/>${data.current.wind_speed}${vel} ${wind_direction(data.current.wind_deg)}`;
        pressure.innerHTML = `<img src="https://img.icons8.com/small/16/000000/barometer-gauge.png"/>${data.current.pressure} hPa`;
        dew_point.innerHTML = `Dew point: ${Math.round(data.current.dew_point)}${grad}`;
        uv.innerHTML = `UV: ${Math.round(data.current.uvi)}`;
        humidity.innerHTML = `Humidity: ${data.current.humidity} %`;
        visibility.innerHTML = `Visibility: ${data.current.visibility / 1000} km`;
        sunrise.innerHTML = `<img src="https://img.icons8.com/small/16/000000/sunrise.png"/>${toTimeZone(data.current.sunrise, data.timezone).format('h:mm a')}`;
        sunset.innerHTML = `<img src="https://img.icons8.com/small/16/000000/sunset.png"/>${toTimeZone(data.current.sunset, data.timezone).format('h:mm a')}`;
        latitude.innerHTML = data.lat;
        longitude.innerHTML = data.lon;
        accordion.innerHTML = '';
        
        data.daily.forEach( function(element, index) {
            const accordion_item = document.createElement('div');
            accordion_item.className = 'accordion-item';
            accordion.append(accordion_item);

            const accordion_header = document.createElement('h2');
            accordion_header.className = 'accordion-header';
            accordion_header.id = `item-element-${index}`;
            accordion_item.append(accordion_header);

            const accordion_button = document.createElement('button');
            accordion_button.className = 'accordion-button collapsed';
            accordion_button.id = `item-element-${index}`;
            accordion_button.innerHTML = `<div class='d-flex flex-row justify-content-between align-items-center'>
            <div>${moment(element.dt * 1000).format('ddd, MMM DD')}</div><div class='flex-shrink-0'><img src='http://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png' style='width: 50%;'></div>
            <div>${Math.round(element.temp.max)}/${Math.round(element.temp.min)} ${grad}</div><div class='ms-2'>${element.weather[0].description}</div></div>`;
            accordion_header.append(accordion_button);
                
            const div_body = document.createElement('div');
            div_body.id = `item-element-${index}`;
            div_body.className = 'accordion-collapse collapse';
            accordion_item.append(div_body);

            const accordion_body = document.createElement('div');
            accordion_body.className = 'accordion-body';
            accordion_body.innerHTML = `<div class='d-flex flex-row justify-content-between align-items-center'><div class='flex-shrink-0'><img src='http://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png' style='width: 75%;'></div>
            <div class=''>${element.weather[0].description}. The high will be ${Math.round(element.temp.max)}${grad} and <br> low will be ${Math.round(element.temp.min)}${grad}.</div></div>
            <div class='d-flex flex-row justify-content-between align-items-center'><div class='d-flex flex-column'><div class=''><img src="https://img.icons8.com/small/16/000000/rain.png"/>${element.pop}% ${element.rain? element.rain : 0}mm</div>
            <div class=''><img src="https://img.icons8.com/small/16/000000/wind.png"/>${element.wind_speed}${vel} ${wind_direction(element.wind_deg)}</div>
            <div class=''><img src="https://img.icons8.com/small/16/000000/barometer-gauge.png"/>${element.pressure}hPa</div></div>
            <div class='d-flex flex-column'><div class=''>Humidity: ${element.humidity}%</div><div class=''>UV: ${Math.round(element.uvi)}</div><div class=''>Dew point: ${Math.round(element.dew_point)}${grad}</div></div></div>`;
            div_body.append(accordion_body);

            accordion_button.addEventListener('click', () => {
                if (accordion_button.classList == 'accordion-button' && div_body.classList == 'accordion-collapse collapse show') {
                    accordion_button.classList.add('collapsed');
                    div_body.classList.remove('show');
                }else {
                    accordion_button.classList.remove('collapsed');
                    div_body.classList.add('show');
                }
            })
        });
    }


## Styles.css

    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300&display=swap');

    body {
        font-family: 'Space Grotesk', sans-serif;
    }

    .b-example-divider {
        height: 3rem;
        background-color: rgba(0, 0, 0, .1);
        border: solid rgba(0, 0, 0, .15);
        border-width: 1px 0;
        box-shadow: inset 0 .5em 1.5em rgba(0, 0, 0, .1), inset 0 .125em .5em rgba(0, 0, 0, .15);
    }
    
    .form-control-dark {
        color: #fff;
        background-color: var(--bs-dark);
        border-color: var(--bs-gray);
    }
    .form-control-dark:focus {
        color: #fff;
        background-color: var(--bs-dark);
        border-color: #fff;
        box-shadow: 0 0 0 .25rem rgba(255, 255, 255, .25);
    }
    
    .bi {
        vertical-align: -.125em;
        fill: currentColor;
    }
    
    .text-small {
        font-size: 85%;
    }
