import React from 'react';
import logo from './logo.svg';
import './App.css';

import ViewAnonimUser from './ViewAnonimUser';
import ViewManagerUser from './ViewManagerUser';
import ViewRegularUser from './ViewRegularUser';

import {ACCESS_TOKEN, USERNAME, ROLE, USERID} from './constants';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.notifyLogin = this.notifyLogin.bind(this);
    this.notifyLogout = this.notifyLogout.bind(this);

    let accessToken = localStorage.getItem(ACCESS_TOKEN);
    let username = localStorage.getItem(USERNAME);
    let role = localStorage.getItem(ROLE);
    let userId = localStorage.getItem(USERID);
    let user = {
      'username': username,
      'role': role,
      'id': userId
    };
    let authenticated = accessToken && accessToken.length > 0;

    this.state = {
      currentUser: user,
      accessToken: accessToken,
      isAuthenticated: authenticated
    };
  }

  notifyLogin(user, accessToken) {
    this.setState({
      currentUser: user,
      accessToken: accessToken,
      isAuthenticated: true
    });

    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(USERNAME, user.username);
    localStorage.setItem(ROLE, user.role);
    localStorage.setItem(USERID, user.id);
  }

  notifyLogout() {
    this.setState({
      currentUser: null,
      accessToken: null,
      isAuthenticated: false
    });

    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(USERNAME);
    localStorage.removeItem(ROLE);
    localStorage.removeItem(USERID);
  }

  render() {

    if (this.state.isAuthenticated && this.state.currentUser.role == 'REGULAR_USER') {

      return (
        <ViewRegularUser
          notifyLogin={this.notifyLogin}
          notifyLogout={this.notifyLogout}
          currentUser={this.state.currentUser}
          accessToken={this.state.accessToken}
          isAuthenticated={this.state.isAuthenticated} />
      );
    }

    if (this.state.isAuthenticated && this.state.currentUser.role == 'MANAGER_USER') {

      return (
        <ViewManagerUser
          notifyLogin={this.notifyLogin} 
          notifyLogout={this.notifyLogout}
          currentUser={this.state.currentUser}
          accessToken={this.state.accessToken}
          isAuthenticated={this.state.isAuthenticated} />
      );
    }

    return (
      <ViewAnonimUser
        notifyLogin={this.notifyLogin} 
        notifyLogout={this.notifyLogout}
        currentUser={this.state.currentUser}
        accessToken={this.state.accessToken}
        isAuthenticated={this.state.isAuthenticated} />
    );
  }
}

export default App;
