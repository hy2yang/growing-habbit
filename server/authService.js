const jwt = require('jsonwebtoken');

const KEY = require('./config').JWT_SECRET;

const active = new Set();

function generateToken(userId){
    const payload = {userId : userId, timestamp: new Date()};
    const res = jwt.sign(payload, KEY); 
    active.add(payload.toString());
    return res;
}

function isRevoked(payload){
    return !active.has(payload);
}

function invalidate(payload){
    active.delete(payload);
}

module.exports ={
    generateToken : generateToken,
    isRevoked : isRevoked,
    invalidate : invalidate
};