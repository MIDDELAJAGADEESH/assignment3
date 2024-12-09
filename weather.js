const mykey="398462dd2d7e673d6b99577f26a8cbaa";
const myurl="https://api.openweathermap.org/data/2.5/weather?q=";
async function weatherdata(location) {
   try{
    const response =await fetch(myurl+location+`&appid=${mykey}`);
    const data=await response.json();
    console.log(data);
    if(!response.ok){
        throw new Error();
    }
   }
   catch(error){
//    alert("invalid city name")
   }
}
weatherdata("india");

