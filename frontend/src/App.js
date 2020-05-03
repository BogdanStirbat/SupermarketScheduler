import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { API_BASE_URL, ACCESS_TOKEN, API_TOKEN_USERNAME, API_TOKEN_PASSWORD } from "./constants";

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false
    };
  }

  render() {

    if (this.state.isAuthenticated) {

      return (
        <h1>You are logged in</h1>
      );
    }

    return (
      <div>
        <LoginForm />
      </div>
    );
  }
}


class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      username: '',
      password: ''
    };

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
              });
        } else {
          console.log('Error logging in; status=' + result.status);
        }
      },
      (error) => {
        console.log('Error!');
        console.log(error);
      }
    );

    event.preventDefault();
  }

  render() {

    return (
      <form onSubmit={this.handleSubmit}>
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
