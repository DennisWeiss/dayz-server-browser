import React, {Component} from 'react'
import './App.css'
import ServerBrowserPage from './components/ServerBrowserPage/ServerBrowserPage'
import translations from './conf/translations'
import {IntlProvider} from 'react-intl'


class App extends Component {

  state = {
    locale: 'en'
  }

  render() {
    return (
      <IntlProvider locale={this.state.locale} messages={translations[this.state.locale]}>
        <div className="App">
          <ServerBrowserPage/>
        </div>
      </IntlProvider>
    )
  }
}

export default App
