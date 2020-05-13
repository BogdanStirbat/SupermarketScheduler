import React from 'react';
import { API_BASE_URL } from "./constants";

class AppointmentsView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      supermarkets: [],
      infoMessage: 'The list of supermarkets is loading ...',
      errorMessage: ''
    }

    this.loadSupermarkets = this.loadSupermarkets.bind(this);
  }

  componentDidMount() {
    this.loadSupermarkets();
  }

  loadSupermarkets() {
    const url = API_BASE_URL + '/api/supermarkets/all-appointments';

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.accessToken
      }
    })
    .then(
      (result) => {
        if (result.status == 200) {
          Promise.resolve(result.json())
          .then(
            (data) => {
              this.setState({
                supermarkets: data,
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
        <h1>Appointments</h1>
        <div className="error">
          {this.state.errorMessage}
        </div>
        <div className="info">
          {this.state.infoMessage}
        </div>
        <RenderSupermarketWithAppointments 
          supermarkets={this.state.supermarkets}
          currentUser={this.props.currentUser}
          accessToken={this.props.accessToken}
          loadSupermarkets={this.loadSupermarkets} />
      </div>
    );
  }
}

class RenderSupermarketWithAppointments extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    if (!this.props.supermarkets || this.props.supermarkets.length == 0) {
      return null;
    }

    let listSupermarkets = this.props.supermarkets.map(
      (supermarket) => (
        <div key={supermarket.id}>
          <div className="supermarket-info">{supermarket.name}</div>
          <div className="supermarket-info">{supermarket.address}</div>
          <RenderAllAppointments 
            appointments={supermarket.appointments}
            currentUser={this.props.currentUser}
            accessToken={this.props.accessToken}
            loadSupermarkets={this.props.loadSupermarkets} />
        </div>
      )
    );

    return (
      <div className="supermarkets-with-appointments-list">
        {listSupermarkets}
      </div>
    );
  }
}

class RenderAllAppointments extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      errorMessage: ''
    }

    this.deleteAppointment = this.deleteAppointment.bind(this);
  }

  deleteAppointment(id, event) {
    event.preventDefault();

    let url = API_BASE_URL + '/api/appointments/' + id;

    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.accessToken
      }
    })
    .then(
      (result) => {
        if (result.status == 204) {
          this.setState({
            errorMessage: ''
          });
          this.props.loadSupermarkets();
        } else {
          this.setState({
            errorMessage: 'Error performing action; status: ' + result.status
          });
        }
      },
      (error) => {
        this.setState({
          errorMessage: 'Error connecting to the API'
        });
      }
    );
  }

  render() {

    if (!this.props.appointments || this.props.appointments.length == 0) {
      return null;
    }

    let listAppointments = this.props.appointments.map(
      (appointment) => (
        <div key={appointment.id} className="appointment-element">
          <div>Date: {appointment.date}</div>
          <div>Start time: {appointment.startTime}</div>
          <div>Stop time: {appointment.stopTime}</div>
          <div className="form-error">
            <div>{this.state.errorMessage}</div>
          </div>
          <button className="appointment-button" onClick={(e) => this.deleteAppointment(appointment.id, e)}>
            Delete appointment
          </button>
        </div>
      )
    );

    return (
      <div>
        {listAppointments}
      </div>
    );
  }
}

export default AppointmentsView;