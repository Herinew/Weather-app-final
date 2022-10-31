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