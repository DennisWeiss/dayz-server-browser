import React from 'react'
import {Table} from 'semantic-ui-react'
import {FormattedMessage} from 'react-intl'
import {faSun, faMoon} from '@fortawesome/free-regular-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import './ServersTable.css'


const getDayTimeIcon = dayTime => {
  if (!dayTime || !dayTime.includes(':')) {
    return null
  }
  const hour = parseInt(dayTime.split(':')[0], 10)
  if (hour < 6) {
    return faMoon
  }
  if (hour < 18) {
    return faSun
  }
  return faMoon
}

class ServersTable extends React.Component {
  render() {
    return (
      <div className='server-browser-table-component'>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <FormattedMessage id='SERVER_NAME'/>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <FormattedMessage id='CURRENT_PLAYERS'/>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <FormattedMessage id='MAX_PLAYERS'/>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <FormattedMessage id='DAY_TIME'/>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <FormattedMessage id='IP_ADDRESS'/>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <FormattedMessage id='VERSION'/>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.props.servers.map(server => (
              <Table.Row>
                <Table.Cell>
                  {server.name}
                </Table.Cell>
                <Table.Cell>
                  {server.currentPlayers}
                </Table.Cell>
                <Table.Cell>
                  {server.maxPlayers}
                </Table.Cell>
                <Table.Cell>
                  <FontAwesomeIcon icon={getDayTimeIcon(server.dayTime)}/>
                  <span className='server-day-time'>{server.dayTime}</span>
                </Table.Cell>
                <Table.Cell>
                  {server.ip}
                </Table.Cell>
                <Table.Cell>
                  {server.version}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    )
  }
}

export default ServersTable