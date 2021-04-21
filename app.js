let unsplashKey = "DkVRmsRH9Ekfw0PwmprKEeXmc7e47xVrw4PkF6efTnE";
let openweatherKey = "af09487e0155065ded4c91f22bbad931";

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

let zipCode = "45242";
let isFarienheit = true;
let weatherData = {};

submit.onclick = function () {
	if (/^(\d{5}(?:\-\d{4})?)$/g.test(zipcode.value)) {
		zipCode = zipcode.value;
		zipcode.value = "";
		fetchWeather();
	}
};

refresh.onclick = function () {
	fetchWeather();
};

temperature.onclick = function () {
	isFarienheit = !isFarienheit;
	displayWeather();
};

fetchWeather();

function fetchUnsplash() {
	if (!weather) return;
	fetch(
		`https://api.unsplash.com/search/photos?client_id=${unsplashKey}&query=${weather.name}&per_page=10`
	).then(async (response) => {
		if (!response.ok) {
			return;
		}
		let data = await response.json();
		let random = Math.floor(Math.random() * data.results.length);
		background.style.background = `url("${data.results[random].urls.full}")`;
		background.style.backgroundSize = "cover";
		background.style.repeat = "no-repeat";
	});
}

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

function fetchWeather() {
	submit.disabled = true;
	refresh.disabled = true;

	fetch(
		`https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&units=imperial&appid=${openweatherKey}`
	).then(async (response) => {
		if (!response.ok) {
			return;
		}
		weatherData = await response.json();
		fetchUnsplash();
		displayWeather();
	});
}

function FtoC(farienheit) {
	return (farienheit - 32) * (5 / 9);
}

function getFormatedTime(date) {
	let h = date.getHours();
	let m = date.getMinutes();
	let x = h >= 12 ? "PM" : "AM";
	h = h % 12;
	h = h ? h : 12;
	m = m < 10 ? `0${m}` : m;
	return `${h}:${m}${x}`;
}

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
