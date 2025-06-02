const tempField = document.querySelector(".temp");
const locationField = document.querySelector(".loc_time p");
const datentimeField = document.querySelector(".loc_time span");
const weatherField = document.querySelector(".weather p");
const searchField = document.querySelector(".search");
const formField = document.querySelector("form");
const cityImage = document.getElementById("city-image");
const detectLocationBtn = document.getElementById("detect-location");
const toggleBtn = document.getElementById("toggle-theme");
const dateTimeDiv = document.getElementById("current-datetime");

let target = "Lucknow";

// Fetch weather data
const fetchResults = async (targetLocation) => {
    const url = `https://api.weatherapi.com/v1/current.json?key=8799107a874443c78bb70234250902&q=${targetLocation}&aqi=no`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log(data);

        const loc = data.location.name;
        const time = data.location.localtime;
        const temp = data.current.temp_c;
        const weathercondition = data.current.condition.text;
        const iconUrl = data.current.condition.icon;

        updateData(temp, loc, time, weathercondition, iconUrl);
        fetchCityImage(loc);
        fetchForecast(loc); // Add this line

    } catch (error) {
        alert("Could not fetch data. Please enter another location.");
        console.error("Fetch error:", error);
    }
};
const forecastContainer = document.querySelector(".forecast-container");

const fetchForecast = async (targetLocation) => {
    const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=8799107a874443c78bb70234250902&q=${targetLocation}&days=6&aqi=no&alerts=no`;


    try {
        const res = await fetch(forecastUrl);
        const data = await res.json();

        updateForecastCards(data.forecast.forecastday);
    } catch (error) {
        console.error("Forecast fetch error:", error);
        alert("Could not fetch forecast data.");
    }
};

function updateForecastCards(forecastArray) {
    forecastContainer.innerHTML = "";

    forecastArray.slice(1).forEach(day => { // skip today
        const date = new Date(day.date);
        const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
        const icon = day.day.condition.icon;
        const avgTemp = Math.round(day.day.avgtemp_c);

        const card = document.createElement("div");
        card.className = "forecast-card";
        card.innerHTML = `
            <p>${weekday}</p>
            <img src="https:${icon}" alt="Weather icon">
            <p>${avgTemp}°C</p>
        `;
        forecastContainer.appendChild(card);
    });
}


// Update UI with fetched data
function updateData(temp, loc, time, weathercondition, iconUrl) {
    console.log(`Returned data: ${loc}, ${time}, ${temp}°C, ${weathercondition}`);

    document.getElementById("temp-value").innerText = temp;
    locationField.innerText = loc;
    datentimeField.innerText = time;
    weatherField.innerText = weathercondition;

    const iconImg = document.getElementById("weather-icon");
    iconImg.src = "https:" + iconUrl;
    iconImg.alt = weathercondition;
}

// Search handler
function searchForLoc(e) {
    e.preventDefault();

    target = searchField.value;
    fetchResults(target);

    document.querySelector(".container").classList.add("glow");
    setTimeout(() => {
        document.querySelector(".container").classList.remove("glow");
    }, 2000);
}

// Detect current location using browser
detectLocationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});

function successCallback(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const latLongQuery = `${latitude},${longitude}`;
    fetchResults(latLongQuery);
}

function errorCallback(error) {
    alert("Unable to retrieve your location. Please allow location access.");
    console.error("Geolocation error:", error);
}

// Fetch city image from Unsplash
function fetchCityImage(cityName) {
    const accessKey = "9A8smepHj6e2QHXqIaw7wIYnWGiie7ehAVuD0Zgy13s";
    const url = `https://api.unsplash.com/search/photos?query=${cityName}&client_id=${accessKey}&orientation=landscape`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            if (data.results.length > 0) {
                const imageUrl = data.results[0].urls.regular;
                cityImage.src = imageUrl;
                cityImage.alt = `Image of ${cityName}`;
            } else {
                cityImage.src = "";
                cityImage.alt = "No image found";
            }
        })
        .catch((error) => {
            console.error("Error fetching city image:", error);
        });
}

function updateCityImage(city) {
    const img = document.getElementById("city-image");
    img.src = `https://source.unsplash.com/300x300/?${encodeURIComponent(city)}`;
}


// Toggle dark/light mode
toggleBtn.textContent = document.body.classList.contains('dark-mode') ? 'Switch Mode ☀️' : 'Switch Mode 🌙';

toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    toggleBtn.textContent = document.body.classList.contains('dark-mode') ? 'Switch Mode ☀️' : 'Switch Mode 🌙';
});

// Show current local datetime (updated every minute)
function updateDateTime() {
    const now = new Date();
    dateTimeDiv.textContent = now.toLocaleString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
setInterval(updateDateTime, 60000);
updateDateTime();

// Initial fetch and event binding
formField.addEventListener('submit', searchForLoc);
fetchResults(target);
