import React from 'react'
import {Table, Pagination, Button, Dimmer, Loader} from 'semantic-ui-react'
import {FormattedMessage} from 'react-intl'
import {faSun, faMoon} from '@fortawesome/free-regular-svg-icons'
import {faSortUp, faSortDown, faLock, faLockOpen} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import './ServersTable.css'
import classNames from 'classnames'
import uuidv1 from 'uuid/v1'


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

  numberOfPages() {
    return Math.ceil(this.props.servers.length / this.props.pageSize)
  }

  onPageChange(event, data) {
    this.setState({activePage: data.activePage})
  }

  getSortIcon(column) {
    if (this.props.sorting.column === column) {
      if (this.props.sorting.direction === 'ascending') {
        return <FontAwesomeIcon icon={faSortUp}/>
      } else if (this.props.sorting.direction === 'descending') {
        return <FontAwesomeIcon icon={faSortDown}/>
      }
    }
    return null
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
                  <span className='sortable-header-cell-title'>Server name</span>
                  {this.getSortIcon('name')}
                </Table.HeaderCell>
                <Table.HeaderCell
                  className={classNames(['sortable-header-cell', 'col-number'])}
                  sorted={this.props.sorting.column === 'currentPlayers' ? this.props.sorting.direction : null}
                  onClick={this.props.handleSort('currentPlayers')}>
                  <span className='sortable-header-cell-title'>Players</span>
                  {this.getSortIcon('currentPlayers')}
                </Table.HeaderCell>
                <Table.HeaderCell
                  className={classNames(['sortable-header-cell', 'col-number'])}
                  sorted={this.props.sorting.column === 'maxPlayers' ? this.props.sorting.direction : null}
                  onClick={this.props.handleSort('maxPlayers')}>
                  <span className='sortable-header-cell-title'>Max players</span>
                  {this.getSortIcon('maxPlayers')}
                </Table.HeaderCell>
                <Table.HeaderCell
                  className={classNames(['sortable-header-cell', 'col-daytime'])}
                  sorted={this.props.sorting.column === 'dayTime' ? this.props.sorting.direction : null}
                  onClick={this.props.handleSort('dayTime')}>
                  <span className='sortable-header-cell-title'>Day time</span>
                  {this.getSortIcon('dayTime')}
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
              <Dimmer active={this.props.loading}>
                <Loader/>
              </Dimmer>
              {this.props.servers
                .slice((this.state.activePage - 1) * this.props.pageSize, this.state.activePage * this.props.pageSize)
                .map(server => (
                  <Table.Row key={uuidv1()}>
                    <Table.Cell width={7}>
                      {server.name}
                      <span className='battleye-icon'>
                        {server.battleyeProtected ? <FontAwesomeIcon icon={faLock}/> :
                          <FontAwesomeIcon icon={faLockOpen}/>}
                      </span>
                    </Table.Cell>
                    <Table.Cell width={1} className='col-number'>
                      {server.currentPlayers}
                    </Table.Cell>
                    <Table.Cell width={1} className='col-number'>
                      {server.maxPlayers}
                    </Table.Cell>
                    <Table.Cell width={2} className='col-daytime'>
                      <FontAwesomeIcon icon={getDayTimeIcon(server.dayTime)}/>
                      <span className='server-day-time'>{server.dayTime}</span>
                    </Table.Cell>
                    <Table.Cell width={2}>
                      {server.ip}
                    </Table.Cell>
                    <Table.Cell width={2}>
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