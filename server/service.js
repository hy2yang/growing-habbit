let db, accounts, habbits;

async function init(callback){    
    db = await require("./dbConnection");
    accounts = db.collection("accounts");
    habbits = db.collection("habbits"); 
    //console.log(accounts);
    //console.log(habbits);
    callback();  
}


function newUser(username, hashedPw) {
    const profile = {
        username: username,
        password: hashedPw,
        habits: []
    };
    accounts.insertOne(profile, (err, doc) => {        
        if (err) {
            throw err;            
        } else {
            return doc;
        }
    });
}

function handleError(e){
    console.log(e);
}

module.exports = {
    init: init,
    newUser : newUser
};

