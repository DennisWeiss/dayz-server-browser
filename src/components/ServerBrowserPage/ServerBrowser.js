import React from 'react'
import ServersTable from '../ServersTable/ServersTable'
import ServerBrowserFilter from '../ServerBrowserFilter/ServerBrowserFilter'
import './ServerBrowser.css'


const ServerBrowser = props => (
  <div className="server-browser-page">
    <ServersTable servers={props.servers.filter(server => props.private ? server.privHive : !server.privHive)}/>
    <ServerBrowserFilter/>
  </div>
)

export default ServerBrowser