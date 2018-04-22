import React, { Component } from 'react';
import { Button, Tooltip }from 'antd';
import 'antd/lib/button/style/css';
import 'antd/lib/tooltip/style/css';

class AccountDetail extends Component {

    render() {

        return (
            <div className='account'>
                <nobr>Logged in as : {this.props.username} </nobr>
                <Tooltip placement='bottom' title={'logout'}>
                    <Button type='danger' icon='logout' onClick={() => this.props.logoutSubmit()}></Button>
                </Tooltip>
            </div>
        )
    }
}

export default AccountDetail;