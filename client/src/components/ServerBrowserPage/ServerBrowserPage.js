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
    },
    loading: false
  }

  componentDidMount() {
    this.setState({loading: true})
    getAllDayZServers().then(res => {
      if (res.data && res.data.response && res.data.response) {
        this.setState({
          servers: res.data.response.servers.map(mapServer),
          loading: false
        }, this.filterServers)
      }
    })
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
          loading={this.state.loading}
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
          loading={this.state.loading}
          servers={this.state.filteredServers.filter(server => server.privHive)}
          pageSize={200}
          sorting={this.state.sorting}
          handleSort={this.handleSort}/>
      </Tab.Pane>
  }]

  onChangeDayFilter(day) {
    this.setState({day}, this.filterServers)
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

  debouncedFilterServers = debounce(this.filterServers.bind(this), 300, false)

  onSearchByNameChange(event, data) {
    this.setState({serverName: data.value}, this.debouncedFilterServers)
  }

  onIpChange(event, data) {
    this.setState({ip: data.value}, this.debouncedFilterServers)
  }

  onChangeFullServerFilter(fullServer) {
    this.setState({fullServer}, this.filterServers)
  }

  onDayTimeChange(includeDayTime, dayTime) {
    this.setState({dayTime: [includeDayTime, dayTime]}, this.debouncedFilterServers)
  }

  onChangeBattleyeProtectedFilter(battleyeProtected) {
    this.setState({battleyeProtected}, this.filterServers)
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
                               onChangeBattleyeProtectedFilter={this.onChangeBattleyeProtectedFilter.bind(this)}
                               onChangeFullServerFilter={this.onChangeFullServerFilter.bind(this)}
                               onDayTimeChange={this.onDayTimeChange.bind(this)}/>
        </div>
      </div>
    )
  }
}

export default ServerBrowserPage

