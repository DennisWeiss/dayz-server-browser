import React from 'react'
import {getAllDayZServers} from '../../requests/dayz-servers'
import './ServerBrowserPage.css'
import {Tab} from 'semantic-ui-react'
import {FormattedMessage} from 'react-intl'
import ServerBrowser from './ServerBrowser'
import ServerBrowserFilter from '../ServerBrowserFilter/ServerBrowserFilter'
import ServersTable from '../ServersTable/ServersTable'
import uuidv1 from 'uuid/v1'


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

const isFull = server => server.currentPlayers >= server.maxPlayers

const filterByFullServer = (server, fullServerFilter) => fullServerFilter === 'neutral' ||
  fullServerFilter === 'positive' && isFull(server) || fullServerFilter === 'negative' && !isFull(server)

const getMinutesOfDayTime = dayTime => {
  if (!dayTime || !dayTime.includes(':')) {
    return 0
  }
  const dayTimeLst = dayTime.split(':')
  return parseInt(dayTimeLst[0], 10) * 60 + parseInt(dayTimeLst[1], 10)
}

const isInDayTimeRange = (dayTime, dayTimeFiterRange) => {
  const minutes = getMinutesOfDayTime(dayTime)
  return dayTimeFiterRange[0] <= minutes && minutes <= dayTimeFiterRange[1]
}

const filterByDayTime = (server, dayTimeFilter) => dayTimeFilter[0] === 'neutral' ||
  dayTimeFilter[0] === 'positive' && isInDayTimeRange(server.dayTime, dayTimeFilter[1]) ||
  dayTimeFilter[0] === 'negative' && !isInDayTimeRange(server.dayTime, dayTimeFilter[1])

class ServerBrowserPage extends React.Component {

  state = {
    servers: [],
    filter: {
      day: 'neutral',
      serverName: '',
      ip: '',
      fullServer: 'neutral',
      dayTime: ['neutral', [600, 840]]
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
        <ServersTable key={uuidv1()} servers={this.state.filteredServers.filter(server => !server.privHive)} pageSize={200}/>
      </Tab.Pane>
    )
  }, {
    menuItem: 'COMMUNITY_SERVERS', render: () =>
      <Tab.Pane>
        <ServersTable key={uuidv1()} servers={this.state.filteredServers.filter(server => server.privHive)} pageSize={200}/>
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
      filterByIp(server, this.state.filter.ip) &&
      filterByFullServer(server, this.state.filter.fullServer) &&
      filterByDayTime(server, this.state.filter.dayTime)
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

  onChangeFullServerFilter(value) {
    const filter = {...this.state.filter}
    filter.fullServer = value
    this.setState({filter}, this.filterServers)
  }

  onDayTimeChange(includeDayTime, dayTime) {
    const filter = {...this.state.filter}
    filter.dayTime = [includeDayTime, dayTime]
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
                               onIpChange={this.onIpChange.bind(this)}
                               onChangeFullServerFilter={this.onChangeFullServerFilter.bind(this)}
                               onDayTimeChange={this.onDayTimeChange.bind(this)}/>
        </div>
      </div>
    )
  }
}

export default ServerBrowserPage

