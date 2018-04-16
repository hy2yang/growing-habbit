import React, { Component } from 'react';
import Button from 'antd/lib/button';
import 'antd/lib/button/style/css';

class AccountDetail extends Component {

    render() {
        return (
            <div>
                {JSON.stringify(this.props.user)}
                <Button onClick= {()=>this.props.logoutSubmit()}> logout </Button>
            </div>
            
        )
    }
}

export default AccountDetail;