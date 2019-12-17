require('dotenv').config()
const fetch = require('node-fetch')
const db = require('./queries')
const fetchWeather = () => {
  const lat = '45.816631099999995'
  const lon = '-88.0729654'
  const units = 'imperial'
  const appid = process.env.APPID
  const url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=' + units + '&appid=' + appid
  fetch(url)
    .then((res) => {
      return res.json()
    })
    .then((json) => {
      db.writeWeather(json)
    })
}

module.exports = {
  fetchWeather,
}