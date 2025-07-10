const apiKey = '73f3ad1bcec4488f41fe7d6d31e24a8e'; 
function getFormattedDate(dt) {
  const date = new Date(dt * 1000);
  const options = { weekday: 'short', day: '2-digit', month: 'short' };
  return date.toLocaleDateString('en-US', options);
}

async function getWeather() {
  const city = document.getElementById('cityInput').value;
  if (!city) return alert("Enter a city name");

  try {
    const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
    const weatherData = await weatherRes.json();

    document.getElementById('location').innerText = `${weatherData.name}`;
    document.getElementById('date').innerText = getFormattedDate(weatherData.dt);
    document.getElementById('temp').innerText = `${Math.round(weatherData.main.temp)}°C`;
    document.getElementById('description').innerText = weatherData.weather[0].main;
    document.getElementById('humidity').innerText = `${weatherData.main.humidity}%`;
    document.getElementById('wind').innerText = `${weatherData.wind.speed} m/s`;
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;

    // Get 3-day forecast
    const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
    const forecastData = await forecastRes.json();

    const forecastEl = document.getElementById('forecast');
    forecastEl.innerHTML = "";

    const shownDays = new Set();
    for (let i = 0; i < forecastData.list.length; i++) {
      const item = forecastData.list[i];
      const date = new Date(item.dt * 1000).getDate();

      if (!shownDays.has(date) && shownDays.size < 3) {
        shownDays.add(date);
        forecastEl.innerHTML += `
          <div class="forecast-day">
            <p>${getFormattedDate(item.dt).replace(',', '')}</p>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" width="40" />
            <p>${Math.round(item.main.temp)}°C</p>
          </div>`;
      }
    }

  } catch (error) {
    alert("City not found or network error.");
  }
}
window.getWeather = getWeather;