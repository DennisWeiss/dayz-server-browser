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
          <Input placeholder='Search by name' value={this.props.name} onChange={this.props.onSearchByNameChange}/>
          <br/>
          <br/>
          <Input placeholder='Search by IP' value={this.props.ip} onChange={this.props.onIpChange}/>
          <br/>
          <br/>
          <ThreeStateCheckbox title='Full server' checked={this.props.fullServer} onClick={this.props.onChangeFullServerFilter}/>
          <br/>
          <ThreeStateCheckbox title='Battleye protected' checked={this.props.battleyeProtected}
                              onClick={this.props.onChangeBattleyeProtectedFilter}/>
          <br/>
          <ThreeStateCheckbox title='Day' checked={this.props.day} onClick={this.props.onChangeDayFilter}/>
          <br/>
          <DayTimeFilter includeTime={this.props.dayTime[0]}
                         timeRange={this.props.dayTime[1]}
                         onDayTimeChange={this.props.onDayTimeChange} />
          <br/>

        </div>
      </div>
    )
  }
}

export default ServerBrowserFilter