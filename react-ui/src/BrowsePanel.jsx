import React, { Component } from 'react';
import { Card } from "antd";
import 'antd/lib/card/style/css';
import './browsePanel.css';

import HabitCard from './HabitCard';

class BrowserPanel extends Component {
    render() {
        
        const allCards = this.props.array.map(item => {
            return (
            <div className='habitCard' key={item._id}>
                <HabitCard habit={item} viewerId={this.props.viewerId}/>
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