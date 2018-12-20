import React from 'react'
import './ServerBrowserFilter.css'
import {faFilter} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import ThreeStateCheckbox from '../../common/ThreeStateCheckbox'
import {FormattedMessage} from 'react-intl'
import {Input} from 'semantic-ui-react'
import {debounce} from '../../helper/helperfunctions'


class ServerBrowserFilter extends React.Component {

  render() {
    return (
      <div className='server-browser-filter'>
        <FontAwesomeIcon size='lg' icon={faFilter}/>
        <span className='filter-heading'>Filter</span>
        <div className='filter-content'>
          <Input placeholder='Search by name' onChange={debounce(this.props.onSearchByNameChange, 500, false)}/>
          <br/>
          <Input placeholder='Search by IP' onChange={debounce(this.props.onIpChange, 500, false)}/>
          <br/>
          <ThreeStateCheckbox title={<FormattedMessage id='DAY'/>} onClick={this.props.onChangeDayFilter}/>
          <br/>
          <ThreeStateCheckbox title={<FormattedMessage id='FULL_SERVER'/>} onClick={this.props.onChangeFullServerFilter}/>
        </div>
      </div>
    )
  }
}

export default ServerBrowserFilter