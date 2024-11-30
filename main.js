let input = document.getElementById("search");
let searchBtn = document.getElementById("searchBtn");
let apiKey = '3e336855b7c50c1dbe06e6a6019613f7';
let mainSection = document.getElementById("main-section");
let notFound = document.getElementById("notFound");
let message = document.getElementById("message");
let countryTxt = document.querySelector(".country-txt");
let dateTxt = document.querySelector(".date-txt");
let cel = document.querySelector(".cel");
let wStatus = document.querySelector(".w-status");
let humValue = document.querySelector(".percentage");
let windSpeed = document.querySelector(".speed");
let weatherImg = document.querySelector(".weather-img");
let forecastItem = document.querySelector(".swiper-slide");

Mood = 'Main';

searchBtn.addEventListener('click', () => {
  if (input.value.trim() != '') {
    updateWeatherInfo(input.value);
    input.value = "";
    input.blur();
  }
});

input.addEventListener('keydown', (event => {
  if (event.key == 'Enter' && input.value.trim() != '') {
    updateWeatherInfo(input.value);
    input.value = "";
    input.blur();
  }
}));

input.addEventListener('click', function () {
  if (Mood === 'Main') {
    mainSection.style.display = 'none';
    notFound.style.display = 'none';
    message.style.display = 'flex';
    progrmMood = 'search';
  }
})

async function getFetchData(endpoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apiKey}&units=metric`; //specifies the type of data being requested from the API "weather".
  const response = await fetch(apiUrl);//Using await makes sure this conversion completes before moving to the next line.
  return response.json(); //converts the response into a JavaScript object
}

function getWeatherIcon(id) {
  if (id <= 232) {
    return "thunderstorm.svg";
  }
  else if (id <= 321) {
    return "drizzle.svg";
  }
  else if (id <= 531) {
    return "rain.svg";
  }
  else if (id <= 622) {
    return "snow.svg";
  }
  else if (id <= 781) {
    return "atmosphere.svg";
  }
  else if (id <= 800) {
    return "clear.svg";
  }
  else {
    return "clouds.svg";
  }
}

function getCurrentDate() {
  let currentDate = new Date();
  let options = {
    weekday: 'short',
    day: '2-digit',
    month: 'short'
  }
  return currentDate.toLocaleDateString('en-GB', options);
}
async function updateWeatherInfo(city) {
  const weatherData = await getFetchData('weather', city);
  if (weatherData.cod != 200) {
    mainSection.style.display = 'none';
    message.style.display = 'none'
    notFound.style.display = 'flex';
  }
  else {
    mainSection.style.display = 'block';
    message.style.display = 'none'
    notFound.style.display = 'none';
    Mood = 'Main';
  }
  console.log(weatherData);
  const {
    name: country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed }
  } = weatherData;

  countryTxt.textContent = country;
  cel.textContent = Math.round(temp) + " °C";
  wStatus.textContent = main;
  humValue.textContent = humidity + " %";
  windSpeed.textContent = speed + " M/S";
  weatherImg.src = `./weather/${getWeatherIcon(id)}`;
  dateTxt.textContent = getCurrentDate();
  await updateForecastData(city);
}

async function updateForecastData(city) {
  const forecastData = await getFetchData('forecast', city);
  const timeTaken = '12:00:00';
  const todayDate = new Date().toISOString().split('T')[0]
  document.querySelector(".swiper-wrapper").innerHTML = "";
  forecastData.list.forEach(forecastWeather => {
    if (forecastWeather.dt_txt.includes(timeTaken) &&
      !forecastWeather.dt_txt.includes(todayDate)) {
      console.log(forecastWeather);
      updateForecastItems(forecastWeather)
    }
  })
}

function updateForecastItems(weatherData) {
  console.log(weatherData);
  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp }
  } = weatherData;
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });


  const forecastItems = `
    <div class="swiper-slide">
      <div class="swiper-container">
            <p>${formattedDate}</p>
             <div class="image">
            <img src="./weather/${getWeatherIcon(id)}">
            </div>
            <p>${Math.round(temp)}°C</p>
      </div>
    </div>
  `;

  document.querySelector(".swiper-wrapper").insertAdjacentHTML('beforeend', forecastItems);
}

var swiper = new Swiper(".mySwiper", {
  spaceBetween: 30,
  slidesPerView: 3,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

