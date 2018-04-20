import React, { Component } from 'react';
import { Card, Button } from 'antd';
import 'antd/lib/card/style/css';
import 'antd/lib/button/style/css';

const ButtonGroup = Button.Group;

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

    getActionButton(type, text, disabled, onClick) {
        return (
            <Button disabled={disabled} onClick={onClick} icon={type} >
                {text}
            </Button>
        );
    }

    sameDay(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }

    render() {
        const cheer = this.state.cheered ? this.getActionButton('like', 'cheer', false, this.onClickCheer.bind(this)) : this.getActionButton('like-o', 'cheer', false, this.onClickCheer.bind(this));
        const checkIn = this.state.checkedIn ? this.getActionButton('check', 'checkin', false, this.onClickCheckin.bind(this)) : this.getActionButton('play-circle-o', 'checkin', false, this.onClickCheckin.bind(this));
        const finish = this.state.finished ? this.getActionButton('tags-o', 'finish', false, this.onClickFinish.bind(this)) : this.getActionButton('tags', 'finish', false, this.onClickFinish.bind(this));
        const deleteHabit = this.getActionButton('delete', 'delete', false, this.onClickDelete.bind(this));

        return (
            <Card hoverable actions={[
                <ButtonGroup>
                    {cheer}
                    {checkIn}
                    {finish}
                    {deleteHabit}
                </ButtonGroup>
            ]} >
                <Meta title={this.state.name} description={this.state.descr} />
            </Card >
        );
    }

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