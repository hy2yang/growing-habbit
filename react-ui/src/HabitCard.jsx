import React, { Component } from 'react';
import { Card, Button, Progress } from 'antd';
import 'antd/lib/card/style/css';
import 'antd/lib/button/style/css';
import 'antd/lib/progress/style/css';
import './habitCard.css'

const ButtonGroup = Button.Group;

const { Meta } = Card;

class HabitCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewerId: (this.props.viewerId || null),
            habit : this.props.habit,
            checkedIn : this.sameDay(new Date(), new Date(this.props.habit.checkin)),
            cheered : (new Set(this.props.habit.cheers).has(this.props.viewerId))
        };
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
        const isOwner = Boolean(this.state.habit.ownerId === this.state.viewerId);
        const cheer = this.state.cheered ? this.getActionButton('like', 'cheer', true, this.onClickCheer.bind(this)) : this.getActionButton('like-o', 'cheer', !this.state.viewerId, this.onClickCheer.bind(this));
        const checkIn = this.state.checkedIn ? this.getActionButton('check', 'checkin', !isOwner || this.state.finished, null) : this.getActionButton('play-circle-o', 'checkin', !isOwner || this.state.finished, this.onClickCheckin.bind(this));
        const finish = this.state.habit.finished ? this.getActionButton('tags', 'finish', !isOwner, this.onClickFinish.bind(this)) : this.getActionButton('tags-o', 'finish', !isOwner, this.onClickFinish.bind(this));
        const deleteHabit = this.getActionButton('delete', 'delete', !isOwner, this.onClickDelete.bind(this));

        const descr = this.state.habit.descr? (<p>{this.state.habit.descr}</p>):(<br/>);
        const percentage = this.state.habit.finished? 100:(100*this.state.habit.height/66).toFixed(1);

        return (
            <Card hoverable 
            actions={[
                <ButtonGroup>
                    {cheer}
                    {checkIn}
                    {finish}
                    {deleteHabit}
                </ButtonGroup>
            ]} >                
                <Meta title={this.state.habit.name} />                
                <div>{descr}</div>
                
                <div>
                    <Progress percent={Number(percentage)} size='small' status={this.state.habit.finished? 'success':'active'}/>
                    The habit has been growing on its owner for {this.state.habit.height} days
                </div>
                <div>Cheered by {this.state.habit.cheers.length} people</div>
            </Card >
        );
    }

    onClickCheer() {
        this.props.getCardUpdaters(this.state.habit._id).cheer(this.updateSelf.bind(this));
    }

    onClickCheckin() {
        this.props.getCardUpdaters(this.state.habit._id).checkin(this.updateSelf.bind(this));
    }

    onClickFinish() {
        this.props.getCardUpdaters(this.state.habit._id).finish(!this.state.finished,this.updateSelf.bind(this));
    }

    onClickDelete() {
        this.props.getCardUpdaters(this.state.habit._id).deleteHabit();
    }

    updateSelf(habit) {
        const newState = { 
            viewerId : this.state.viewerId,
            checkedIn : this.sameDay(new Date(), new Date(habit.checkin)),
            cheered : (new Set(habit.cheers).has(this.state.viewerId)),
            habit : habit
        };        
        this.setState(newState);
    }

}

export default HabitCard;