import React from 'react';
import { API_BASE_URL } from "./constants";

class RenderManageAppointments extends React.Component {

  constructor(props) {
    super(props);

    this.createAppointment = this.createAppointment.bind(this);
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
          this.props.loadSupermarkets();
        }
      },
      (error) => {
      }
    );

    console.log('Create timeslot, timeSlotId: ' + timeSlotId);
    console.log('Create timeslot, userId: ' + this.props.currentUser.id);
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
        <button onClick={(e) => this.createAppointment(this.props.timeSlot.id, e)}>
          Create appointment
        </button>
      );
    }

    return (
      <p>Delete this appointment</p>
    );
  }
}

export default RenderManageAppointments;