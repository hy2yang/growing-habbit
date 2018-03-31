( () => {
  
let count=0;
const cards=require('./prestoredCards.js').lines.map(line => newCard( line.split("|")[0], line.split("|")[1]));
const prestored=new Set(cards.map((x,i)=>i));
const fav = {}; 
const custom = {};
const users = new Set();

function newUser(userId){
    userId=+userId;
    if (!users.has(userId)){
        users.add(userId);
        fav[userId] = new Set();
        custom[userId] = new Set();
    }
}

function hasCustomList(userId){
    if (custom[+userId] && custom[+userId].size>0) return true;
    return false;
}

function getAllCardIdsIn(set){
    if (set && set.size>0) return Array.from(set); 
    else return null; 
}

function ownsCard (userId, cardId) {
    if (custom[+userId].has(+cardId)) return true;
    else return false;
}

function deleteCard(cardId, ownerId){
    cardId=+cardId;
    cards.splice(cardId, 1);
    custom[+ownerId].delete(cardId);
    
    for (let userId in fav){
        fav[userId].delete(cardId);
    }
}

function addCustomCardOf (side0, side1, ownerId){
    const card = newCard(side0,side1);
    custom[+ownerId].add(card.cardId);
    cards.push(card);
}

function isInFavOf(cardId, userId){
    if (fav[+userId].has(+cardId)) return true;
    else return false;
}

function addToFavOf(cardId, userId){
    fav[+userId].add(+cardId);
}

function removeFromFavOf(cardId, userId){
    fav[+userId].delete(+cardId); 
}

function updateCard(cardId, side0, side1){
    cardId=+cardId;
    if (side0) {cards[cardId].side0=side0;}
    if (side1) {cards[cardId].side1=side1;}
}

function newCard(side0, side1){
    const card={};
    card.cardId=count++;
    card.side0=side0;
    card.side1=side1;
    return card;
}

module.exports={
    newUser : newUser,
    hasCustomList: hasCustomList,
    allCards : cards,
    getPrestoredCardIds :(()=> getAllCardIdsIn(prestored)),
    getFavCardIdsOf : ( (userId)=>getAllCardIdsIn(fav[userId]) ),
    getCustomCardIdsOf : ( (userId)=>getAllCardIdsIn(custom[userId]) ),
    getCardById : (cardId => cards[cardId]),    
    isInFavOf : isInFavOf, 
    ownsCard : ownsCard,
    addToFavOf : addToFavOf,    
    removeFromFavOf : removeFromFavOf,    
    addCustomCardOf :addCustomCardOf,
    updateCard : updateCard,
    deleteCard : deleteCard
};

})();