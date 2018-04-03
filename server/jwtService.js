const jwt = require('jsonwebtoken');

const KEY = 'growing-habbit';

const blacklist = new Set();

function generateToken(input){
    const res = jwt.sign(input, KEY);    
    return res;
}

function verifyToken(token){
    return blacklist.has(token)? false:jwt.verify(token, KEY);
}

function invalidateToken(token){
    return blacklist.add(token);
}