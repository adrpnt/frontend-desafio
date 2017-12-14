import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'

import Home from '../pages/home'
import Favorites from '../pages/favorites'

export default props => (
  <Switch>
    <Route exact path='/' component={ Home } />
    <Route path='/favorites' component={ Favorites } />

    <Redirect from='*' to='/' />
  </Switch>
)
