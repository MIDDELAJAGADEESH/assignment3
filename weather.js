//storing urls to fetch data
const mykey = "398462dd2d7e673d6b99577f26a8cbaa";
const myurl = "https://api.openweathermap.org/data/2.5/weather?q=";
const forecasturl = "https://api.openweathermap.org/data/2.5/forecast?q=";
const geourl = "https://api.openweathermap.org/data/2.5/weather?lat=";
const geoforecasturl = "https://api.openweathermap.org/data/2.5/forecast?lat=";
const cdate = new Date();
const currentdate = cdate.toISOString().split('T')[0];

//this async function take user enterd location and give out put
async function weatherdata(location) {
    try {
        const response = await fetch(myurl + location + `&appid=${mykey}&units=metric`);
        const result = await response.json();
        console.log(result);
        if (!response.ok) {
            throw new Error(result.message);
        }
        return result;
    }
    catch (error) {
        alert(error.message);
    }
}

// this for forecast the user location data
async function forecast(forecastlocation) {
    try {
        const res = await fetch(`${forecasturl}${forecastlocation}&appid=${mykey}&units=metric`);
        const resresult = await res.json();
        console.log(resresult);
        if (!res.ok) {
            throw new Error(resresult.message);
        }
        return resresult;
    }
    catch (error) {
    
        alert(error.message);
    }

}
// this take the location of user by latitude and longitude
async function usergeo(lat, lon) {
    try {
        const georesponse = await fetch(geourl + `${lat}&lon=${lon}` + `&appid=${mykey}&units=metric`);
        const georesult = await georesponse.json();
        if (!georesponse.ok) {
            throw new Error(georesult);
        }
        return georesult;
    }
    catch (error) {
        alert("error" + error.message);

    }
}
// this forecast the user current location data with latitude and longitude
async function usergeoforecast(lat, lon) {
    try {
        const geoforecastres = await fetch(geoforecasturl + `${lat}&lon=${lon}&appid=${mykey}&units=metric`);
        const geoforecastresult = await geoforecastres.json();
        console.log(geoforecastresult);
        if (!geoforecastres.ok) {
            throw new Error(geoforecastresult);
        }
        
        return geoforecastresult;
    }
    catch (error) {
        alert("error" + error.message);
    }

}

let search = document.querySelector(".search");
let userlocation = document.querySelector(".userlocation");
let input = document.querySelector("input")
//adding event listener to search button
search.addEventListener('click', async function () {
    let data = input.value.trim();
    if (!data) {
        alert("City name cannot be empty. Please enter a city name");
        return;
    }


    const result = await weatherdata(data);

    const forecast1 = await forecast(data);
    weatherui(result);
    weatherforecastui(forecast1);
    // THIS is for searched city 

    let cityName = input.value.trim();
    if (cityName && !cityArray.includes(cityName)) {

        cityArray.push(cityName);

        localStorage.setItem('recentCities', cityArray.join(','));

        addCityToDropdown(cityName);
    }


});
//adding event listner for location to fetch user latitude and longitude
userlocation.addEventListener('click', function () {
    navigator.geolocation.getCurrentPosition(async function (position) {
        const lon = position.coords.longitude;
        const lat = position.coords.latitude;
        const geore = await usergeo(lat, lon);
        const geoforecast = await usergeoforecast(lat, lon);
        weatherui(geore);
        weatherforecastui(geoforecast);

    })
});

//this taking the result object as a  arugumnet
function weatherui(result) {
    document.querySelector(".icon").style.background = `url(https://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png)`;
    document.querySelector(".weatherdis").innerHTML = result.weather[0].description;
    document.querySelector(".block1").classList.remove('hidden')
    document.querySelector(".location").innerHTML = result.name;
    document.querySelector(".date").innerHTML = "Date: " + currentdate;
    document.querySelector(".temp").innerHTML = result.main.temp + ` °C`;
    document.querySelector(".wind").innerHTML = result.wind.speed + ` km/h`;
    document.querySelector(".humidity").innerHTML = result.main.humidity + `%`;
}

function weatherforecastui(forecastresult) {
    const dailyre = forecastresult.list.filter(data => data.dt_txt.includes('12:00:00')).slice(0, 6);
    const forecastContainer = document.querySelector(".forecastcard");
    forecastContainer.innerHTML = '';
    //this is for every day data it will creat a forecastui card
    for (let i = 0; i < 5; i++) {
        forecastContainer.innerHTML += `
            <div class="shadow-all-sides w-max box-border m-3 p-2 relative text-lg font-semibold h-max">
                <div class="flex items-center justify-center flex-col m-2 h-28 w-28">
                    <span class="foreweatherdis w-max relative font-serif p-2 m-2 left-2"></span>
                    <div class="foreicon h-24 w-24 bg-no-repeat m-1 bg-cover bg-center"></div>
                    <span class="date w-max relative font-serif"></span>
                </div>
                <div class="forecast">
                    <div>Date: <span class="foredate"></span></div>
                    <div>Location: <span class="forelocation"></span></div>
                    <div>Temperature: <span class="foretemp"></span></div>
                    <div>Wind: <span class="forewind"></span></div>
                    <div>Humidity: <span class="forehumidity"></span></div>
                </div>
            </div>
        `;
    }
    //for every data we get we are inserting into forecatui
    dailyre.forEach((dailyres, index) => {
        const forecastCard = forecastContainer.children[index];
        document.querySelector(".forecast").classList.remove('hidden')
        forecastCard.querySelector('.foreweatherdis').textContent = dailyres.weather[0].description;
        forecastCard.querySelector('.foreicon').style.backgroundImage = `url(https://openweathermap.org/img/wn/${dailyres.weather[0].icon}@2x.png)`;
        forecastCard.querySelector('.date').textContent = dailyres.dt_txt.split(' ')[0];
        forecastCard.querySelector('.foredate').textContent = dailyres.dt_txt.split(' ')[0];
        forecastCard.querySelector('.forelocation').textContent = forecastresult.city.name;
        forecastCard.querySelector('.foretemp').textContent = `${dailyres.main.temp} °C`;
        forecastCard.querySelector('.forewind').textContent = `${dailyres.wind.speed} km/h`;
        forecastCard.querySelector('.forehumidity').textContent = `${dailyres.main.humidity}%`;
    });
}

// this is for drop down for user searched locations
let cityDropdown = document.querySelector('.city-dropdown');


let recentlySearchedCities = localStorage.getItem('recentCities') || '';
//this is if else for check stored city else intialize new array
let cityArray = recentlySearchedCities ? recentlySearchedCities.split(',') : [];


cityArray.forEach(city => {
    addCityToDropdown(city);
});

// event listner if change it will triger and give weather info for user
cityDropdown.addEventListener('change', async function () {


    let data = cityDropdown.value;
    const result = await weatherdata(data);

    const forecast1 = await forecast(data);
    weatherui(result);
    weatherforecastui(forecast1);



});

// this is taking city as a input and append it into html
function addCityToDropdown(city) {
    let option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    cityDropdown.appendChild(option);
}
