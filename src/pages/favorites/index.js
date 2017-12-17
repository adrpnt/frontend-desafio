import React, { Component } from 'react'

// api services
import firebase from '../../api/firebase'

// components
import Card from '../../components/card'

class Favorites extends Component {
  state = { favorite_repositories: {} }

  // load the repositories (FIREBASE) and caches the results
  loadFavoriteRepositories = () => {
    if('caches' in window) {
      caches.open('firebase-cache').then(cache => {
        let url_fb = 'https://desafio-frontend-67428.firebaseio.com/favorites.json'

        caches.match(url_fb)
          .then(response => {
            return response.json()
          })
          .then(data => {
            this.setState({ favorite_repositories: data })
          })
          .catch(error => {
            firebase.get(`favorites.json`)
              .then(res => {
                cache.add(url_fb)
                this.setState({ favorite_repositories: res.data })
              })
          })
      })
    }
  }

  componentWillMount() {
    this.loadFavoriteRepositories()
  }

  render() {
    return (
      <section className="section">
        <div className="container content">
          <h1>Favoritos</h1>
        </div>

        {
          (this.state.favorite_repositories) ?
            Object.keys(this.state.favorite_repositories).map((key, index) => {
              const repo = { ...this.state.favorite_repositories[key] }

              return <Card key={ repo.id } repo={ repo } />
            }) :
            <p>Nenhum repositório favoritado.</p>
        }
      </section>
    )
  }
}

export default Favorites
