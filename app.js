//app.js

// [LOAD PACKEGES]
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const flash = require('express-flash');
const passport = require('passport');
//const fs = require('fs');


// [CONFIGURE EJS]
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// [FLASH]
app.use(flash());

// [CONFIGURE SERVER PORT]
const portRunning = 80;
const port = process.env.PORT || portRunning;

// [RUN SERVER]
const server = app.listen(port, ()=>{
    console.log("Server has started on port " + port);
});

// [SESSION CONFIGURE]
app.use(session({
    secret: '@#@$MYSIGN#@$#$',
    resave: false,
    saveUninitialized: false
}));

// [PASSPORT INIT]
app.use(passport.initialize());
app.use(passport.session());

// [GET PULBIC FILES]
app.use(express.static('public'));

// [CONFIGURE APP TO USE BODYPARSER]
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

// [MONGOOSE CONNECTION]
const dbName = 'cnae'; //DB name
const dbHost = 'localhost'; // hosting name
//const dbPort = '' // DB port
//const dbUser = '' // DB user
//const dbUserPass = '' // DB user password

const db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    console.log("Mongodb server has started");
})

// [CONNECT MONGODB]
mongoose.connect('mongodb://' + dbHost + '/' + dbName, { useNewUrlParser : true });

// [DEFINE MODEL]
const Event = require('./models/event');
const User = require('./models/user');
const Team = require('./models/team');
const Category = require('./models/category');

// [CONFIGURE ROUTER]
const router = require('./routes/main')(app);
const EventRouter = require('./routes/event')(app, Event, User);
const UserRotuer = require('./routes/user')(app, User, Event, passport);
const TeamRouter = require('./routes/team')(app, Team);
const CategoryRouter = require('./routes/category')(app, Category);

const validate = (email) => {
    const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

    return expression.test(String(email).toLowerCase());
}