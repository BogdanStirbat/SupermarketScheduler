import React from 'react';
import { API_BASE_URL, API_TOKEN_USERNAME, API_TOKEN_PASSWORD } from "./constants";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      username: '',
      password: '',
      errorMessage: ''
    };

    this.notifyLogin = this.notifyLogin.bind(this);
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

    const loginUrl = API_BASE_URL + '/oauth/token';
    let formData = "grant_type=password&" + "username=" + this.state.username + "&password=" + encodeURIComponent(this.state.password);

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
        if (result.status == 200) {
          Promise.resolve(result.json())
              .then(data => {
                let accessToken = data["access_token"];
                this.setState({errorMessage: ''});
                this.retrieveCurrentUser(accessToken);
              });
        } else {
          this.setState({errorMessage: 'Error logging in, status: ' + result.status});
        }
      },
      (error) => {
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
                this.notifyLogin(data, accessToken);
              });
        } else {
          this.setState({errorMessage: 'Error retrieving current user, status: ' + result.status});
        }
      },
      (error) => { 
        this.setState({errorMessage: 'Error connecting to retrieve user API.'});
      }
    );
  }

  notifyLogin(user, accessToken) {
    this.props.notifyLogin(user, accessToken);
  }

  render() {

    return (
      <div className="form-container">
        <div className="form-content">
        <h1>Login </h1>
        <form onSubmit={this.handleSubmit}>
          <div className="form-error">
            <p>
              {this.state.errorMessage}
            </p>
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
          <input type="submit" value="Login" />
        </form>
      </div>
      </div>
    );
  }
}

export default Login;