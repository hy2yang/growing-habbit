const jwt = require('jsonwebtoken');

const KEY = require('./config').JWT_SECRET;

const active = new Set();

function generateToken(userId){
    const res = jwt.sign({userId : userId, timestamp: Date.now()}, KEY); 
    active.add(userId.toString());
    return res;
}

function isRevoked(userId){
    return !active.has(userId);
}

function invalidate(userId){
    active.delete(userId);
}

module.exports ={
    generateToken : generateToken,
    isRevoked : isRevoked,
    invalidate : invalidate
};