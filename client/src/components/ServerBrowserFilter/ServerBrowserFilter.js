import React from 'react'
import './ServerBrowserFilter.css'
import {faFilter} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import ThreeStateCheckbox from '../../common/ThreeStateCheckbox'
import {FormattedMessage} from 'react-intl'
import {Input} from 'semantic-ui-react'
import {debounce} from '../../helper/helperfunctions'
import DayTimeFilter from './DayTimeFilter'


class ServerBrowserFilter extends React.Component {

  render() {
    return (
      <div className='server-browser-filter'>
        <FontAwesomeIcon size='lg' icon={faFilter}/>
        <span className='filter-heading'>Filter</span>
        <div className='filter-content'>
          <Input placeholder='Search by name' onChange={this.props.onSearchByNameChange}/>
          <br/>
          <br/>
          <Input placeholder='Search by IP' onChange={this.props.onIpChange}/>
          <br/>
          <br/>
          <ThreeStateCheckbox title='Full server' onClick={this.props.onChangeFullServerFilter}/>
          <br/>
          <ThreeStateCheckbox title='Battleye protected'
                              onClick={this.props.onChangeBattleyeProtectedFilter}/>
          <br/>
          <ThreeStateCheckbox title='Day' onClick={this.props.onChangeDayFilter}/>
          <br/>
          <DayTimeFilter onDayTimeChange={this.props.onDayTimeChange} />
          <br/>

        </div>
      </div>
    )
  }
}

export default ServerBrowserFilter