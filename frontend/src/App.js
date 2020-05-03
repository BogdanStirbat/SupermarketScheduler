import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { API_BASE_URL, ACCESS_TOKEN, API_TOKEN_USERNAME, API_TOKEN_PASSWORD } from "./constants";
import Login from './Login';
import UserNavigation from './UserNavigation';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.notifyLogin = this.notifyLogin.bind(this);

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

  render() {

    return (
      <div>
        <div>
          <UserNavigation 
            notifyLogin={this.notifyLogin} 
            currentUser={this.state.currentUser}
            accessToken={this.state.accessToken}
            isAuthenticated={this.state.isAuthenticated} />
        </div>
        <div>
          <p>Supermarkets</p>
        </div>
      </div>
    );
  }
}

export default App;
