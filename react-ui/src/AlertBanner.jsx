import React from 'react';
import { Alert } from 'antd';
import 'antd/lib/alert/style/css';

class AlertBanner extends React.Component {

  state = {
    visiable: Boolean(this.props.message)
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      visiable: Boolean(nextProps.message)
    });
  }

  render() {
    const { message, type } = this.props;
    let bannerClassName = type + 'Banner';
    return (

      <div className={bannerClassName} >
        {this.state.visiable ?
          (<Alert message={message} type={type} banner closable afterClose={this.props.afterClose} />) : null
        }
      </div>
    );
  }

}

export default AlertBanner;