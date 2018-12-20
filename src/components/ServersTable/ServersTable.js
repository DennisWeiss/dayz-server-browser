import React from 'react'
import {Table} from 'semantic-ui-react'
import {FormattedMessage} from 'react-intl'


class ServersTable extends React.Component {
  render() {
    return (
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
      </Table>
    )
  }
}

export default ServersTable