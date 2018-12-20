import React from 'react'
import ServersTable from '../ServersTable/ServersTable'
import ServerBrowserFilter from '../ServerBrowserFilter/ServerBrowserFilter'
import {getAllDayZServers} from '../../requests/dayz-servers'
import './ServerBrowserPage.css'


const mapServer = server => {
  const gameTypeLst = server.gametype ? server.gametype.split(',') : []

  return {
    name: server.name,
    currentPlayers: server.players,
    maxPlayers: server.max_players,
    dayTime: gameTypeLst.length > 0 ? gameTypeLst[gameTypeLst.length - 1] : '',
    ip: `${server.addr.split(':')[0]}:${server.gameport}`,
    version: server.version,
    privHive: gameTypeLst.includes('privHive')
  }
}


class ServerBrowserPage extends React.Component {

  state = {
    servers: []
  }

  componentDidMount() {
    getAllDayZServers().then(res => {
      if (res.data && res.data.response && res.data.response) {
        this.setState({servers: res.data.response.servers.map(mapServer)})
      }
    })
  }

  render() {
    return (
      <div className="server-browser-page">
        <ServersTable servers={this.state.servers.filter(server => !server.privHive)}/>
        <ServerBrowserFilter/>
      </div>
    )
  }
}

export default ServerBrowserPage

