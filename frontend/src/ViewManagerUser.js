import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link, NavLink, Redirect } from "react-router-dom";

import Home from './Home';
import Logout from './Logout';
import AddUser from './AddUser';
import AddSupermarket from './AddSupermarket';

class ViewManagerUser extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <div>
          <div>
            <nav>
              <ul>
                <li>
                  <NavLink exact to="/logout" activeClassName="active">Logout</NavLink>
                </li>
                <li>
                  <NavLink exact to="/add-user" activeClassName="active">Add user</NavLink>
                </li>
                <li>
                  <NavLink exact to="/add-supermarket" activeClassName="active">Add supermarket</NavLink>
                </li>
                <li>
                  <NavLink exact to="/" activeClassName="active">Home</NavLink>
                </li>
                <li>
                  <p>Hello, {this.props.currentUser.username}!</p>
                </li>
              </ul>
            </nav>
          </div>

          <Switch>
            <Route exact path="/">
              <Home
                currentUser={this.props.currentUser}
                accessToken={this.props.accessToken} />
            </Route>
            <Route exact path="/login">
              <Redirect to="/" />
            </Route>
            <Route exact path="/signup">
              <Redirect to="/" />
            </Route>
            <Route exact path="/logout">
              <Logout 
                notifyLogout={this.props.notifyLogout} />
            </Route>
            <Route exact path="/add-user">
              <AddUser
                currentUser={this.props.currentUser}
                accessToken={this.props.accessToken} />
            </Route>
            <Route exact path="/add-supermarket">
              <AddSupermarket />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default ViewManagerUser;