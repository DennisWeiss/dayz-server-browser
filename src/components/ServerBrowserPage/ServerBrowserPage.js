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

const isDay = dayTime => {
  if (!dayTime || !dayTime.includes(':')) {
    return false
  }
  const hour = parseInt(dayTime.split(':')[0], 10)
  return hour >= 6 && hour < 18
}

const filterByDay = (server, dayFilter) => dayFilter === 'neutral' || dayFilter === 'positive' && isDay(server.dayTime) ||
  dayFilter === 'negative' && !isDay(server.dayTime)

const filterByServerName = (server, serverNameFilter) => !serverNameFilter ||
  server.name.toLowerCase().includes(serverNameFilter.toLowerCase())

const filterByIp = (server, ipFilter) => !ipFilter || server.ip.includes(ipFilter)

class ServerBrowserPage extends React.Component {

  state = {
    servers: [],
    filter: {
      day: 'neutral',
      serverName: '',
      ip: ''
    },
    filteredServers: [],
  }

  componentDidMount() {
    getAllDayZServers().then(res => {
      if (res.data && res.data.response && res.data.response) {
        this.setState({servers: res.data.response.servers.map(mapServer)}, this.filterServers)
      }
    })
  }

  panes = () => [{
    menuItem: 'OFFICIAL_SERVERS', render: () => (
      <Tab.Pane>
        <ServersTable servers={this.state.filteredServers.filter(server => !server.privHive)}/>
      </Tab.Pane>
    )
  }, {
    menuItem: 'COMMUNITY_SERVERS', render: () =>
      <Tab.Pane>
        <ServersTable servers={this.state.filteredServers.filter(server => server.privHive)}/>
      </Tab.Pane>
  }]

  onChangeDayFilter(value) {
    const filter = {...this.state.filter}
    filter.day = value
    this.setState({filter}, this.filterServers)
  }

  filterServers() {
    const filteredServers = this.state.servers.filter(server =>
      filterByDay(server, this.state.filter.day) &&
      filterByServerName(server, this.state.filter.serverName) &&
      filterByIp(server, this.state.filter.ip)
    )
    this.setState({filteredServers})
  }

  onSearchByNameChange(event, data) {
    const filter = {...this.state.filter}
    filter.serverName = data.value
    this.setState({filter}, this.filterServers)
  }

  onIpChange(event, data) {
    const filter = {...this.state.filter}
    filter.ip = data.value
    this.setState({filter}, this.filterServers)
  }

  render() {
    return (
      <div className='server-browser-page'>
        <div className='server-browser-tables'>
          <Tab panes={this.panes()}/>
        </div>
        <div>
          <ServerBrowserFilter onChangeDayFilter={this.onChangeDayFilter.bind(this)}
                               onSearchByNameChange={this.onSearchByNameChange.bind(this)}
                               onIpChange={this.onIpChange.bind(this)}/>
        </div>
      </div>
    )
  }
}

export default ServerBrowserPage

