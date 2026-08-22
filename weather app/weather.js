const API_KEY = "53e9d96fb8c2979a4dfff260751f7e06";

let currentCity = "";

const input = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const loader = document.getElementById("loader");
const weatherCard = document.getElementById("weatherCard");
const errorMsg = document.getElementById("errorMsg");
const favoritesList = document.getElementById("favoritesList");
const forecastDiv = document.getElementById("forecast");

async function getWeather(city) {

    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
        throw new Error("City not found");
    }

    return await response.json();
}

async function getForecast(city) {

    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
        throw new Error("Forecast not available");
    }

    return await response.json();
}

async function searchWeather(city) {

    loader.style.display = "block";
    weatherCard.style.display = "none";
    errorMsg.style.display = "none";
    forecastDiv.innerHTML = "";

    try {

        const data = await getWeather(city);

        currentCity = data.name;

        document.getElementById("cityName").innerText = data.name;
        document.getElementById("temperature").innerText = Math.round(data.main.temp) + "°C";
        document.getElementById("description").innerText = data.weather[0].description.toUpperCase();
        document.getElementById("feels").innerText = "Feels Like : " + Math.round(data.main.feels_like) + "°C";
        document.getElementById("humidity").innerText = "Humidity : " + data.main.humidity + "%";
        document.getElementById("wind").innerText = "Wind Speed : " + data.wind.speed + " m/s";

        weatherCard.style.display = "block";

        loadForecast(city);

    } catch (err) {

        errorMsg.style.display = "block";
        errorMsg.innerText = err.message;

    } finally {

        loader.style.display = "none";

    }
}

async function loadForecast(city) {

    try {

        const data = await getForecast(city);

        forecastDiv.innerHTML = "";

        const forecast = data.list.filter(item =>
            item.dt_txt.includes("12:00:00")
        );

        forecast.forEach(day => {

            forecastDiv.innerHTML += `
                <div class="forecast-card">
                    <h3>${day.dt_txt.split(" ")[0]}</h3>
                    <p>${Math.round(day.main.temp)}°C</p>
                    <p>${day.weather[0].main}</p>
                </div>
            `;

        });

    } catch (err) {

        console.log(err);

    }

}

function addFavorite(city) {

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (!favorites.includes(city)) {

        favorites.push(city);

        localStorage.setItem("favorites", JSON.stringify(favorites));

        loadFavorites();

    } else {

        alert("City already added!");

    }

}

function removeFavorite(city) {

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    favorites = favorites.filter(c => c !== city);

    localStorage.setItem("favorites", JSON.stringify(favorites));

    loadFavorites();

}

function loadFavorites() {

    favoritesList.innerHTML = "";

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    favorites.forEach(city => {

        const div = document.createElement("div");

        div.className = "favorite-item";

        div.innerHTML = `
            <span>${city}</span>
            <button class="removeBtn">Remove</button>
        `;

        div.querySelector("span").addEventListener("click", () => {
            searchWeather(city);
        });

        div.querySelector("button").addEventListener("click", () => {
            removeFavorite(city);
        });

        favoritesList.appendChild(div);

    });

}

document.getElementById("favoriteBtn").addEventListener("click", () => {

    if (currentCity) {

        addFavorite(currentCity);

    }

});

searchBtn.addEventListener("click", () => {

    const city = input.value.trim();

    if (city === "") {

        alert("Please enter a city name.");

        return;

    }

    searchWeather(city);

});

input.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {

        searchBtn.click();

    }

});

document.getElementById("themeBtn").addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        document.getElementById("themeBtn").innerText = "☀ Light";

    } else {

        document.getElementById("themeBtn").innerText = "🌙 Dark";

    }

});

loadFavorites();