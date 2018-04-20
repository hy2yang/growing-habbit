import React, { Component } from 'react';
import { Icon, Card } from 'antd';
import 'antd/lib/icon/style/css';
import 'antd/lib/card/style/css';

const connection = require('./connection');
const { Meta } = Card;

class HabitCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewerId: (this.props.viewerId || null)
        };
        if (this.props.habit) {
            Object.assign(this.state, this.props.habit);
            this.state.checkedIn = this.sameDay(new Date(), new Date(this.state.checkin));
            this.state.cheered = (() => {
                if (this.state.viewerId) return (new Set(this.state.cheers).has(this.state.viewerId));
                else return false;
            })();
        }
    }

    getActionButton(type, text, onClick) {
        return (
            <div onClick={onClick} >
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
        const cheer = this.state.cheered ? this.getActionButton('like', 'cheer', this.onClickCheer.bind(this)) : this.getActionButton('like-o', 'cheer', this.onClickCheer.bind(this));
        const checkIn = this.state.checkedIn ? this.getActionButton('check', 'checkin', this.onClickCheckin.bind(this)) : this.getActionButton('play-circle-o', 'checkin', this.onClickCheckin.bind(this));
        const finish = this.state.finished ? this.getActionButton('tags-o', 'finish', this.onClickFinish.bind(this)) : this.getActionButton('tags', 'finish', this.onClickFinish.bind(this));
        const deleteHabit = this.getActionButton('delete', 'delete', this.onClickDelete.bind(this));

        return (
            <Card hoverable actions={[cheer, checkIn, finish, deleteHabit]} >
                <Meta title={this.state.name} description={this.state.descr} />
            </Card >
        );
    }

    /*
    getCheerButton(){
        if (this.state)
        return (
            <div onClick={onClick} disabled={disabled}>
                <Icon type={type} />
                <div>{text}</div>
            </div>
        );
    }
    */

    onClickCheer() {
        console.log('click on cheer');
    }

    onClickCheckin() {
        console.log('click on checkin');
    }

    onClickFinish() {
        console.log('click on finish');
    }

    onClickDelete() {
        console.log('click on delete');
    }


}

export default HabitCard;