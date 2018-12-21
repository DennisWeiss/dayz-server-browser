import React from 'react'
import {Table, Pagination} from 'semantic-ui-react'
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

  state = {
    activePage: 1
  }

  constructor(props) {
    super(props)
    console.log('server table component')
  }


  numberOfPages() {
    return Math.ceil(this.props.servers.length / this.props.pageSize)
  }

  onPageChange(event, data) {
    this.setState({activePage: data.activePage})
  }

  render() {
    return (
      <div>
        <div className='server-browser-table-component'>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell
                  className='sortable-header-cell'
                  sorted={this.props.sorting.column === 'name' ? this.props.sorting.direction : null}
                  onClick={this.props.handleSort('name')}>
                  Server name
                </Table.HeaderCell>
                <Table.HeaderCell
                  className='sortable-header-cell'
                  sorted={this.props.sorting.column === 'currentPlayers' ? this.props.sorting.direction : null}
                  onClick={this.props.handleSort('currentPlayers')}>
                  Players
                </Table.HeaderCell>
                <Table.HeaderCell
                  className='sortable-header-cell'
                  sorted={this.props.sorting.column === 'maxPlayers' ? this.props.sorting.direction : null}
                  onClick={this.props.handleSort('maxPlayers')}>
                  Max players
                </Table.HeaderCell>
                <Table.HeaderCell
                  className='sortable-header-cell'
                  sorted={this.props.sorting.column === 'dayTime' ? this.props.sorting.direction : null}
                  onClick={this.props.handleSort('dayTime')}>
                  Day time
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
              {this.props.servers
                .slice((this.state.activePage - 1) * this.props.pageSize, this.state.activePage * this.props.pageSize)
                .map(server => (
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
        <div className='server-browser-table-paginator'>
          <Pagination totalPages={this.numberOfPages()}
                      activePage={this.state.activePage}
                      onPageChange={this.onPageChange.bind(this)}/>
        </div>
      </div>
    )
  }
}

export default ServersTable