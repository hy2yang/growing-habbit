import React, { Component } from 'react';
import './App.css';
import Alert from './Alert';
import Login from './Login';
import AccountDetail from './AccountDetail';
import Navigation from './Navigation';
const connection = require('./connection');


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
  }

  componentDidMount() {
  }

  render() {

    const loading = require('./loading.gif');
    const accountPanel = () => {
      if (this.state.user) {
        return (<AccountDetail user={this.state.user} logoutSubmit={() => this.logoutSubmit()} />)
      }
      else return (<Login loginSubmit={(body) => this.loginSubmit(body)} />);
    }

    return (
      <div className='App'>
        <div className='hidden' id='loading'><p className='img'><img src={loading} alt="loading gif" /></p></div>
        <div className='header'>
          <Navigation user={this.state.user} accountPanel={accountPanel()}/>          
        </div>
        <Alert message='custom alert message' onClick={() => this.hideElement('.alert')} />

      </div>
    );

  }

  loginSubmit(body) {
    connection.fetchJsonFrom('./login', 'post', null, body)
      .then(res => {
        if (!res.error && !res.alert) {
          this.setState({ user: res }//, () => console.log(this.state))
          )}
      });
  }

  logoutSubmit() {
    //console.log('click on logout');
    connection.fetchJsonFrom('./logout', 'post', this.state.user.token, null)
      .then(res => {
        if (!res.error && !res.alert) {
          this.setState({ user: null });
        }
      });
  }

  setStudyList(list) {
    this.setState({ '.study-page': list }, () => {
      this.studyList();
    });
  }

  studyList() {
    const views = ['.favorite-page', '.my-cards-page', '.shared-cards-page'];
    for (let i of views) {
      this.hideElement(i);
    }
    this.showElement('.study-page');
  }

  goToView(queryString) {

    this.hideElement('.homepage');
    this.showElement('#loading');

    const views = {
      '.study-page': '/prestored'
      , '.favorite-page': '/users/' + this.state.currentId + '/fav'
      , '.my-cards-page': '/users/' + this.state.currentId + '/custom'
      , '.shared-cards-page': '/users/' + this.state.selectedId + '/custom'
    };

    for (let i in views) {
      this.hideElement(i);
    }

    connection.fetchJsonFrom(views[queryString], 'get', this.state.currentId)
      .then(json => {
        this.setState({ [queryString]: json }, () => {
          this.hideElement('#loading');
          this.showElement(queryString);
        });

      })
      .catch((error) => {
        if (error.toString().startsWith('error-')) {
          return Promise.reject(error);
        }
        return Promise.reject('error-response-json-bad');
      });

  }

  async initializeOption() {
    const drop = document.getElementById('homepage-dropbtn');
    drop.options.length = 0;
    const placeholder = document.createElement('option');
    placeholder.text = 'SHARED';
    placeholder.value = 'placeholder';
    placeholder.selected = 'selected';
    placeholder.disabled = 'disabled';
    drop.add(placeholder);

    let list = await connection.getUserList();
    for (let id of list.activeUsers) {
      if (id === this.state.currentId) continue;
      let option = document.createElement('option');
      option.text = +id;
      drop.add(option);
    }
  }

  addSelectListener() {
    const select = document.getElementById('homepage-dropbtn');
    select.addEventListener('change', () => {
      this.setState({ selectedId: select.value },
        () => {
          this.goToView('.shared-cards-page');
          select.value = 'placeholder';
        }
      )
    });
  }

  hideElement(queryString) {
    document.querySelector(queryString).classList.add('hidden');
  }

  showElement(queryString) {
    document.querySelector(queryString).classList.remove('hidden');
  }

  backToHome(curView) {
    this.hideElement(curView);
    this.showElement('.homepage');
    this.setState({ selectedWordId: null })
  }

}

export default App;
