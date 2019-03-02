import axios from 'axios'


const getAllDayZServers = () => axios.get(`https://gr-esports.de:3001`)


export {getAllDayZServers}