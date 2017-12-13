import React, { Component } from 'react';

import github from '../../api/github';
import firebase from '../../api/firebase';

import Card from '../../components/card';
import Tabs from '../../components/tabs';
import Tab from '../../components/tabs/tab';

class Home extends Component {
  state = { initialSelect: 0, ruby_repositories: [], javascript_repositories: [] };

  loadRepositories = () => {
    let url_rb = 'https://api.github.com/search/repositories?q=language:ruby&page=1&per_page=100';
    let url_js = 'https://api.github.com/search/repositories?q=language:javascript&page=1&per_page=100';

    if('caches' in window) {
      caches.open('github-cache').then(cache => {
        caches.match(url_rb)
          .then(response => {
            return response.json();
          })
          .then(data => {
            this.setState({ ruby_repositories: data.items })
          })
          .catch(error => {
            github.get(`search/repositories?q=language:ruby&page=1&per_page=100`)
              .then(res => {
                cache.add(url_rb);
                this.setState({ ruby_repositories: res.data.items })
              });
          });

        caches.match(url_js)
          .then(response => {
            return response.json();
          })
          .then(data => {
            this.setState({ javascript_repositories: data.items })
          })
          .catch(error => {
            github.get(`search/repositories?q=language:javascript&page=1&per_page=100`)
              .then(res => {
                cache.add(url_js);
                this.setState({ javascript_repositories: res.data.items })
              });
          });
      });
    } else {
      console.log('Cache Not Suported!');
    }
  };

  addToFavorites = (repo, event) => {
    event.preventDefault();

    firebase.post('favorites.json', repo)
      .then(response => {
        if('caches' in window) {
          caches.delete('firebase-cache');
          alert('Repositório adicionado aos favoritos.');
        }
      });
  };

  componentWillMount() {
    this.loadRepositories();
  }

  render() {
    return (
      <section className="section">
        <div className="container content">
          <h1>Listagem</h1>
        </div>

        <Tabs selected={ this.state.initialSelect }>
          <Tab key={ 0 } label="Ruby">
            { this.state.ruby_repositories.map(repo =>
                <Card
                  key={ repo.id }
                  repo={ repo }
                  handlerFavorites={ this.addToFavorites.bind(this) }
                  buttonLabel="Favoritar" />
              )
            }
          </Tab>

          <Tab key={ 1 } label="Javascript">
            {
              this.state.javascript_repositories.map(repo =>
                <Card
                  key={ repo.id }
                  repo={ repo }
                  handlerFavorites={ this.addToFavorites.bind(this) }
                  buttonLabel="Favoritar" />
              )
            }
          </Tab>
        </Tabs>
      </section>
    );
  }
}

export default Home;
