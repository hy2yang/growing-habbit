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
      username : null,
      info : null,
      error : null,
      warning : null,
      datasource : null,
      habits :[]
    };
    this.updateHabitDisplay('/habits');
  }

  componentDidMount() {
  }

  render() {

    const loading = require('./loading.gif');
    const accountPanel = () => {
      if (this.state.username) {
        return (<AccountDetail username={this.state.username} logoutSubmit={() => this.logoutSubmit()} />)
      }
      else return (<Login loginSubmit={this.loginSubmit.bind(this)} registerSubmit={this.registerNewAccount.bind(this)}/>);
    }

    return (
      <div className='App'>
        <div className='banners'>
          <AlertBanner message={this.state.info} type={'info'} />
          <AlertBanner message={this.state.warning} type={'warning'} />
          <AlertBanner message={this.state.error} type={'error'} />
        </div>
        <div className='hidden' id='loading'><p className='img'><img src={loading} alt="loading gif" /></p></div>

        <Navigation 
          username={this.state.username} 
          accountPanel={accountPanel()} 
          updateHabitDisplay={this.updateHabitDisplay.bind(this)} 
          createHabit = {this.createHabit.bind(this)}
          clearBanner={()=>{
            this.closeBanner('info');
            this.closeBanner('warning');
            this.closeBanner('error');
            }}
        />

        <BrowsePanel array={this.state.habits}/>

      </div>
    );

  }

  closeBanner(type){
    this.setState({ [type] : null} );
  }

  handleException(res){
    this.setState({error : res.error, warning : res.alert});
  }

  createHabit(body){
    console.log('App.jsx createHabit called with ', body);
  }

  registerNewAccount(body){
    this.showElement('#loading');
    connection.fetchJsonFrom('/users', 'post', null ,body)
      .then(res => {
        if (!res.error && !res.alert) {
          this.setState({ info :'You have created your account! You can login now' });
          this.hideElement('#loading');
        }
        else {
          this.handleException(res);
          this.hideElement('#loading');
        };
      })
      .catch(e=>{
        this.handleException({error : e});
        this.hideElement('#loading');
    });
  }

  updateHabitDisplay(path){ 
    connection.fetchJsonFrom(path, 'get', this.jwtToken ,null)
      .then(res => {
        if (!res.error && !res.alert) {
          this.setState({
            habits : res,
            datasource : path
          });          
        }
        else {
          this.handleException(res);
        };
      })
      .catch(e=>{
        this.handleException({error : e});
      });
  }

  loginSubmit(body) {
    this.showElement('#loading');
    connection.fetchJsonFrom('./login', 'post', null, body)
      .then(res => {
        if (!res.error && !res.alert) {
          this.setState({username : res.username , info :'login success'}, () => {
            this.userId = res.userId;
            this.jwtToken = res.token;
            this.hideElement('#loading');
          })
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
    this.updateHabitDisplay('/habits');
    connection.fetchJsonFrom('./logout', 'post', this.jwtToken, null)
      .then(res => {
        if (!res.error && !res.alert) {
          this.setState({username : null, datasource : '/habits', info :'logout success'}, () => {
            delete this.userId;
            delete this.jwtToken;            
            this.hideElement('#loading');      
          });
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
