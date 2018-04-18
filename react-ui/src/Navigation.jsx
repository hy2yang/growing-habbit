import React, { Component } from 'react';
import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';
import Menu from 'antd/lib/menu';
import 'antd/lib/menu/style/css';
import './navigation.css'

class Navigation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: null,
            current: 'shared'
        };
    }

    handleClick = (e) => {
        this.setState({current: e.key}, ()=>{           
            if (e.key!=='account'){
                const path = (this.state.username && this.state.current==='mine')? `/users/${this.state.username}/habits`:'/habits';
                this.props.setDatasource(path);
            }
            this.props.clearBanner();
        });        
    }

    componentWillReceiveProps(nextProps){ 
        this.setState({
            username: nextProps.username? nextProps.username:null
        });        
    }

    render() {
        const hasUser = this.state.username? true:false;
        return (
            <div className='navigation'>
                <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode='horizontal' >
                    <Menu.Item key='shared'>
                        <Icon type='appstore-o' /> Explore shared
                    </Menu.Item>
                    <Menu.Item key='mine' disabled={!hasUser}>                    
                        <Icon type='user' /> Mine
                    </Menu.Item> 
                    <Menu.Item key='account'>
                        {this.props.accountPanel}
                    </Menu.Item>          
                </Menu>
            </div>
        )
    }
}

export default Navigation;