import React, { Component } from 'react';
import './browsePanel.css';

import HabitCard from './HabitCard';

class BrowserPanel extends Component {
    render() {
        
        const allCards = this.props.array.map(item => {
            return (
            <div className='habitCard' key={`${item._id}_${this.props.viewerId}`}>
                <HabitCard habit={item} viewerId={this.props.viewerId} getCardUpdaters={this.props.getCardUpdaters}/>
            </div>)
        });        
        
        return (            
            <div className='browse'>
                {allCards}
            </div>
        )
    }
}

export default BrowserPanel;