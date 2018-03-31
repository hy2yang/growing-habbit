import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const connection = require('./connection');
let currentId = null;

boot();

async function boot(){
    while(!currentId){
        currentId = await connection.requestUserId();
    }
    console.log(currentId);
    ReactDOM.render(<App currentId={currentId}/>, document.getElementById('root'));
    registerServiceWorker();
}
