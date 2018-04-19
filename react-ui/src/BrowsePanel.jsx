import React, { Component } from 'react';

class BrowserPanel extends Component {
    render() {
        //console.log(this.props.array);
        const all = this.props.array.map(item => {
            return (<li key={Math.random()}>{JSON.stringify(item)}</li>)
        })
        return (
            <div className='browse'>
               <ul> {all}</ul>
            </div>
        )
    }
}

export default BrowserPanel;