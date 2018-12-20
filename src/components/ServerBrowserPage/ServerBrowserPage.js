import React from 'react'
import ServersTable from "../ServersTable/ServersTable";
import ServerBrowserFilter from "../ServerBrowserFilter/ServerBrowserFilter";


class ServerBrowserPage extends React.Component {
  render() {
    return (
      <div>
        <ServersTable/>
        <ServerBrowserFilter/>
      </div>
    )
  }
}

export default ServerBrowserPage

