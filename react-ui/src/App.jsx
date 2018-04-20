import React, { Component } from 'react';
import './App.css';
import AlertBanner from './AlertBanner';
import Login from './Login';
import AccountDetail from './AccountDetail';
import Navigation from './Navigation';
import BrowsePanel from './BrowsePanel';

import connection from './connection';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: null,
      info: null,
      error: null,
      warning: null,
      habits: []
    };
    this.userId = null;
    this.jwtToken = null;
    this.updateHabitList('/habits', 0);
  }

  render() {

    const loading = require('./loading.gif');
    const accountPanel = () => {
      if (this.state.username) {
        return (<AccountDetail username={this.state.username} logoutSubmit={() => this.logoutSubmit()} />)
      }
      else return (<Login loginSubmit={this.loginSubmit.bind(this)} registerSubmit={this.registerNewAccount.bind(this)} />);
    }

    return (
      <div className='App'>

        <div className='hidden' id='loading'><p className='img'><img src={loading} alt="loading gif" /></p></div>

        <Navigation
          username={this.state.username}
          accountPanel={accountPanel()}
          updateHabitDisplay={this.updateHabitList.bind(this)}
          createHabit={this.createHabit.bind(this)}
          clearBanner={this.closeBanner.bind(this)}
        />

        <div className='banners'>
          <AlertBanner message={this.state.info} type={'info'} />
          <AlertBanner message={this.state.warning} type={'warning'} />
          <AlertBanner message={this.state.error} type={'error'} />
        </div>

        <BrowsePanel array={this.state.habits} viewerId={this.userId} />

      </div>
    );

  }

  handleException(res) {
    this.setState({ error: res.error, warning: res.alert });
  }

  closeBanner() {
    this.setState({
      info: null,
      error: null,
      warning: null
    });
  }

  updateHabitList(path, pageNum) {
    const pageSize = 8;
    const pageNumber = pageNum ? +pageNum : 0;
    connection.fetchJsonFrom(`${path}?pageNum=${pageNumber}&pageSize=${pageSize}`, 'get', this.jwtToken, null)
      .then(res => {
        if (!res.error && !res.alert) {
          this.setState({ habits: res });
        }
        else {
          this.setState({ habits: [] });
          this.handleException(res);
        };
      })
      .catch(e => {
        this.handleException({ error: e });
      });
  }

  handleFetch(promise, handleRes) {
    promise.then(res => {
      if (!res.error && !res.alert) {
        handleRes(res);
      }
      else {
        this.handleException(res);
        this.hideElement('#loading');
      }
    })
      .catch(e => {
        this.handleException({ error: e });
        this.hideElement('#loading');
      });
  }

  loginSubmit(body) {
    this.showElement('#loading');
    const handleRes = (res) => {
      this.setState({ username: res.username, info: 'login success' }, () => {
        this.userId = res.userId;
        this.jwtToken = res.token;
        this.hideElement('#loading');
      })
    };
    this.handleFetch(connection.fetchJsonFrom('./login', 'post', null, body), handleRes);
  }

  logoutSubmit() {
    this.showElement('#loading');
    this.updateHabitList('/habits', 0);
    const handleRes = (res) => {
      this.setState({ username: null, info: 'logout success' }, () => {
        this.userId = null;
        this.jwtToken = null;
        this.hideElement('#loading');
      });
    };
    this.handleFetch(connection.fetchJsonFrom('./logout', 'post', this.jwtToken, null), handleRes);
  }

  createHabit(body) {
    this.showElement('#loading');
    const path = `/users/${this.state.username}/habits`;
    const handleRes = (res) => {
      this.updateHabitList(path, 0);
      this.setState({ info: 'You have created a new habit!' }, () => this.hideElement('#loading'));
    };
    this.handleFetch(connection.fetchJsonFrom(path, 'post', this.jwtToken, body), handleRes);
  }

  registerNewAccount(body) {
    this.showElement('#loading');
    const handleRes = (res) => {
      this.setState({ info: 'You have created your account! You can login now' }, () => this.hideElement('#loading'));
    };
    this.handleFetch(connection.fetchJsonFrom('/users', 'post', null, body), handleRes);    
  }


  hideElement(queryString) {
    document.querySelector(queryString).classList.add('hidden');
  }

  showElement(queryString) {
    document.querySelector(queryString).classList.remove('hidden');
  }

}

export default App;
