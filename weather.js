const mykey="398462dd2d7e673d6b99577f26a8cbaa";
const myurl="https://api.openweathermap.org/data/2.5/weather?q=";
const forecasturl="https://api.openweathermap.org/data/2.5/forecast?q=";
const geourl = "https://api.openweathermap.org/data/2.5/weather?lat="; 
const geoforecasturl = "https://api.openweathermap.org/data/2.5/forecast?lat=";
const cdate=new Date();
const currentdate=cdate.toISOString().split('T')[0];

async function weatherdata(location) {
   try{
    const response =await fetch(myurl+location+`&appid=${mykey}&units=metric`);
    const result=await response.json();
    console.log(result);
    if(!response.ok){
        throw new Error();
    }
    return result;
   }
   catch(error){
    alert("invalid city name");
   }
}
async function forecast(forecastlocation){
    try{
        const res=await fetch(forecasturl+forecastlocation+`&appid=${mykey}&units=metric`);
        const resresult=await res.json();
        console.log(resresult);
        if(!res.ok){
            throw new Error();
        }
        return resresult;
    }
    catch(error){
        console.log("error");
    }
        
}

async function usergeo(lat,lon){
  try{
    const georesponse=await fetch(geourl+`${lat}&lon=${lon}`+`&appid=${mykey}&units=metric`);
    const georesult=await georesponse.json();
    console.log(georesult);
    return georesult;
  }
  catch(error){
    console.log("error");
    
  }
}

async function usergeoforecast(lat,lon){
    try{
        const geoforecastres=await fetch(geoforecasturl+`${lat}&lon=${lon}&appid=${mykey}&units=metric`);
    const geoforecastresult=await geoforecastres.json();
    console.log(geoforecastresult);
    if(!geoforecastres.ok){
        throw new Error();
    }
    }
    catch(error){
        console.log(error.message);
    }
    
}

let search=document.querySelector(".search");
let userlocation=document.querySelector(".userlocation");
let input=document.querySelector("input")
search.addEventListener('click',async function(){
    let data=input.value;
    const result =await weatherdata(data);
    forecast(data);
    weatherui(result);

});
userlocation.addEventListener('click',function(){
    navigator.geolocation.getCurrentPosition(async function(position){
        const lon=position.coords.longitude;
        const lat=position.coords.latitude;
        const geore=await usergeo(lat, lon);
        usergeoforecast(lat,lon);
        weatherui(geore);
    })
});

function weatherui(result){
    document.querySelector(".icon").style.background = `url(https://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png)`;
    document.querySelector(".weatherdis").innerHTML=result.weather[0].description;
    document.querySelector(".block1").classList.remove('hidden')
    document.querySelector(".location").innerHTML=result.name;
    document.querySelector(".date").innerHTML="Date: "+currentdate;
    document.querySelector(".temp").innerHTML=result.main.temp+` °C`;
    document.querySelector(".wind").innerHTML=result.wind.speed+` km/h`;
    document.querySelector(".humidity").innerHTML=result.main.humidity+`%`;
}

