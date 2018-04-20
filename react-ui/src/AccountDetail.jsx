import React, { Component } from 'react';
import Button from 'antd/lib/button';
import 'antd/lib/button/style/css';

class AccountDetail extends Component {

    render() {

        return (
            <div className='account'>   
                <nobr>Logged in as : {this.props.username} </nobr>       
                <Button type='danger' icon='poweroff' onClick= {()=>this.props.logoutSubmit()}> logout </Button>
            </div>
        )
    }
}

export default AccountDetail;