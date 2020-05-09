import React from 'react';
import { useParams } from "react-router-dom";

class ManageSupermarket extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    

    return (
      <div>
        ID: {this.props.id}
      </div>
    );
  }
}

export default ManageSupermarket;