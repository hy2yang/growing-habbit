const hash = require('./hashService');
let db, accounts, habbits;

async function init(callback) {
    db = await require("./dbConnection");
    accounts = db.collection("accounts");
    habbits = db.collection("habbits");
    callback();
}


async function newUser(username, password) {
    const profile = { username: username };
    try {
        const res = await accounts.findOne(profile);
        if (res) return { alert: 'username already in use' };
        profile.password = hash.getHashed(password);
        profile.habits = [];
        await accounts.insertOne(profile);
        return { userCreated : true, userId : profile._id};
    }
    catch (e) {
        handleError(e);
        return { error: 'db connection error' };
    }
}

async function login(username, password) {
    try {
        const doc = await accounts.findOne({ username: username });
        const hashed = hash.getHashed(password);
        if (!doc || doc.password !== hashed) return { alert: 'username or password not correct' };
        else return {login : 'success', userId : doc._id};
    }  
    catch (e) {
        handleError(e);
        return { error: 'db connection error' };
    }    
}

async function changePw(username, newPw) {
    const hashed = hash.getHashed(newPw);
    try {
        const res = await accounts.updateOne({ username: username }, {$set:{password:hashed}});
        return res;
    }  
    catch (e) {
        handleError(e);
        return { error: 'db connection error' };
    }    

}

function logout(){

}



function handleError(e) {
    console.log(e);
}

module.exports = {
    init: init,
    newUser: newUser,
    login : login
};

