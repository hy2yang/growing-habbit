const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const app = express();

const PORT = process.env.PORT || 2666;
const service = require('./service.js');
const authService = require('./authService');


app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});

app.use( jwt({ 
    secret : require('./config').JWT_SECRET,
    isRevoked : (req, payload, done) => {
        const userId = payload.userId;
        done(null, !authService.isValid(userId));
    }
    }).unless({path: require('./config').ACCESSIBLE})
);

app.use(function (err, req, res, next) {
    if (err) {
      res.status(401).send('invalid jwt token');
    }
});

app.use(bodyParser.json({ extended: true, type: '*/*' }) );

app.use(express.static(path.resolve(__dirname, '../react-ui/build')) );


function handleRes(res, resp){
    if (res.error) resp.status(500).send('db error, please try again later');
    else if (res.alert) resp.status(400).send(res.alert);
    else resp.send( JSON.stringify(res));
}

app.post('/users',(req, resp) => { 
    const username = req.body.username;
    const password = req.body.password;
    //if ()
    service.newUser(username, password).then(res => handleRes(res,resp));    
});

app.post('/login',(req, resp) => { 
    const username = req.body.username;
    const password = req.body.password;
    const res = service.login(username, password).then(res => handleRes(res,resp));
});

app.put('/users',(req, resp) => { 
    const username = req.body.username;
    const password = req.body.password;
    const res = service.changePw(username, password).then(res => handleRes(res,resp));
});

app.post('/users/logout',(req, resp) => { 
    const userId = req.user.userId;
    authService.invalidate(userId);
    resp.send('user '+userId+' logout');
});

app.get('/users/:username/habits', (req, resp) => { 
    const username = req.params.username;
    /*
    get all habits
    const currentId;
    if ( currentId !== req.params.userId){
        res.status(403).send('you have no such permission on this list');
    }
    else{
        res.send( JSON.stringify( cardListWithMark( service.getFavCardIdsOf(currentId), currentId ) ));
    }
    */
});

app.post('/users/:username/habits', (req, resp) => {
    /*
    add habit
    */
});

app.delete('/users/:username/habits/:habitId', (req, resp) => {
    /*
    delete habit
    */
});

app.put('/users/:username/habits/:habitId', (req, resp) => {
    /*
    update habit status
    */
});

app.get('/habits',(req, resp) => {
    const page = req.query.page;
});


service.init(()=>{
    app.listen(PORT, () => {  
        console.log(`Server listening at http://localhost:${PORT}`);
        console.log('use Ctrl-C to stop this server');
    });
})

