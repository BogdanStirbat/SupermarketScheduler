import React from 'react';

class Logout extends React.Component {

  constructor(props) {
    super(props);

    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout(event) {
    this.props.notifyLogout();
  }

  render() {

    return (
      <div className="form-container">
        <div className="form-content">
          <h1>Are you sure you want to logout?</h1>
          <form onSubmit={this.handleLogout}>
            <input type="submit" value="Logout" />
          </form>
        </div>
      </div>
    );
  }
}

export default Logout;