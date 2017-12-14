import React, { Component } from 'react'

class Toolbar extends Component {
  render() {
    return (
      <nav className="navbar is-dark is-fixed-top" aria-label="main navigation">
        <div className="navbar-brand">
          <p className="navbar-item">DESAFIO FRONTEND</p>

          <div className="navbar-burger burger" data-target="navMenu">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div id="navMenu" className="navbar-menu">
          <div className="navbar-end">
            <a className="navbar-item" href="/">Home</a>
            <a className="navbar-item" href="/favorites">Favoritos</a>
          </div>
        </div>
      </nav>
    )
  }
}

export default Toolbar
