require('dotenv').config()
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'ntsplan',
  host: 'localhost',
  database: 'weather_api',
  password: process.env.DB_PASSWORD,
  port: 5433,
})

function writeWeather(json) {
  findOrCreateLocation(json)
}

function insertWeather(data, location) {
  const queryString = `
    INSERT INTO weather(
      location_id, description, temp,
      feels_like,  temp_min,    temp_max,
      pressure,    humidity,    wind_speed,
      wind_degree, sunrise,     sunset, name
    )
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`
  const values = getWeatherValues(data)
  values.unshift(location.location_id)
  pool.query(queryString, values, (err, res) => {
    if (err) {
      throw err
    } else {
      var date = new Date()
      console.log('inserted weather on', date)
    }
  })
}

function findOrCreateLocation(json) {
  const { name, coord } = json
  const { lat, lon } = coord
  pool.query('SELECT * FROM locations WHERE name = $1', [name], (err, res) => {
    let location;
    if (err) {
      throw err
    }
    if (res.rowCount === 0) {
      location = createLocation(name, lat, lon)
      insertWeather(json, location)
    } else {
      location = res.rows[0]
      insertWeather(json, location)
    }
  })
}

function createLocation(name, lat, lon) {
  pool.query('INSERT INTO locations(name, lat, lon) VALUES($1, $2, $3)', [name, lat, lon], (err, res) => {
    if (err) {
      throw err
    } else {
      return res.rows[0]
    }
  })
}

function getWeatherValues(data) {
  return [
    data.weather[0].description,
    data.main.temp,
    data.main.feels_like,
    data.main.temp_min,
    data.main.temp_max,
    data.main.pressure,
    data.main.humidity,
    data.wind.speed,
    data.wind.deg,
    data.sys.sunrise,
    data.sys.sunset,
    data.name
  ]
}

module.exports = {
  writeWeather,
}