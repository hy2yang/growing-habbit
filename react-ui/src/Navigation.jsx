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
            addModalVisible : false
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            username: nextProps.username ? nextProps.username : null
        });
    }

    handleClick = (e) => {   
        if (e.key === 'account' || e.key ==='new') {
            this.props.clearBanner();   
            if (e.key==='new' && !this.state.addModalVisible){
                this.showAddModal();
            }
        }  
        else this.setState({ current: e.key }, () => {
            if (e.key !== 'account' && e.key!=='new') {
                const path = (this.state.username && this.state.current === 'mine') ? `/users/${this.state.username}/habits` : '/habits';
                this.props.updateHabitDisplay(path,0);
            }
            this.props.clearBanner();
        });
    }

    showAddModal(){
        this.setState({ addModalVisible: true });
    }

    hideAddModal(){
        this.setState({ addModalVisible: false });
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
                        showAddModal = {this.showAddModal.bind(this)} 
                        hideAddModal = {this.hideAddModal.bind(this)} 
                        addModalVisible = {this.state.addModalVisible}
                        createHabit = {this.props.createHabit}
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