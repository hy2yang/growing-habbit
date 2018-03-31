import React, { Component } from 'react';
import './Banner.css';

class Banner extends Component {
    render(props) {
        return (
            <div className="banner">
                <span>{this.props.text} {this.props.id}</span>
            </div>
        );
    }
}
export default Banner;