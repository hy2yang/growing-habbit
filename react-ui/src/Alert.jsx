import React, { Component } from 'react';
import './Alert.css';

class Alert extends Component {
  render(props) {
    return (
      <div className="alert hidden">
        <span>{this.props.message}</span>
        <span className="closebtn" onClick={this.props.onClick}>Close</span>        
	    </div>
    );
  }

}

export default Alert;