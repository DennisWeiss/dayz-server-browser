import React from 'react'
import {Slider} from 'antd'
import ThreeStateCheckbox from '../../common/ThreeStateCheckbox'
import {FormattedMessage} from 'react-intl'
import {ensureDigits} from '../../helper/helperfunctions'


const minuteToDayTimeFormat = minute => `${Math.floor(minute / 60)}:${ensureDigits(minute % 60, 2)}`

const getDayTimeMarks = interval => {
  const marks = {}
  for (let i = 0; i < 24 * 60; i += interval) {
    marks[i] = minuteToDayTimeFormat(i)
}
  return marks
}

class DayTimeFilter extends React.Component {

  state = {
    includeTime: this.props.defaultIncludeTime,
    timeRange: [600, 840]
  }

  onTimeRangeChange(timeRange) {
    this.setState({timeRange})
  }

  render() {
    return (
      <div className='day-time-slider'>
        <ThreeStateCheckbox title={<FormattedMessage id='INCLUDE_TIME'/>}/>
        <Slider range
                min={0}
                max={24 * 60 - 1}
                marks={getDayTimeMarks(240)}
                tipFormatter={minuteToDayTimeFormat}
                value={this.state.timeRange}
                onChange={this.onTimeRangeChange.bind(this)}/>
      </div>
    )
  }
}

export default DayTimeFilter