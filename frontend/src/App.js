import React from 'react';
import logo from './logo.svg';
import './App.css';

import ViewAnonimUser from './ViewAnonimUser';
import ViewManagerUser from './ViewManagerUser';
import ViewRegularUser from './ViewRegularUser';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.notifyLogin = this.notifyLogin.bind(this);
    this.notifyLogout = this.notifyLogout.bind(this);

    this.state = {
      currentUser: null,
      accessToken: null,
      isAuthenticated: false
    };
  }

  notifyLogin(user, accessToken) {
    this.setState({
      currentUser: user,
      accessToken: accessToken,
      isAuthenticated: true
    });
  }

  notifyLogout() {
    this.setState({
      currentUser: null,
      accessToken: null,
      isAuthenticated: false
    });
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
