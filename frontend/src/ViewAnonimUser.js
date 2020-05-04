import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

import Home from './Home';
import Login from './Login';
import Signup from './Signup';

class ViewAnonimUser extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </ul>

          <Switch>
            <Route exact path='/'>
              <Home
                currentUser={this.props.currentUser}
                accessToken={this.props.accessToken} />
            </Route>
            <Route exact path='/login'>
              <Login
                notifyLogin={this.props.notifyLogin}
                currentUser={this.props.currentUser}
                accessToken={this.props.accessToken}
                isAuthenticated={this.props.isAuthenticated} />
            </Route>
            <Route exact path='/signup'>
              <Signup />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default ViewAnonimUser;