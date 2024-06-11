/*
PHASE 2 & 3
CCAPDEV S11
    Group Members: 
        Ng, Sherilyn Kaye
        Vizmanos, Julianne 
*/
var PORT = process.env.PORT || 3000;

require('dotenv').config();
const express = require('express');
const passport = require('passport')
const hbs = require('hbs')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const cookieParser = require('cookie-parser')
const expressSession  = require('express-session')
const SessionStore = require('express-session-sequelize')(expressSession.Store)
const routes = require(`./routes/routes.js`);
const db = require('./models')
require('./config/passport.js')

const myDatabase = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
});

const sequelizeSessionStore = new SessionStore({
    db: myDatabase,
});

const app = new express();

app.use(expressSession({
    secret: process.env.SECRET,
    store: sequelizeSessionStore,
    resave: false,
    saveUninitialized: false,
}));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser());
app.use(passport.initialize())
app.use(passport.session())

app.use(function(req, res, next){
    console.log(req.session)
    console.log(req.user)
    next()
})

//app.use('/user', authRoute); //this refers to the path where the data can be accessed

app.set('views', __dirname + './views'); 
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + `/views/partials`);

app.use(`/`, routes);

db.sequelize.sync().then((req) => {

    app.listen(PORT, function(){
        console.log("Node server is running at port 3000.....");
    });
})

