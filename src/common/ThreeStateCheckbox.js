import React from 'react'
import {faCheck, faTimes} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import './ThreeStateCheckbox.css'


class ThreeStateCheckbox extends React.Component {
  state = {
    checked: this.props.defaultChecked || 'neutral'
  }

  onClick() {
    let newState
    switch (this.state.checked) {
      case 'negative':
        newState = 'neutral'
        break
      case 'neutral':
        newState = 'positive'
        break
      case 'positive':
        newState = 'negative'
        break
    }
    this.setState({checked: newState}, () => {
      if (this.props.onClick) {
        this.props.onClick(this.state.checked)
      }
    })
  }


  render() {
    return (
      <div>
        <div className='three-state-checkbox' onClick={this.onClick.bind(this)}>
          {(this.props.checked ? this.props.checked === 'positive' : this.state.checked === 'positive') &&
          <div className='three-state-checkbox-icon-pos'><FontAwesomeIcon icon={faCheck}/></div>}
          {(this.props.checked ? this.props.checked === 'negative' : this.state.checked === 'negative') &&
          <div className='three-state-checkbox-icon-neg'><FontAwesomeIcon icon={faTimes}/></div>}
        </div>
        <div className='three-state-checkbox-title'>
          {this.props.title}
        </div>
      </div>
    )
  }

}

export default ThreeStateCheckbox