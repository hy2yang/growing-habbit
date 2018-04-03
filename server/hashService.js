const crypto = require('crypto');
const hash = crypto.createHash('sha512');

function getHashed(input){
    hash.update(input);
    return (hash.digest('hex'));
}