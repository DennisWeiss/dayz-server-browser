import axios from 'axios'
import conf from '../conf/config'


const getAllDayZServers = () =>
  axios.get(`https://api.steampowered.com/IGameServersService/GetServerList/v1/?key=${conf.STEAM_API_KEY}&format=json&filter=appid\\221100&limit=50000`)


export {getAllDayZServers}