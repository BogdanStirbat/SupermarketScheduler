import React from 'react';
import { API_BASE_URL } from "./constants";

class AddTimeSlots extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      errorMessage: '',
      successMessage: '',
      maxNrAppointments: 10,
      slotDate: null,
      startTime: '09:00',
      stopTime: '22:00',
      durationOfAppointment: 30
    };

    this.handleMaxNrAppointmentsEdit = this.handleMaxNrAppointmentsEdit.bind(this);
    this.handleSlotDateEdit = this.handleSlotDateEdit.bind(this);
    this.handleStartTimeEdit = this.handleStartTimeEdit.bind(this);
    this.handleStopTimeEdit = this.handleStopTimeEdit.bind(this);
    this.handleDurationOfAppointmentEdit = this.handleDurationOfAppointmentEdit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleMaxNrAppointmentsEdit(event) {
    this.setState({
      maxNrAppointments: event.target.value,
      errorMessage: '',
      successMessage: ''
    });
  }

  handleSlotDateEdit(event) {
    this.setState({
      slotDate: event.target.value,
      errorMessage: '',
      successMessage: ''
    });
  }

  handleStartTimeEdit(event) {
    this.setState({
      startTime: event.target.value,
      errorMessage: '',
      successMessage: ''
    });
  }

  handleStopTimeEdit(event) {
    this.setState({
      stopTime: event.target.value,
      errorMessage: '',
      successMessage: ''
    });
  }

  handleDurationOfAppointmentEdit(event) {
    this.setState({
      durationOfAppointment: event.target.value,
      errorMessage: '',
      successMessage: ''
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    let url = API_BASE_URL + '/api/timeslots';
    let data = {
      maxAppointments: this.state.maxNrAppointments,
      date: this.state.slotDate,
      startTime: this.state.startTime,
      stopTime: this.state.stopTime,
      supermarketId: this.props.id,
      durationOfAppointment: this.state.durationOfAppointment
    };

    console.log('Sending data: ' + JSON.stringify(data));

    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.accessToken
      }
    })
    .then(
      (result) => {
        if (result.status == 200) {
          this.setState({errorMessage: ''});
          this.setState({successMessage: 'Time slots added successfully.'});
        } else {
          this.setState({errorMessage: 'Error adding time slots. Status: ' + result.status});
          this.setState({successMessage: ''});
        }
      },
      (error) => {
        this.setState({errorMessage: 'Error connecting to API.'});
        this.setState({successMessage: ''});
      }
    );
  }

  render() {
    return (
      <div className="form-container">
        <div className="form-content">
          <h1>Add time slots</h1>
          <form onSubmit={this.handleSubmit}>
            <div className="form-error">
              <p>{this.state.errorMessage}</p>
            </div>
            <div className="form-success">
              <p>{this.state.successMessage}</p>
            </div>
            <div className="form-element">
              <label>
                Maximum number of appointments
              </label>
              <div>
                <input type="number" value={this.state.maxNrAppointments} onChange={this.handleMaxNrAppointmentsEdit} />
              </div>
            </div>
            <div className="input-element">
              <label>
                Date of appointments
              </label>
              <div>
                <input type="date" value={this.state.slotDate} onChange={this.handleSlotDateEdit} />
              </div>
            </div>
            <div className="input-element">
              <label>
                Start time
              </label>
              <div>
                <input type="text" pattern="([0-1]{1}[0-9]{1}|20|21|22|23):[0-5]{1}[0-9]{1}" 
                  maxlength="5" size="5" value={this.state.startTime} onChange={this.handleStartTimeEdit} />
              </div>
            </div>
            <div className="input-element">
              <label>
                Stop time
              </label>
              <div>
                <input type="text" pattern="([0-1]{1}[0-9]{1}|20|21|22|23):[0-5]{1}[0-9]{1}" 
                  maxlength="5" size="5" value={this.state.stopTime} onChange={this.handleStopTimeEdit} />
              </div>
            </div>
            <div>
              <label>
                Duration of an appointment (minutes)
              </label>
              <div>
                <input type="number" value={this.state.durationOfAppointment} onChange={this.handleDurationOfAppointmentEdit} />
              </div>
            </div>
            <input type="submit" value="Add appointments" />
          </form>
        </div>
      </div>
    );
  }
}

export default AddTimeSlots;