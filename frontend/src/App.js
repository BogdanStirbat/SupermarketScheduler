import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { API_BASE_URL, ACCESS_TOKEN, API_TOKEN_USERNAME, API_TOKEN_PASSWORD } from "./constants";
import Login from './Login';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.handleUserLoggedIn = this.handleUserLoggedIn.bind(this);

    this.state = {
      currentUser: null,
      accessToken: null,
      isAuthenticated: false
    };
  }

  handleUserLoggedIn(user, accessToken) {
    this.setState({
      currentUser: user,
      accessToken: accessToken,
      isAuthenticated: true
    });
  }

  render() {

    if (this.state.isAuthenticated) {

      return (
        <div>
          <h1>You are logged in</h1>
          <h1>Username: {this.state.currentUser.username}</h1>
          <h1>Role: {this.state.currentUser.role}</h1>
        </div>
      );
    }

    return (
      <div>
        <Login notifyLogin={this.handleUserLoggedIn} />
      </div>
    );
  }
}

export default App;
