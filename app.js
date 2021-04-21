const UNSPLASHKEY = "DkVRmsRH9Ekfw0PwmprKEeXmc7e47xVrw4PkF6efTnE";
const OPENWEATHERKEY = "af09487e0155065ded4c91f22bbad931";


//Select all needed elements on page
const background = document.querySelector("#background");
const zipcode = document.querySelector("#zipcode");
const submit = document.querySelector("#submit");
const refresh = document.querySelector("#refresh");
const time = document.querySelector("#time");
const temperature = document.querySelector("#temperature");
const weather = document.querySelector("#weather");
const place = document.querySelector("#place");
const sunrise = document.querySelector("#sunrise");
const sunset = document.querySelector("#sunset");
const map = document.querySelector("#map");

//Define variables 
let zipCode = "45242";
let isFarienheit = true;
let weatherData = {};

//call weather API on page load
fetchWeather();

//Define what happens when submit button is clicked
submit.onclick = function () {
	//An regex check to see if user's zipcode is valid 
	if (/^(\d{5}(?:\-\d{4})?)$/g.test(zipcode.value)) {
		//set zipCode to user enterd zipcode
		zipCode = zipcode.value;
		//clear inputfield afterwards
		zipcode.value = "";
		//call weather API
		fetchWeather();
	}
};

//Define what happens when refresh button is clicked
refresh.onclick = function () {
	//weather API is called
	fetchWeather();
};

//Define what happens when the temperature is clicked
temperature.onclick = function () {
	//change isFarienheit to opposite it self
	isFarienheit = !isFarienheit;
	//call displayWeather to update screen
	displayWeather();
};

//function to convert farienheit to celsius and return it
function FtoC(farienheit) {
	return (farienheit - 32) * (5 / 9);
}

//formats time given to hour:min AM/PM and return it
function getFormatedTime(date) {
	let h = date.getHours();
	let m = date.getMinutes();
	let x = h >= 12 ? "PM" : "AM";
	h = h % 12;
	h = h ? h : 12;
	m = m < 10 ? `0${m}` : m;
	return `${h}:${m}${x}`;
}

//formats time to day hour:min AM/PM and return it
function getFormatedDayTime(date) {
	let days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];
	return `${days[date.getDay()]} ${getFormatedTime(date)}`;
}

//function to fetch Image from name of location returned from the Weather API
function fetchWeather() {
	//disable buttons so server won't be called multiple times 
	submit.disabled = true;
	refresh.disabled = true;

	//make a call to weather api using fetch method with zipcode and weather API key
	fetch(
		`https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&units=imperial&appid=${OPENWEATHERKEY}`
	).then(async (response) => {
		//check if api responed correctly or return
		if (!response.ok) {
			//renable buttons so server won't be called multiple times 
			submit.disabled = false;
			refresh.disabled = false;
			return;
		}
		//set weatherData to server response in JSON object format
		weatherData = await response.json();
		//call fetchUnsplash to update background image
		fetchUnsplash();
		//call displayWeather to show new weather
		displayWeather();
		
		//renable buttons so server won't be called multiple times 
		submit.disabled = false;
		refresh.disabled = false;
	});
}

//function to show the weather on the screen
function displayWeather() {
	time.innerText = getFormatedDayTime(new Date(weatherData.dt * 1000));
	temperature.innerHTML = `${Math.round(
		isFarienheit ? weatherData.main.temp : FtoC(weatherData.main.temp)
	)}°<span>${isFarienheit ? "F" : "C"}</span>`;
	weather.innerText = weatherData.weather[0].description;
	place.innerText = weatherData.name;
	sunrise.innerText = `🌅${getFormatedTime(
		new Date(weatherData.sys.sunrise * 1000)
	)}`;
	sunset.innerText = `🌇${getFormatedTime(
		new Date(weatherData.sys.sunset * 1000)
	)}`;
	map.innerText = `🗺️${zipCode}`;
	map.href = `https://www.google.com/maps/place/${zipCode}`;
}

//function to fetch Image from name of location returned from the Weather API
function fetchUnsplash() {
	//check if weather is defined or return
	if (!weatherData) return;
	//make a call to image api using fetch method with location name and Photo API key
	fetch(
		`https://api.unsplash.com/search/photos?client_id=${UNSPLASHKEY}&query=${weatherData.name}&per_page=10`
	).then(async (response) => {
		//check if api responed correctly or return
		if (!response.ok) {
			return;
		}
		//change response into JSON object
		let data = await response.json();
		//choose random photo from the returned array of photos
		let random = Math.floor(Math.random() * data.results.length);
		//set background as random photo
		background.style.background = `url("${data.results[random].urls.full}")`;
		background.style.backgroundSize = "cover";
		background.style.repeat = "no-repeat";
	});
}
