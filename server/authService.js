const jwt = require('jsonwebtoken');

const KEY = require('./config').JWT_SECRET;

const whitelist = new Set();

function generateToken(userId){
    const res = jwt.sign({userId : userId, timestamp: Date.now()}, KEY); 
    whitelist.add(userId.toString());
    return res;
}

function isRevoked(userId){
    return !whitelist.has(userId);
}

function invalidate(userId){
    whitelist.delete(userId);
}

module.exports ={
    generateToken : generateToken,
    isRevoked : isRevoked,
    invalidate : invalidate
};