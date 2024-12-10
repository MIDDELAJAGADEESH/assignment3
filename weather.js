const mykey="398462dd2d7e673d6b99577f26a8cbaa";
const myurl="https://api.openweathermap.org/data/2.5/weather?q=";
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
let search=document.querySelector(".search");
let userlocation=document.querySelector(".userlocation");
let input=document.querySelector("input")
search.addEventListener('click',async function(){
    let data=input.value;
    const result =await weatherdata(data);
    weatherui(result);

});
userlocation.addEventListener('click',function(){
    navigator.geolocation.getCurrentPosition(async function(coords){
        const long=coords.lon;
        const lati=coords.lat;
        const result=await weatherdata(long+lati);
        weatherui(result);
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

