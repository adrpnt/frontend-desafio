import React, { Component } from 'react'
import Toolbar from './toolbar'

import 'bulma/css/bulma.css'

import Routes from '../routes'

class App extends Component {
  render() {
    return (
      <div className='app'>
        <Toolbar />
        <Routes />
      </div>
    )
  }
}

export default App
