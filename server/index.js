const express = require('express')
const axios = require('axios')
const appConf = require('appConf/config')
const fs = require('fs')
const https = require('https')


const app = express()
const port = 3001

app.get('/', (req, res) => {
  axios
    .get(`http://api.steampowered.com/IGameServersService/GetServerList/v1/?key=${appConf.STEAM_API_KEY}&format=json&filter=appid\\221100&limit=50000`)
    .then(res => res.send(res.data))
})


const startHttpServer = () => {
  app.listen(appConf.serverPort, () => console.log(`Server running on ${appConf.SERVER_PORT}`))
}

const startHttpsServer = (privateKeyFilename, certFilename) => {
  const server = https.createServer({
    key: fs.readFileSync(privateKeyFilename),
    cert: fs.readFileSync(certFilename)
  }, app)
  server.listen(appConf.serverPort, () => console.log(`Server running on ${appConf.SERVER_PORT}`))
}

if (process.argv.length >= 3 && process.argv[2] === 'https') {
  startHttpsServer('privatekey.pem', 'certificate.pem')
} else {
  startHttpServer()
}
