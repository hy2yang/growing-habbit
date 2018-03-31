const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 2666;
const service = require('./service.js');
const idService = require('./mockIDService.js');

app.use(bodyParser.json({ extended: true, type: '*/*' }) );
app.use(express.static(path.resolve(__dirname, '../react-ui/build')) );

app.post('/users',(req, res) => { 
    const info = idService.getID();
    service.newUser(info.currentId);
    res.send( JSON.stringify( info ));
});

app.get('/users',(req, res) => {
    const active = Array.from(idService.activeUsers);
    const withCustomList = active.filter(userId => service.hasCustomList(userId));
    res.send( JSON.stringify( { activeUsers : active, withCustomList : withCustomList} ));
});

app.get('/users/:userId/fav', (req, res) => { 
    const currentId=req.get('currentId');
    if ( currentId !== req.params.userId){
        res.status(403).send('you have no such permission on this list');
    }
    else{
        res.send( JSON.stringify( cardListWithMark( service.getFavCardIdsOf(currentId), currentId ) ));
    }
});

app.post('/users/:userId/fav', (req, res) => {
    const currentId=req.get('currentId');
    if ( currentId !== req.params.userId){
        res.status(403).send('you have no such permission on this list');
    }
    else{ 
        service.addToFavOf(req.body.id, currentId);
        res.send( JSON.stringify( cardListWithMark( service.getFavCardIdsOf(currentId), currentId ) ));
    }
});

app.delete('/users/:userId/fav/:cardId', (req, res) => { 
    const currentId=req.get('currentId');
    if ( currentId !== req.params.userId){
        res.status(403).send('you have no such permission on this list');
    }
    else {
        service.removeFromFavOf(req.params.cardId, currentId);
        res.send( JSON.stringify( cardListWithMark( service.getFavCardIdsOf(currentId), currentId ) ));
    }    
    
});

app.get('/prestored', (req, res) => { 
    const currentId = req.get('currentId');    
    res.send( JSON.stringify( cardListWithMark( service.getPrestoredCardIds(), currentId ) ) ); //
});


/*
app.delete('/prestored/:cardId', (req, res) => { 
    service.deleteCard(req.params.cardId);
    res.send('OK');
});
*/

app.get('/users/:userId/custom', (req, res) => { 
    const currentId = req.get('currentId');
    res.send( JSON.stringify( cardListWithMark( service.getCustomCardIdsOf(req.params.userId), currentId ) ) );
});

app.post('/users/:userId/custom', (req, res) => {  
    const currentId=req.get('currentId');  
    if ( currentId !== req.params.userId){
        res.status(403).send('you have no such permission on this list');
    }
    else{ 
        let i= req.body.side0;
        let j= req.body.side1;
        if ( !i || !j ) res.status(400).send("neither side can be null");
        service.addCustomCardOf(i,j, currentId);
        res.send( JSON.stringify( cardListWithMark( service.getCustomCardIdsOf(currentId), currentId ) ) );
    }
});

app.delete('/users/:userId/custom/:cardId', (req, res) => { 
    const currentId=req.get('currentId');
    if (!service.ownsCard(currentId, req.params.cardId)){
        res.status(403).send('you have no such permission on this card');
    }
    else{
        service.deleteCard(req.params.cardId, currentId);
        res.send( JSON.stringify( cardListWithMark( service.getCustomCardIdsOf(currentId), currentId ) ) );
    }    
});

/*
app.get('/cards', (req, res) => { 
    const currentId=req.get('currentId');
    res.send( JSON.stringify( cardListWithFavMark( service.allCards, currentId ) ) );
    res.send( JSON.stringify( service.allCards ));
}); 
*/

app.get('/cards/:cardId', (req, res) => { 
    const currentId=req.get('currentId');
    res.send( JSON.stringify( getCardWithMark(req.params.cardId, currentId) ));
});

app.put('/cards/:cardId', (req, res) => { 
    const currentId=req.get('currentId');
    if (!service.ownsCard(currentId, req.params.cardId)){
        res.status(403).send('you have no such permission on this card');
    }
    else{
        let i= req.body.side0;
        let j= req.body.side1;
        if ( !i || !j ) res.status(400).send("neither side can be null");
        service.updateCard(req.params.cardId, i, j );
        res.send( JSON.stringify( getCardWithMark(req.params.cardId, currentId) ));
    }
});

function getCardWithMark( cardId, userId ){
    const card = service.getCardById(cardId);
    card.infav = service.isInFavOf(cardId, userId);
    card.ownership = service.ownsCard(userId, cardId);
    return card;
}

function cardListWithMark( cardIdList, userId ){
    if (cardIdList) return cardIdList.map(cardId => getCardWithMark(cardId, userId) );
    else return null;
}

app.listen(PORT, () => {  
    console.log(`Server listening at http://localhost:${PORT}`);
    console.log('use Ctrl-C to stop this server');
});