import React, { Component } from 'react';
import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';
import Card from 'antd/lib/card';
import 'antd/lib/card/style/css';

const connection = require('./connection');
const { Meta } = Card;

class HabitCard extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.habit;
        this.state.viewerId = this.props.userId;
        this.state.checkedIn = this.sameDay(new Date(), this.props.habit.checkIn);
        this.state.cheered = () => {
            if (new Set(this.props.card.cheers).has(this.props.viewerId)) return true;
            else return false;
        };        
    }

    getActionButton(type, text, onClick) {
        return (
            <div onClick={onClick}>
                <Icon type={type} />
                <div>{text}</div>
            </div>
        );
    }

    sameDay(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }

    render() {
        const cheer = this.state.cheered ? getActionButton('like', 'cheer!', this.onClickCheer.bind(this)) : getActionButton('like-o', 'cheer!', this.onClickCheer.bind(this));
        const checkIn = this.state.checkedIn ? getActionButton('check', 'checkin', this.onClickCheckin.bind(this)) : getActionButton('play-circle-o', 'checkin', this.onClickCheckin.bind(this));
        const finish = this.state.finished ? getActionButton('tags-o', 'finish', this.onClickFinish.bind(this)) : getActionButton('tags', 'finish', this.onClickFinish.bind(this));
        const deleteHabit = getActionButton('delete', 'delete', this.onClickDelete.bind(this));

        return (
            <Card style={{ width: 300 }} cover={<img alt="example" graph here />} actions={[cheer, checkIn, finish, deleteHabit]} >
                <Meta title='habit name' description='habit descr' />
            </Card >
        );
    }

    onClickCheer(){
        
    }

    onClickCheckin(){

    }

    onClickFinish(){

    }

    onClickDelete(){

    }


}



export default HabitCard;