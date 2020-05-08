import React from 'react';
import { API_BASE_URL, ACCESS_TOKEN, API_TOKEN_USERNAME, API_TOKEN_PASSWORD } from "./constants";

class AddSupermarket extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      errorMessage: '',
      successMessage: '',
      name: '',
      address: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameEdit = this.handleNameEdit.bind(this);
    this.handleAddressEdit = this.handleAddressEdit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

    const addSupermarketUrl = API_BASE_URL + '/api/supermarkets';
    let data = {
      "name": this.state.name,
      "address": this.state.address
    };

    fetch(addSupermarketUrl, {
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
          this.setState({successMessage: 'Supermarket added successfully.'});
        } else {
          this.setState({errorMessage: 'Error adding supermarket.'});
          this.setState({successMessage: ''});
        }
      },
      (error) => {
        this.setState({errorMessage: 'Error connecting to API.'});
        this.setState({successMessage: ''});
      }
    );
  }

  handleNameEdit(event) {
    this.setState({
      errorMessage: '',
      successMessage: '',
      name: event.target.value
    });
  }

  handleAddressEdit(event) {
    this.setState({
      errorMessage: '',
      successMessage: '',
      address: event.target.value
    });
  }

  render() {

    return (
      <div className="form-container">
        <div className="form-content">
          <h1>Add new supermarket</h1>
          <form onSubmit={this.handleSubmit}>
            <div className="form-error">
              <p>{this.state.errorMessage}</p>
            </div>
            <div className="form-success">
              <p>{this.state.successMessage}</p>
            </div>
            <div className="form-element">
              <label>Name</label>
              <div>
                <input type="text" value={this.state.name} onChange={this.handleNameEdit} />
              </div>
            </div>
            <div className="input-element">
              <label>Address</label>
              <div>
                <textarea cols="32" rows="5" value={this.state.address} onChange={this.handleAddressEdit} />
              </div>
            </div>
            <input type="submit" value="Add supermarket" />
          </form>
        </div>
      </div>
    );
  }
}

export default AddSupermarket;