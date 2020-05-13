import React from 'react';
import { API_BASE_URL } from "./constants";

class RenderManageAppointments extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      errorMessage: ''
    }

    this.createAppointment = this.createAppointment.bind(this);
    this.deleteAppointment = this.deleteAppointment.bind(this);
  }

  createAppointment(timeSlotId, event) {
    event.preventDefault();

    let url = API_BASE_URL + '/api/appointments';
    let data = {
      "userId": this.props.currentUser.id,
      "slotId": timeSlotId
    };

    fetch(url, {
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

    console.log('Create timeslot, timeSlotId: ' + timeSlotId);
    console.log('Create timeslot, userId: ' + this.props.currentUser.id);
  }

  deleteAppointment(appointmentId, event) {
    event.preventDefault();

    let url = API_BASE_URL + '/api/appointments/' + appointmentId;

    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.accessToken
      },
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

    if (!this.props.accessToken || this.props.accessToken.length == 0) {
      return (
        <div className="need-login-info">
          (To create an appointment, you need to log in)
        </div>
      );
    }

    if (!this.props.timeSlot.appointmentIdForThisUser || this.props.timeSlot.appointmentIdForThisUser == null) {
      return (
        <div>
          <div className="form-error">
            <div>{this.state.errorMessage}</div>
          </div>
          <button className="appointment-button" onClick={(e) => this.createAppointment(this.props.timeSlot.id, e)}>
            Create appointment
          </button>
        </div>
        
      );
    }

    return (
      <div>
        <div className="form-error">
          <div>{this.state.errorMessage}</div>
        </div>
        <button className="appointment-button" onClick={(e) => this.deleteAppointment(this.props.timeSlot.appointmentIdForThisUser, e)}>
          Delete appointment
        </button>
      </div>
    );
  }
}

export default RenderManageAppointments;