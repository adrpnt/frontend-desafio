import React, { Component } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import Simplert from 'react-simplert'
import update from 'immutability-helper'

// api services
import github from '../../api/github'
import firebase from '../../api/firebase'

// components
import Card from '../../components/card'
import Tabs from '../../components/tabs'
import Tab from '../../components/tabs/tab'

class Home extends Component {
  state = {
    tabs: [
      { id: 0, label: 'Ruby', language: 'ruby', repository: 'ruby_repositories', pageStart: 0 },
      { id: 1, label: 'Javascript', language: 'javascript', repository: 'javascript_repositories', pageStart: 0 }
    ],
    ruby_repositories: [],
    javascript_repositories: [],
    favorite_ids: [],
    showAlert: false
  }

  // update the state:
  // increments the pageStart of the correct tab in state
  // push new repositories in state
  _updateState = (repository, data, tabIndex) => {
    let newDataRepository = update(this.state[repository], {$push: data})

    let tabs = [...this.state.tabs]
    tabs[tabIndex].pageStart += 1

    this.setState({ [repository]: newDataRepository, tabs })
  }

  // load the repositories (GITHUB API) and caches the results
  // called by InfiniteScroll and uses GITHUB API pagination
  loadRepositories = (tabIndex, language, repository, page) => {
    let url = `https://api.github.com/search/repositories?q=language:${language}&page=${page}&per_page=5`

    if('caches' in window) {
      caches.open('github-cache').then(cache => {
        caches.match(url)
          .then(response => {
            return response.json()
          })
          .then(data => {
            this._updateState(repository, data.items, tabIndex)
          })
          .catch(error => {
            github.get(`search/repositories?q=language:${language}&page=${page}&per_page=5`)
              .then(res => {
                cache.add(url)

                this._updateState(repository, res.data.items, tabIndex)
              });
          });
      });
    } else {
      console.log('Cache Not Suported!')
    }
  }

  // send repository data to store in Firebase
  addToFavorites = (repo, event) => {
    event.preventDefault()

    firebase.post('favorites.json', repo)
      .then(response => {
        if('caches' in window) {
          caches.delete('firebase-cache')
        }

        let favorites = [...this.state.favorite_ids]
        favorites.push(repo.id)

        localStorage.setItem('favorites', JSON.stringify(favorites))
        this.setState({ favorite_ids: favorites })

        this.setState({ showAlert: true })
      })
  }

  removeAlert = () => {
    this.setState({ showAlert: false })
  }

  componentWillMount() {
    const favorites = localStorage.getItem('favorites')

    if (favorites) {
      this.setState({ favorite_ids: JSON.parse(favorites) })
      return
    }
  }

  render() {
    return (
      <section className="section">
        <div className="container content">
          <h1>Listagem</h1>
        </div>

        <Simplert
          showSimplert={ this.state.showAlert }
          type="success"
          title="Favoritado"
          message="Repositório adicionado aos favoritos."
          customCloseBtnText="Fechar"
          onClose={ this.removeAlert.bind(this) }
        />

        <Tabs selected={ 0 }>
          {
            this.state.tabs.map((tab, index) => (
              <Tab key={tab.id} label={tab.label}>
                <InfiniteScroll
                    pageStart={tab.pageStart}
                    loadMore={this.loadRepositories.bind(this, index, tab.language, tab.repository)}
                    hasMore={true || false}
                    threshold={150}
                    loader={<div className="is-loading has-text-centered">Loading ...</div>}
                >
                  {
                    this.state[tab.repository].map(repo => {
                      if (this.state.favorite_ids) {
                        let is_favorited = this.state.favorite_ids.find(favorite => favorite === repo.id);

                        if (is_favorited) {
                          return (
                            <Card
                              key={ repo.id }
                              repo={ repo } />
                          )
                        }
                      }

                      return (
                          <Card
                            key={ repo.id }
                            repo={ repo }
                            handlerFavorites={ this.addToFavorites.bind(this) }
                            buttonLabel="Favoritar" />
                      )
                    })
                  }
                </InfiniteScroll>
              </Tab>
            ))
          }
        </Tabs>
      </section>
    )
  }
}

export default Home
