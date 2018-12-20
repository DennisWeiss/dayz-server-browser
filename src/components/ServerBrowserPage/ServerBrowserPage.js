import React from 'react'
import ServersTable from '../ServersTable/ServersTable'
import ServerBrowserFilter from '../ServerBrowserFilter/ServerBrowserFilter'
import {getAllDayZServers} from '../../requests/dayz-servers'


class ServerBrowserPage extends React.Component {

  state = {
    servers: []
  }

  componentDidMount() {
    getAllDayZServers().then(res => this.setState({servers: res.data}))
  }

  render() {
    return (
      <div>
        <ServersTable servers={this.state.servers}/>
        <ServerBrowserFilter/>
      </div>
    )
  }
}

export default ServerBrowserPage

