import React from 'react'
import './ServerBrowserFilter.css'
import {faFilter} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'


class ServerBrowserFilter extends React.Component {
  render() {
    return (
      <div className='server-browser-filter'>
          <FontAwesomeIcon size='lg' icon={faFilter}/>

        <span className='filter-heading'>Filter</span>
      </div>
    )
  }
}

export default ServerBrowserFilter