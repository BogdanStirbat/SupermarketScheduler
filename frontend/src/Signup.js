import React from 'react';
import { API_BASE_URL, ACCESS_TOKEN, API_TOKEN_USERNAME, API_TOKEN_PASSWORD } from "./constants";

class Signup extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      errorMessage: ''
    };

    this.handleUsernameEdit = this.handleUsernameEdit.bind(this);
    this.handlePasswordEdit = this.handlePasswordEdit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.logIn = this.logIn.bind(this);
  }

  handleUsernameEdit(event) {
    this.setState({username: event.target.value});
  }

  handlePasswordEdit(event) {
    this.setState({password: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();

    const loginUrl = API_BASE_URL + '/api/signup';

    let data = {
      "userName": this.state.username,
      "password": this.state.password
    };

    fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(
      (result) => {
        if (result.status == 200) {
          this.setState({errorMessage: ''});
          this.logIn(this.state.username, this.state.password);
        } else {
          this.setState({errorMessage: 'Retrieved error response from API, status: ' + result.status});
        }
      },
      (error) => {
        this.setState({errorMessage: 'Error connecting to API.'});
      }
    );
  }

  logIn(username, password) {

    const loginUrl = API_BASE_URL + '/oauth/token';
    let formData = "grant_type=password&" + "username=" + username + "&password=" + password;

    fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(API_TOKEN_USERNAME + ':' + API_TOKEN_PASSWORD)
      },
      body: formData
    })
    .then(
      (result) => {
        if (result.status == 200) {
          Promise.resolve(result.json())
              .then(data => {
                this.setState({errorMessage: ''});
                let accessToken = data["access_token"];
                let user = {
                  "username": username,
                  "role": "REGULAR_USER"
                };
                this.props.notifyLogin(user, accessToken);
              });

        } else {
          this.setState({errorMessage: 'Error connecting to Login API. Please go to login page to login.'});
        }
      },
      (error) => {
        this.setState({errorMessage: 'Error connecting to Login API. Please go to login page to login.'});
      }
    );
  }

  render() {

    return (
      <div className="form-container">
        <div className="form-content">
          <h1>Signup</h1>
          <form onSubmit={this.handleSubmit}>
            <div className="form-error">
              <p>{this.state.errorMessage}</p>
            </div>
            <div className="form-element">
              <label>
                Username
              </label>
              <div>
                <input type="text" value={this.state.username} onChange={this.handleUsernameEdit} />
              </div>
            </div>
            <div className="input-element">
              <label>
                Password
              </label>
              <div>
                <input type="text" value={this.state.password} onChange={this.handlePasswordEdit} />
              </div>
            </div>
            <input type="submit" value="Signup" />
          </form>
        </div>
      </div>
    );
  }
}

export default Signup;