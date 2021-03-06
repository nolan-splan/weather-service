const http = require('http')
const service = require('./weather_service')
const CronJob = require('cron').CronJob
const port = 3000

http.createServer((req, res) => {
  res.end()
}).listen(port)

service.fetchWeather();
new CronJob('0 * * * *', () => {
  service.fetchWeather();
}, null, true, 'America/Chicago')