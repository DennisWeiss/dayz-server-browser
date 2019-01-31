const express = require('express')
const axios = require('axios')
const appConf = require('./conf/config')
const fs = require('fs')
const https = require('https')
const cors = require('cors')


const app = express()
const port = 3001

app.use(cors())
app.options('*', cors())

app.get('/', (req, res) => {
  axios
    .get(`http://api.steampowered.com/IGameServersService/GetServerList/v1/?key=${appConf.STEAM_API_KEY}&format=json&filter=appid\\221100&limit=50000`)
    .then(response => res.send(response.data))
})


const startHttpServer = () => {
  app.listen(appConf.SERVER_PORT, () => console.log(`Server running on ${appConf.SERVER_PORT}`))
}

const startHttpsServer = (privateKeyFilename, certFilename) => {
  const server = https.createServer({
    key: fs.readFileSync(privateKeyFilename),
    cert: fs.readFileSync(certFilename)
  }, app)
  server.listen(appConf.SERVER_PORT, () => console.log(`Server running on ${appConf.SERVER_PORT}`))
}

if (process.argv.length >= 3 && process.argv[2] === 'https') {
  startHttpsServer('privatekey.pem', 'certificate.pem')
} else {
  startHttpServer()
}
