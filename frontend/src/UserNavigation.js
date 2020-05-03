import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import Login from './Login';
import Signup from './Signup';

class UserNavigation extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentUser: props.currentUser,
      accessToken: props.accessToken,
      isAuthenticated: props.isAuthenticated
    };
  }

  render() {

    if (!this.state.isAuthenticated) {

      return (
        <Router>
          <div>
            <ul>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/signup">Signup</Link>
              </li>
            </ul>

            <Switch>
              <Route exact path="/login">
                <Login notifyLogin={this.props.notifyLogin} />
              </Route>
              <Route exact path="/signup">
                <Signup />
              </Route>
            </Switch>
          </div>
        </Router>
      );
    }
    
    return (
      <div>
        <p>Hello, {this.state.currentUser.username}!</p>
        <p>Log out</p>
      </div>
    );
  }
}

export default UserNavigation;