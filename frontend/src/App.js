import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { API_BASE_URL, ACCESS_TOKEN, API_TOKEN_USERNAME, API_TOKEN_PASSWORD } from "./constants";

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
        <LoginForm notifyLogin={this.handleUserLoggedIn} />
      </div>
    );
  }
}

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      username: '',
      password: '',
      errorMessage: ''
    };

    this.retrieveCurrentUser = this.retrieveCurrentUser.bind(this);
    this.handleUsernameEdit = this.handleUsernameEdit.bind(this);
    this.handlePasswordEdit = this.handlePasswordEdit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUsernameEdit(event) {
    this.setState({username: event.target.value});
  }

  handlePasswordEdit(event) {
    this.setState({password: event.target.value});
  }

  handleSubmit(event) {
    console.log("Login was submitted.");

    const loginUrl = API_BASE_URL + '/oauth/token';
    let formData = "grant_type=password&" + "username=" + this.state.username + "&password=" + this.state.password;

    fetch(loginUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(API_TOKEN_USERNAME + ':' + API_TOKEN_PASSWORD)
      }
    })
    .then(
      (result) => {
        console.log('Success!');
        if (result.status == 200) {
          Promise.resolve(result.json())
              .then(data => {
                console.log(data);
                console.log(data["access_token"]);
                let accessToken = data["access_token"];
                this.setState({errorMessage: ''});
                this.retrieveCurrentUser(accessToken);
              });
        } else {
          console.log('Error logging in; status=' + result.status);
          this.setState({errorMessage: 'Error logging in, status: ' + result.status});
        }
      },
      (error) => {
        console.log('Error!');
        console.log(error);
        this.setState({errorMessage: 'Error connecting to login API.'});
      }
    );

    event.preventDefault();
  }

  retrieveCurrentUser(accessToken) {
    const retrieveUserUrl = API_BASE_URL + '/api/users/current-user';
    fetch(retrieveUserUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }).then(
      (result) => {
        if (result.status == 200) {
          Promise.resolve(result.json())
              .then(data => {
                console.log(data);
                this.props.notifyLogin(data, accessToken);
              });
        } else {
          console.log('Error retrieving curent user; status=' + result.status);
          this.setState({errorMessage: 'Error retrieving current user, status: ' + result.status});
        }
      },
      (error) => { 
        console.log('Error!');
        console.log(error);
        this.setState({errorMessage: 'Error connecting to retrieve user API.'});
      }
    );
  }

  render() {

    return (
      <form onSubmit={this.handleSubmit}>
        <div style={{color: 'red'}}>
          <p>
            {this.state.errorMessage}
          </p>
        </div>
        <label>
          Username:
          <input type="text" value={this.state.username} onChange={this.handleUsernameEdit} />
        </label>
        <label>
          Password:
          <input type="text" value={this.state.password} onChange={this.handlePasswordEdit} />
        </label>
        <input type="submit" value="Login" />
      </form>
    );
  }
}

export default App;
