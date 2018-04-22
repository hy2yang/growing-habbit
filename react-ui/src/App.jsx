import React, { Component } from 'react';
import './App.css';
import Login from './Login';
import AccountDetail from './AccountDetail';
import Navigation from './Navigation';
import BrowsePanel from './BrowsePanel';
import Introduction from './Introduction';
import { Pagination, notification, Button, Popover } from 'antd';
import 'antd/lib/pagination/style/css';
import 'antd/lib/notification/style/css';
import 'antd/lib/button/style/css';
import 'antd/lib/popover/style/css';

import connection from './connection';

const DEFAULT_PAGE_SIZE = 8;

notification.config({
  placement: 'topRight',
  top: 41,
  duration: 1.5,
});

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: null,
      userId: null,
      habits: [],
      habitsURL: null,
      totalHabits: 0,
      currentPage: 1
    };
    this.jwtToken = null;
  }

  componentDidMount() {
    this.updateHabitList('/habits', 0);
  }

  render() {

    const loading = require('./loading.gif');
    const accountPanel = () => {
      if (this.state.username) {
        return (<AccountDetail username={this.state.username} logoutSubmit={this.logoutSubmit.bind(this)} />)
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
        />

        <BrowsePanel array={this.state.habits} viewerId={this.state.userId} getCardUpdaters={this.getCardUpdaters.bind(this)} />

        <div className='footer'>

          <div className='help'>
            <Popover content={<Introduction/>} 
              placement='topLeft' title='Growing Habit' trigger='focus'
              overlayClassName='intropop'
              >
              <Button type='primary'>Introduction/Help</Button>
            </Popover>
          </div>

          <div className='pagination'>
            <Pagination
              current={this.state.currentPage}
              pageSize={DEFAULT_PAGE_SIZE}
              total={this.state.totalHabits}
              showTotal={(total, range) => `${Math.max(range[0],0)}-${range[1]} of ${total} habits`}
              onChange={(pageNum) => {
                this.setState({ currentPage: pageNum }, this.updateHabitList(this.state.habitsURL, pageNum - 1));
              }}
            />
          </div>
          
        </div>

      </div>
    );

  }

  handleException(res) {
    if (res.error) {
      notification['error']({ message: res.error });
    }
    if (res.alert) {
      notification['warning']({ message: res.alert });
    }
  }

  updateHabitList(path, pageNum) {
    this.showLoading();
    const pageSize = DEFAULT_PAGE_SIZE;
    const pageNumber = pageNum ? +pageNum : 0;
    connection.fetchJsonFrom(`${path}?pageNum=${pageNumber}&pageSize=${pageSize}`, 'get', this.jwtToken, null)
      .then(res => {
        if (!res.error && !res.alert) {
          this.setState({ habits: res.habits, totalHabits: res.total, habitsURL: path, currentPage: pageNumber + 1 }, this.hideLoading());
        }
        else {
          this.setState({ habits: [], totalHabits: 0, habitsURL: '/habits', currentPage: 0 }, this.hideLoading());
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
        this.hideLoading();
      }
    })
      .catch(e => {
        this.handleException({ error: e });
        this.hideLoading();
      });
  }

  loginSubmit(body) {
    this.showLoading();
    const handleRes = (res) => {
      this.setState({ username: res.username, currentPage: 1, userId: res.userId }, () => {
        notification['success']({ message: 'login success' });
        this.jwtToken = res.token;
        this.updateHabitList(this.state.habitsURL, 0);
        this.hideLoading();
      })
    };
    this.handleFetch(connection.fetchJsonFrom('./login', 'post', null, body), handleRes);
  }

  logoutSubmit() {
    this.showLoading();    
    const handleRes = (res) => {
      this.setState({ username: null, currentPage: 1, userId: null }, () => {
        notification['success']({ message: 'logout success' });
        this.jwtToken = null;
        this.updateHabitList('/habits', 0);
        this.hideLoading();
      });
    };
    this.handleFetch(connection.fetchJsonFrom('./logout', 'post', this.jwtToken, null), handleRes);
  }

  createHabit(body) {
    this.showLoading();
    const path = `/users/${this.state.username}/habits`;
    const handleRes = (res) => {
      this.updateHabitList(path, 0);
      this.hideLoading();
      notification['success']({ message: 'You have created a new habit!' });      
    };
    this.handleFetch(connection.fetchJsonFrom(path, 'post', this.jwtToken, body), handleRes);
  }

  registerNewAccount(body) {
    this.showLoading();
    const handleRes = (res) => {
      notification['success']({ message: 'Account created! You can log in now' });
      this.hideLoading();
    };
    this.handleFetch(connection.fetchJsonFrom('/users', 'post', null, body), handleRes);
  }


  getCardUpdaters(habitId) {
    const cheer = (handleRes) => {
      connection.fetchJsonFrom(`/habits/${habitId}/cheers`, 'post', this.jwtToken, null)
        .then(res => {
          if (!res.error && !res.alert) {
            handleRes(res);
          }
        }).catch(e => console.log(e));
    }

    const checkin = (handleRes) => {
      connection.fetchJsonFrom(`/habits/${habitId}/checkin`, 'post', this.jwtToken, null)
        .then(res => {
          if (!res.error && !res.alert) {
            handleRes(res);
          }
        }).catch(e => console.log(e));
    }

    const finish = (finished, handleRes) => {
      connection.fetchJsonFrom(`/habits/${habitId}/finished`, 'put', this.jwtToken, { finished: finished })
        .then(res => {
          if (!res.error && !res.alert) {
            handleRes(res);
          }
        }).catch(e => console.log(e));
    }

    const deleteHabit = () => {
      connection.fetchJsonFrom(`/habits/${habitId}`, 'delete', this.jwtToken, null)
        .then(res => {
          if (res.habitDeleted) {
            this.updateHabitList(this.state.habitsURL, this.state.currentPage - 1);
          }
        }).catch(e => console.log(e));
    }

    return ({
      cheer: cheer.bind(this),
      checkin: checkin.bind(this),
      finish: finish.bind(this),
      deleteHabit: deleteHabit.bind(this)
    });

  }

  hideLoading() {
    document.querySelector('#loading').classList.add('hidden');
  }

  showLoading() {
    document.querySelector('#loading').classList.remove('hidden');
  }

}

export default App;
