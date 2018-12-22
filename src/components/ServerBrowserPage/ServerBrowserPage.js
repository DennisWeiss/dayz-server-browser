import React from 'react'
import {getAllDayZServers} from '../../requests/dayz-servers'
import './ServerBrowserPage.css'
import {Tab} from 'semantic-ui-react'
import {FormattedMessage} from 'react-intl'
import ServerBrowser from './ServerBrowser'
import ServerBrowserFilter from '../ServerBrowserFilter/ServerBrowserFilter'
import ServersTable from '../ServersTable/ServersTable'
import uuidv1 from 'uuid/v1'
import {debounce} from '../../helper/helperfunctions'
import {initializeReactUrlState} from 'react-url-state'


const mapServer = server => {
  const gameTypeLst = server.gametype ? server.gametype.split(',') : []

  return {
    name: server.name,
    currentPlayers: server.players,
    maxPlayers: server.max_players,
    dayTime: gameTypeLst.length > 0 ? gameTypeLst[gameTypeLst.length - 1] : '',
    ip: server.addr,
    version: server.version,
    privHive: gameTypeLst.includes('privHive'),
    battleyeProtected: gameTypeLst.includes('battleye')
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

const filterByBattleyeProtected = (server, battleyeProtectedFilter) => battleyeProtectedFilter === 'neutral' ||
  battleyeProtectedFilter === 'positive' && server.battleyeProtected ||
  battleyeProtectedFilter === 'negative' && !server.battleyeProtected

const serverComparator = column => (a, b) => {
  switch (column) {
    case 'name':
      if (a.name < b.name) {
        return -1
      }
      if (a.name > b.name) {
        return 1
      }
      return 0
    case 'currentPlayers':
      return b.currentPlayers - a.currentPlayers
    case 'maxPlayers':
      return b.maxPlayers - a.maxPlayers
    case 'dayTime':
      return getMinutesOfDayTime(a.dayTime) - getMinutesOfDayTime(b.dayTime)
    default:
      return 0
  }
}

const threeStateCheckboxAbbrevMapper = abbrev => {
  switch (abbrev) {
    case 'pos':
      return 'positive'
    case 'neg':
      return 'negative'
    default:
      return 'neutral'
  }
}

const reactUrlStateOptions = {
  fromIdResolvers: {
    day: day => new Promise(resolve => resolve(threeStateCheckboxAbbrevMapper(day))),
    serverName: serverName => new Promise(resolve => resolve(serverName)),
    ip: ip => new Promise(resolve => resolve(ip)),
    fullServer: fullServer => new Promise(resolve => resolve(threeStateCheckboxAbbrevMapper(fullServer))),
    dayTime: dayTimeStr => new Promise(resolve => {
      const dayTimeData = dayTimeStr.split(',')
      resolve([dayTimeData.length >= 1 ? threeStateCheckboxAbbrevMapper(dayTimeData[0]) : 'neutral',
        [dayTimeData.length >= 2 ? parseInt(dayTimeData[1], 10) : 600, dayTimeData.length >= 3 ? parseInt(dayTimeData[2], 10) : 840]])
    }),
    battleyeProtected: battleyeProtected => new Promise(resolve => resolve(threeStateCheckboxAbbrevMapper(battleyeProtected)))
  },
  toIdMappers: {
    day: day => day.substr(0, 3),
    serverName: serverName => serverName,
    ip: ip => ip,
    fullServer: fullServer => fullServer.substr(0, 3),
    dayTime: dayTime => `${dayTime[0].substr(0, 3)},${dayTime[1][0]},${dayTime[1][1]}`,
    battleyeProtected: battleyeProtected => battleyeProtected.substr(0, 3)
  }
}

class ServerBrowserPage extends React.Component {

  state = {
    servers: [],
    day: 'neutral',
    serverName: '',
    ip: '',
    fullServer: 'neutral',
    dayTime: ['neutral', [600, 840]],
    battleyeProtected: 'neutral',
    filteredServers: [],
    sorting: {
      column: null,
      direction: null
    }
  }

  componentDidMount() {
    getAllDayZServers().then(res => {
      if (res.data && res.data.response && res.data.response) {
        this.setState({servers: res.data.response.servers.map(mapServer)}, this.filterServers)
      }
    })
    this.reactUrlState = initializeReactUrlState(this)(reactUrlStateOptions)
  }

  handleSort = clickedColumn => () => {
    if (this.state.sorting.column !== clickedColumn) {
      this.setState({
        filteredServers: [...this.state.filteredServers].sort(serverComparator(clickedColumn)),
        sorting: {
          column: clickedColumn,
          direction: 'ascending'
        }
      })
    } else {
      this.setState({
        filteredServers: this.state.filteredServers.reverse(),
        sorting: {
          column: this.state.sorting.column,
          direction: this.state.sorting.direction === 'ascending' ? 'descending' : 'ascending'
        }
      })
    }
  }

  panes = () => [{
    menuItem: 'Official servers', render: () => (
      <Tab.Pane>
        <ServersTable
          key={uuidv1()}
          servers={this.state.filteredServers.filter(server => !server.privHive)}
          pageSize={200}
          sorting={this.state.sorting}
          handleSort={this.handleSort}/>
      </Tab.Pane>
    )
  }, {
    menuItem: 'Community servers', render: () =>
      <Tab.Pane>
        <ServersTable
          key={uuidv1()}
          servers={this.state.filteredServers.filter(server => server.privHive)}
          pageSize={200}
          sorting={this.state.sorting}
          handleSort={this.handleSort}/>
      </Tab.Pane>
  }]

  onChangeDayFilter(day) {
    this.reactUrlState.setUrlState({day}, this.filterServers)
  }

  filterServers() {
    const filteredServers = this.state.servers.filter(server =>
      filterByDay(server, this.state.day) &&
      filterByServerName(server, this.state.serverName) &&
      filterByIp(server, this.state.ip) &&
      filterByFullServer(server, this.state.fullServer) &&
      filterByDayTime(server, this.state.dayTime) &&
      filterByBattleyeProtected(server, this.state.battleyeProtected)
    ).sort((a, b) => (this.state.sorting.direction === 'ascending' ? 1 : -1) *
      serverComparator(this.state.sorting.column)(a, b))
    this.setState({filteredServers})
  }

  onSearchByNameChange(event, data) {
    this.reactUrlState.setUrlState({serverName: data.value}, debounce(this.filterServers.bind(this), 500, false))
  }

  onIpChange(event, data) {
    this.reactUrlState.setUrlState({ip: data.value}, debounce(this.filterServers.bind(this), 500, false))
  }

  onChangeFullServerFilter(fullServer) {
    this.reactUrlState.setUrlState({fullServer}, this.filterServers)
  }

  onDayTimeChange(includeDayTime, dayTime) {
    this.reactUrlState.setUrlState({dayTime: [includeDayTime, dayTime]}, this.filterServers)
  }

  onChangeBattleyeProtectedFilter(battleyeProtected) {
    this.reactUrlState.setUrlState({battleyeProtected}, this.filterServers)
  }

  render() {
    return (
      <div className='server-browser-page'>
        <div className='server-browser-tables'>
          <Tab panes={this.panes()}/>
        </div>
        <div>
          <ServerBrowserFilter onChangeDayFilter={this.onChangeDayFilter.bind(this)}
                               day={this.state.day}
                               onSearchByNameChange={this.onSearchByNameChange.bind(this)}
                               name={this.state.serverName}
                               onIpChange={this.onIpChange.bind(this)}
                               ip={this.state.ip}
                               onChangeBattleyeProtectedFilter={this.onChangeBattleyeProtectedFilter.bind(this)}
                               battleyeProtected={this.state.battleyeProtected}
                               onChangeFullServerFilter={this.onChangeFullServerFilter.bind(this)}
                               fullServer={this.state.fullServer}
                               onDayTimeChange={this.onDayTimeChange.bind(this)}
                               dayTime={this.state.dayTime}/>
        </div>
      </div>
    )
  }
}

export default ServerBrowserPage

