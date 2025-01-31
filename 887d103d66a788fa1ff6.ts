import { Router } from './router';
import { getCurrentCity } from './geo';
import { getCurrentWeather, getCityCoords } from './openweather';
import { saveToList, loadList } from './storage';
const yandexApiKey = "220bcecd-2e57-4af8-9150-e82755be7199";
const openweathermapApiKey = "ae6748bb3802915412e37c351eeb1d46";
const createMap = ll => {
  const map = document.querySelector(".content-map-box__img");
  if (map) map.src = `https://static-maps.yandex.ru/v1?ll=${ll}&spn=0.016457,0.00619&apikey=${yandexApiKey}`;
};
const showWeather = data => {
  const temperatureEl = document.querySelector(".content-weather-box__temp");
  const weatherDesc = document.querySelector(".content-weather-box__desc");
  const cityName = document.querySelector(".content-weather-box__title");
  const weatherImage = document.querySelector(".content-weather-box__image");
  if (temperatureEl) temperatureEl.textContent = `${Math.round(data.temp - 273.15)}°C`;
  if (weatherDesc) weatherDesc.textContent = data.description;
  if (cityName) cityName.textContent = data.name;
  if (weatherImage) weatherImage.src = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
};
const renderHistory = () => {
  const citiesList = loadList();
  const list = document.querySelector(".interaction__list");
  if (list) {
    list.innerHTML = "";
    citiesList.forEach(city => {
      const li = document.createElement("li");
      li.textContent = city;
      li.addEventListener("click", () => {
        router.navigate(`/city/${encodeURIComponent(city)}`);
      });
      list.appendChild(li);
    });
  }
};
const router = new Router(false);
router.addRoute({
  path: "/",
  onEnter: async () => {
    const mainBox = document.querySelector(".container");
    if ("innerHTML" in mainBox) {
      mainBox.innerHTML = "<h1>Главная страница</h1><p>Добро пожаловать в приложение прогноза погоды!</p>";
    }
  }
});
router.addRoute({
  path: '/weather',
  onEnter: async () => {
    const mainBox = document.querySelector(".container");
    if ("innerHTML" in mainBox) {
      mainBox.innerHTML = `
             <section id="content">
                <h1>Прогноз погоды</h1>
                <div class="search">
                    <input type="text" class="interaction__input" placeholder="Введите город">
                    <button class="interaction__button">Найти</button>
                </div>
                <ul class="interaction__list"></ul>
                <div class="content-weather-box">
                    <h2 class="content-weather-box__title">Город</h2>
                    <p class="content-weather-box__temp">--°C</p>
                    <p class="content-weather-box__desc">Описание</p>
                    <img class="content-weather-box__image" alt="Погода">
                </div>
                <div class="content-map-box">
                    <img class="content-map-box__img" alt="Карта">
                </div>
            </section>
        `;
    }
    document.querySelector(".interaction__button")?.addEventListener("click", event => {
      event.preventDefault();
      const input = document.querySelector(".interaction__input");
      if (input?.value) {
        router.navigate(`/city/${encodeURIComponent(input.value)}`);
      }
    });
    const {
      cityName,
      ll
    } = await getCurrentCity();
    createMap(ll);
    const weather = await getCurrentWeather(cityName, openweathermapApiKey);
    showWeather(weather);
    renderHistory();
  }
});
router.addRoute({
  path: /^\/city\/(.+)$/,
  onEnter: async uriCity => {
    const mainBox = document.querySelector(".container");
    const interactionButton = document.querySelector(".interaction__button");
    if (!interactionButton) {
      if ("innerHTML" in mainBox) {
        mainBox.innerHTML = `
                     <section id="content">
                        <h1>Прогноз погоды</h1>
                        <div class="search">
                            <input type="text" class="interaction__input" placeholder="Введите город">
                            <button class="interaction__button">Найти</button>
                        </div>
                        <ul class="interaction__list"></ul>
                        <div class="content-weather-box">
                            <h2 class="content-weather-box__title">Город</h2>
                            <p class="content-weather-box__temp">--°C</p>
                            <p class="content-weather-box__desc">Описание</p>
                            <img class="content-weather-box__image" alt="Погода">
                        </div>
                        <div class="content-map-box">
                            <img class="content-map-box__img" alt="Карта">
                        </div>
                    </section>
                `;
      }
      interactionButton?.addEventListener("click", event => {
        event.preventDefault();
        const input = document.querySelector(".interaction__input");
        if (input?.value) {
          router.navigate(`/city/${encodeURIComponent(input.value)}`);
        }
      });
    }
    const city = decodeURIComponent(uriCity);
    const weather = await getCurrentWeather(city, openweathermapApiKey);
    showWeather(weather);
    const coords = await getCityCoords(city, openweathermapApiKey);
    createMap(coords);
    let citiesList = loadList();
    if (!citiesList.includes(city)) {
      citiesList.push(city);
      if (citiesList.length > 10) citiesList.shift();
      saveToList(citiesList);
    }
    renderHistory();
  }
});
router.addRoute({
  path: "/about",
  onEnter: async () => {
    const mainBox = document.querySelector(".container");
    if ("innerHTML" in mainBox) {
      mainBox.innerHTML = "<h1>О проекте</h1><p>Информация о проекте...</p>";
    }
  }
});
document.body.innerHTML = `
  <nav class="nav">
    <a href="./" onclick="router.navigate('/'); return false;" class="nav__link" data-link>Главная</a>
    <a href="./weather" onclick="router.navigate('/weather'); return false;" class="nav__link" data-link>О погоде</a>
    <a href="./about" onclick="router.navigate('/about'); return false;" class="nav__link" data-link>О проекте</a>
  </nav>
  <main class="container"></main>
`;
window.router = router;
router.navigate(router.useHash ? window.location.hash.slice(1) || "/" : window.location.pathname);