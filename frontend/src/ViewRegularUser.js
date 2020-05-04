import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

import Home from './Home';
import Logout from './Logout';

class ViewRegularUser extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <div>
          <ul>
            <li>
              Hello, {this.props.currentUser.username}!
            </li>
            <li>
              regular user
            </li>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/logout">Logout</Link>
            </li>
          </ul>

          <Switch>
            <Route exact path="/">
              <Home
                currentUser={this.props.currentUser}
                accessToken={this.props.accessToken} />
            </Route>
            <Route exact path="/logout">
              <Logout />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default ViewRegularUser;