import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link, NavLink, Redirect, useParams } from "react-router-dom";

import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import PageSupermarket from './PageSupermarket';

class ViewAnonimUser extends React.Component {

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
                  <NavLink exact to="/signup" activeClassName="active">Signup</NavLink>
                </li>
                <li>
                  <NavLink exact to="/login" activeClassName="active">Login</NavLink>
                </li>
                <li>
                  <NavLink exact to="/" activeClassName="active">Home</NavLink>
                </li>
              </ul>
            </nav>
          </div>

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
              <Signup 
                notifyLogin={this.props.notifyLogin} />
            </Route>
            <Route exact path='/logout'>
              <Redirect to="/" />
            </Route>
            <Route 
              path="/supermarkets/:id" 
              children={<RenderSupermerket currentUser={this.props.currentUser} accessToken={this.props.accessToken} />} />
          </Switch>
        </div>
      </Router>
    );
  }
}

function RenderSupermerket(props) {
  let { id } = useParams();

  return(
    <PageSupermarket
      currentUser={props.currentUser}
      accessToken={props.accessToken}
      id={id} />
  );
}

export default ViewAnonimUser;