import React from 'react';
import { API_BASE_URL } from "./constants";
import { Link } from "react-router-dom";

class SupermerketView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      supermarket: null,
      infoMessage: 'The list of supermarkets is loading ...',
      errorMessage: ''
    }
  }

  componentDidMount() {
    const url = API_BASE_URL + '/api/supermarkets/' + this.props.id;

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(
      (result) => {
        if (result.status == 200) {
          Promise.resolve(result.json())
          .then(
            (data) => {
              this.setState({
                supermarket: data,
                infoMessage: '',
                errorMessage: ''
              });
            }
          );
        } else {
          this.setState({
            infoMessage: '',
            errorMessage: 'An error oocurred retrieving the supermarket, status: ' + result.status
          });
        }
      },
      (error) => {
        this.setState({
          infoMessage: '',
          errorMessage: 'An error occurred connecting to the API'
        });
      }
    );
  }

  render() {
    
    return (
      <div className="main-container">
        <h1>Supermarket</h1>
        <div className="error">
          {this.state.errorMessage}
        </div>
        <div className="info">
          {this.state.infoMessage}
        </div>
        <SuperMarketContent supermarket={this.state.supermarket} />
        <AddTimeSlots supermarket={this.state.supermarket} currentUser={this.props.currentUser} />
      </div>
    );
  }
}

function SuperMarketContent(props) {
  let supermarket = props.supermarket;

  if (!supermarket || supermarket == null) {
    return null;
  }

  return (
    <div className="supermarkets-list">
      <p>{supermarket.name}</p>
      <p>{supermarket.address}</p>
    </div>
  );
}

function AddTimeSlots(props) {
  let supermarket = props.supermarket;
  let currentUser = props.currentUser;

  if (!supermarket || supermarket == null) {
    return null;
  }

  if (!currentUser || currentUser.role != 'MANAGER_USER') {
    return null;
  }

  return (
    <div className="add-time-slots" >
      <Link to={"/supermarkets/" + supermarket.id + "/add-time-slot"}>
        Add time slots
      </Link>
    </div>
  );
}

export default SupermerketView;