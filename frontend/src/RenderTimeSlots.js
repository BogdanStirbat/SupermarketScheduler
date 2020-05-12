import React from 'react';

import RenderManageAppointments from './RenderManageAppointments';

class RenderTimeSlot extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    if (!this.props.timeSlots || this.props.timeSlots.length == 0) {
      return null;
    }

    let listOfTimeSlots = this.props.timeSlots.map(
      (timeSlot) => (

        <div key={timeSlot.id.toString()} className="time-slot-element">
          <div>
            On {timeSlot.date}, from {timeSlot.startTime} to {timeSlot.stopTime}
          </div>
          <div>Max appointments: {timeSlot.maxAppointments}</div>
          <div>Number of appointments: {timeSlot.nrAppointments}</div>
          <RenderManageAppointments 
            timeSlot={timeSlot} 
            currentUser={this.props.currentUser}
            accessToken={this.props.accessToken}
            loadSupermarkets={this.props.loadSupermarkets} />
        </div>
      )
    );

    return (
      <div className="time-slot-list">
        {listOfTimeSlots}
      </div>
    );
  }
}

export default RenderTimeSlot;