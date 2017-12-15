import React from 'react'

const Card = (props) => {
  return (
    <div className="card">
      <div className="card-content">
        <p className="title">{ props.repo.name }</p>
        <p className="subtitle">{ props.repo.owner.login }</p>
        <p className="description">{ props.repo.description }</p>
      </div>
      <footer className="card-footer">
        <p className="card-footer-item">
          <span>Ver no <a href={ props.repo.html_url }>Github</a></span>
        </p>
        {
          (props.handlerFavorites) ?
            <p className="card-footer-item">
              <span><a onClick={ props.handlerFavorites.bind(this, props.repo) }>{ props.buttonLabel }</a></span>
            </p> :
            <p className="card-footer-item">
              <span>{ props.buttonLabel }</span>
            </p>
        }
      </footer>
    </div>
  )
}

Card.defaultProps = {
  buttonLabel: "-",
  handlerFavorites: null
}

export default Card
