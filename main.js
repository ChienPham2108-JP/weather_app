const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const statusElement = $('[data-status]');
const locationElement = $('[data-location]');
const temperatureElement = $('[data-temperature]')
const humidityElement = $('[data-humidity]')
const visibilityElement = $('[data-visibility]')
const windSpeedElement = $('[data-wind-speed]')
const cloudinessElement = $('[data-cloudiness]')
const citySearchElement = $('input[class="city-search"]');
const timeElement = $('.time');
const dateElement = $('.date');
const todayElement = $('.today');
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

console.log(dateElement);
const weatherApp = {
  "apiKey": '20a462cecf95f0bd4855e805dd6938b4',
  fetchWeather: function(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`)
      .then((response) => response.json())
      .then((data) => {
        this.displayWeather(data);
        this.fetchWeatherForecast(data);
        this.displayBackground(data);
      })
  },
  displayWeather: function(data) {
    console.log(data);
    if (data.cod === '404') {
      alert("City not found");
    } else {
      const {name, visibility} = data;
      const {country} = data.sys;
      const {humidity, temp} = data.main;
      const {all:cloundiness} = data.clouds;
      const {speed} = data.wind;
      const {description} = data.weather[0];
      statusElement.textContent = `${description}`;
      locationElement.textContent = `${name}, ${country}`;
      temperatureElement.innerHTML = `${temp} &#176;C`;
      humidityElement.innerHTML = `${humidity}%`;
      visibilityElement.textContent = `${visibility/1000} km`;
      windSpeedElement.textContent = `${speed} km/h`;
      cloudinessElement.textContent = `${cloundiness}%`;
    }
  },
  handleEvents: function() {
    const _this = this;
    citySearchElement.onchange = function() {
      const city = citySearchElement.value;
      _this.fetchWeather(city);
    }
  },
  displayDate: function() {
    setInterval(function() {
      const d = new Date();
      const hours = d.getHours();
      const minutes = d.getMinutes();
      const hoursIn12HrFormat = (hours >= 13) ? hours % 12 : hours;
      const am_pm = (hours >= 12) ? ' PM' : ' AM';
      timeElement.innerHTML = (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) + ':' +
      (minutes < 10 ? '0' + minutes : minutes) + '<span id="am-pm">' + am_pm + '</span>';
        dateElement.innerHTML = `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`
  }, 1000)
  },
  fetchWeatherForecast: function(data) {
    const {lon, lat} = data.coord;
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,current,minutely&units=metric&appid=20a462cecf95f0bd4855e805dd6938b4`)
      .then((response) => response.json())
      .then((data) => this.renderFutureWeather(data))
  },
  renderFutureWeather: function(data) {
    const d = new Date();
    const today = d.getDay();
    data.daily.map(function(item, index) {
      const dayReality = days[index + today];
      const {icon, description} = item.weather[0];
      const {max, min} = item.temp;
      if (index == 0) {
        todayElement.innerHTML =
        `<img class="icon" src="https://openweathermap.org/img/wn//${icon}@4x.png" alt="weather-icon">
        <div class="other">
          <div class="day">${dayReality}</div>
          <div class="temp">${max}&#176;
            <span id="min-temp">${min}&#176;</span>
          </div>
          <div class="description">${description}</div>
        </div>`
      } else {
        const weatherForecastItemElement = $(`[data-index="${index}"]`);
        weatherForecastItemElement.innerHTML =
        `<div class="day">${dayReality}</div>
        <img class="icon" src="https://openweathermap.org/img/wn//${icon}@4x.png" alt="weather-icon" width="100" height="100">
        <div class="temp">${max}&#176;
          <span id="min-temp">${min}&#176;</span>
        </div>
        <div class="description">${description}</div>`
      }
    })
  },
  displayBackground: function(data) {
    const {icon} = data.weather[0];
    const backgroundElement = $('body');
    console.log(icon);
    switch(icon) {
      case '01d': 
        backgroundElement.style.backgroundImage = `url('./assets/images/day/clearsky.jpg')`;
        break;
      case '01n': 
        backgroundElement.style.backgroundImage = `url('./assets/images/night/clearsky.jpg')`;
        break;
      case '02d': 
        backgroundElement.style.backgroundImage = `url('./assets/images/day/fewclouds.jpg')`;
        break;
      case '02n': 
        backgroundElement.style.backgroundImage = `url('./assets/images/night/fewclouds.jpg')`;
        break;
      case '03d': 
        backgroundElement.style.backgroundImage = `url('./assets/images/day/scatteredclouds.jpg')`;
        break;
      case '03n': 
        backgroundElement.style.backgroundImage = `url('./assets/images/night/scatteredclouds.jpg')`;
        break;
      case '04d': 
        backgroundElement.style.backgroundImage = `url('./assets/images/day/brokenclouds.jpg')`;
        break;
      case '04n': 
        backgroundElement.style.backgroundImage = `url('./assets/images/night/brokenclouds.jpg')`;
        break;
      case '09d': 
        backgroundElement.style.backgroundImage = `url('./assets/images/day/showerrain.jpg')`;
        break;
      case '09n': 
        backgroundElement.style.backgroundImage = `url('./assets/images/night/showerrain.jpg')`;
        break;
      case '10d': 
        backgroundElement.style.backgroundImage = `url('./assets/images/day/rain.jpg')`;
        break;
      case '10n': 
        backgroundElement.style.backgroundImage = `url('./assets/images/night/rain.jpg')`;
        break;
      case '11d': 
        backgroundElement.style.backgroundImage = `url('./assets/images/day/thunderstorm.jpg')`;
        break;
      case '11n': 
        backgroundElement.style.backgroundImage = `url('./assets/images/night/thunderstorm.jpg')`;
        break;
      case '13d': 
        backgroundElement.style.backgroundImage = `url('./assets/images/day/snow.jpg')`;
        break;
      case '13n': 
        backgroundElement.style.backgroundImage = `url('./assets/images/night/snow.jpg')`;
        break;
      case '50d': 
        backgroundElement.style.backgroundImage = `url('./assets/images/day/mist.jpg')`;
        break;
      case '50n': 
        backgroundElement.style.backgroundImage = `url('./assets/images/night/mist.jpg')`;
        break;
      default:
        backgroundElement.style.backgroundImage = `url('./assets/images/night/hanoi-night.jpg')`;
    }
  }
  ,
  start: function() {
    this.handleEvents();
    this.displayDate();
  }
}

weatherApp.start();