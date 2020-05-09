import React from 'react';

import { API_BASE_URL } from "./constants";

class Home extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      supermarkets: [],
      infoMessage: 'The list of supermarkets is loading ...',
      errorMessage: ''
    };
  }

  componentDidMount() {
    const url = API_BASE_URL + '/api/supermarkets';

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(
      (result) => {
        if (result.status == 200) {
          Promise.resolve(result.json())
            .then(
              (data) => {
                this.setState({
                  supermarkets: data,
                  infoMessage: '',
                  errorMessage: ''
                });
              }
            );
        } else {
          this.setState({
            infoMessage: '',
            errorMessage: 'An error oocurred retrieving supermarkets list, status: ' + result.status
          });
        }
      },
      (error) => {
        this.setState({
          infoMessage: '',
          errorMessage: 'An error occurred connecting to the API'
        });
      }
    );
  }

  render() {
    return (
      <div className="main-container">
        <h1>Supermarkets</h1>
        <div>
          {this.state.errorMessage}
        </div>
        <div>
          {this.state.infoMessage}
        </div>
        <SuperMarketsContent supermarkets={this.state.supermarkets} />
      </div>
    );
  }
}

function SuperMarketsContent(props) {
  let supermarkets = props.supermarkets;

  if (!supermarkets || supermarkets.length == 0) {
    return null;
  }

  let listItems = supermarkets.map(
    (supermarket) => {
      return (
        <li key={supermarket.id.toString()}>
          {supermarket.name}
        </li>
      );
    }
  );

  return (
    <ul className='supermarkets-list'>
      {listItems}
    </ul>
  );
}

export default Home;