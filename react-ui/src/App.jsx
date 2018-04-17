import React, { Component } from 'react';
import './App.css';
import AlertBanners from './AlertBanners';
import Login from './Login';
import AccountDetail from './AccountDetail';
import Navigation from './Navigation';

const connection = require('./connection');

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      error : null,
      alert : null
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
        {AlertBanners(this.state.alert, this.state.error, this.onCloseAlert.bind(this), this.onCloseError.bind(this))}        
        <div className='hidden' id='loading'><p className='img'><img src={loading} alt="loading gif" /></p></div>
        <div className='header'>
          <Navigation user={this.state.user} accountPanel={accountPanel()} />
        </div>

      </div>
    );

  }

  onCloseError(){
    this.setState({error : null} , ()=>this.hideElement('.errorBanner'));
  }

  onCloseAlert(){
    this.setState({alert : null} , ()=>this.hideElement('.alertBanner'));
  }

  handleException(res){
    this.setState({error : res.error, alert : res.alert});
  }

  loginSubmit(body) {
    this.showElement('#loading');
    connection.fetchJsonFrom('./login', 'post', null, body)
      .then(res => {
        if (!res.error && !res.alert) {
          this.setState({ user: res }, () => this.hideElement('#loading'))
        }
        else {
          this.handleException(res);
          this.hideElement('#loading')
        };
      })
      .catch(e=>{
        this.handleException({error : e});
        this.hideElement('#loading')
      });
  }

  logoutSubmit() {
    this.showElement('#loading');
    connection.fetchJsonFrom('./logout', 'post', this.state.user.token, null)
      .then(res => {
        if (!res.error && !res.alert) {
          this.setState({ user: null }, () => this.hideElement('#loading'));
        }
        else {
          this.handleException(res);
          this.hideElement('#loading')
        };
      })
      .catch(e=>{
        this.handleException({error : e});
        this.hideElement('#loading')
      });
  }

  hideElement(queryString) {
    document.querySelector(queryString).classList.add('hidden');
  }

  showElement(queryString) {
    document.querySelector(queryString).classList.remove('hidden');
  }

}

export default App;
