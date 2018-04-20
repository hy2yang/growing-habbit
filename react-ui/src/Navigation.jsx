import React, { Component } from 'react';
import { Icon, Menu } from 'antd';
import 'antd/lib/icon/style/css';
import 'antd/lib/menu/style/css';
import './navigation.css';
import AddHabitModal from './AddHabitModal';

class Navigation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: null,
            current: null,
            addModalVisible: false
        };
    }

    componentWillReceiveProps(nextProps) {
        const username = nextProps.username ? nextProps.username : null;
        this.setState({
            username: username
        });
    }

    handleClick = (e) => {
        this.props.clearBanner();
        if (e.key === 'shared' ) {
            this.setState({ current: 'shared' }, this.props.updateHabitDisplay('/habits', 0));
        }
        else if (e.key==='new') {
            if (!this.state.addModalVisible) {
            this.setState({ current:'mine', addModalVisible: true});
            }
        }
        else if (e.key==='mine'){
            if (this.state.username){
                this.setState({ current:'mine'}, this.props.updateHabitDisplay(`/users/${this.state.username}/habits`, 0));
            }
        }
        else this.setState({ current:'shared'});
    }

    render() {
        const hasUser = this.state.username ? true : false;
        return (
            <div className='navigation' >
                <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode='horizontal' >
                    <Menu.Item key='shared' >
                        <Icon type='appstore-o' /> Explore
                    </Menu.Item>
                    <Menu.Item key='mine' disabled={!hasUser}>
                        <Icon type='user' />Mine
                    </Menu.Item>
                    <Menu.Item key='new' disabled={!hasUser}>
                        <Icon type='plus-circle-o' /> New habit
                        <AddHabitModal
                            showAddModal={()=> this.setState({ addModalVisible: true }) } 
                            hideAddModal={()=> this.setState({ addModalVisible: false }) }
                            addModalVisible={this.state.addModalVisible}
                            createHabit={this.props.createHabit}
                        />
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