import React from 'react'
import {getAllDayZServers} from '../../requests/dayz-servers'
import './ServerBrowserPage.css'
import {Tab} from 'semantic-ui-react'
import {FormattedMessage} from 'react-intl'
import ServerBrowser from './ServerBrowser'
import ServerBrowserFilter from '../ServerBrowserFilter/ServerBrowserFilter'
import ServersTable from '../ServersTable/ServersTable'


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

  panes = () => [{
    menuItem: 'OFFICIAL_SERVERS', render: () => (
      <Tab.Pane>
        <ServersTable servers={this.state.servers.filter(server => !server.privHive)}/>
      </Tab.Pane>
    )
  }, {
    menuItem: 'COMMUNITY_SERVERS', render: () =>
      <Tab.Pane>
        <ServersTable servers={this.state.servers.filter(server => server.privHive)}/>
      </Tab.Pane>
  }]

  render() {
    return (
      <div className='server-browser-page'>
        <div className='server-browser-tables'>
          <Tab panes={this.panes()}/>
        </div>
        <div>
          <ServerBrowserFilter/>
        </div>
      </div>
    )
  }
}

export default ServerBrowserPage

