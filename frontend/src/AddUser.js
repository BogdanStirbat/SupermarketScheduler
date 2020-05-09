import React from 'react';
import { API_BASE_URL } from "./constants";

class AddUser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: '',
      successMessage: '',
      username: '',
      password: '',
      role: 'MANAGER_USER'
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUsernameEdit = this.handleUsernameEdit.bind(this);
    this.handlePasswordEdit = this.handlePasswordEdit.bind(this);
    this.handleRoleChange = this.handleRoleChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

    const addUserUrl = API_BASE_URL + '/api/users';
    let data = {
      "username": this.state.username,
      "password": this.state.password,
      "role": this.state.role
    };

    fetch(addUserUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.accessToken
      },
      body: JSON.stringify(data)
    })
    .then(
      (result) => {
        if (result.status == 200) {
          this.setState({errorMessage: ''});
          this.setState({successMessage: 'User added successfully.'});
        } else {
          this.setState({errorMessage: 'Error adding user.'});
          this.setState({successMessage: ''});
        }
      },
      (error) => {
        this.setState({errorMessage: 'Error connecting to API.'});
        this.setState({successMessage: ''});
      }
    );

  }

  handleUsernameEdit(event) {
    this.setState({
      username: event.target.value,
      errorMessage: '',
      successMessage: ''
    });
  }

  handlePasswordEdit(event) {
    this.setState({
      password: event.target.value,
      errorMessage: '',
      successMessage: ''
    });
  }

  handleRoleChange(event) {
    this.setState({
      errorMessage: '',
      successMessage: ''
    });

    event.preventDefault();
  }

  render() {

    return (
      <div className="form-container">
        <div className="form-content">
          <h1>Add new user</h1>
          <form onSubmit={this.handleSubmit}>
            <div className="form-error">
              <p>
              {this.state.errorMessage}
              </p>
            </div>
            <div className="form-success">
              <p>
              {this.state.successMessage}
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
            <div className="input-element">
              <label>
                Role
              </label>
              <div>
                <select value={this.state.role} onChange={this.handleRoleChange}>
                  <option value="MANAGER_USER">Manager user</option>
                  <option value="REGULAR_USER">Regular user</option>
                </select>
              </div>
            </div>
            <input type="submit" value="Add user" />
          </form>
        </div>
      </div>
    );
  }
}

export default AddUser;