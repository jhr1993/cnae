//app.js

// [LOAD PACKEGES]
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const flash = require('express-flash');
const passport = require('passport');
const multer = require('multer');
const path = require('path')
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
const EventRouter = require('./routes/event')(app, Event, User, multer);
const UserRotuer = require('./routes/user')(app, User, Event, passport);
const TeamRouter = require('./routes/team')(app, Team);
const CategoryRouter = require('./routes/category')(app, Category);

const validate = (email) => {
const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

    return expression.test(String(email).toLowerCase());
}

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Check File Type
function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif|jfif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true);
    } else {
        cb('Error: Images Only!');
    }
}

app.post('/upload', (req, res) => {

    // Init Upload
    const upload = multer({
        storage: storage,
        limits:{fileSize: 10000000},
        fileFilter: function(req, file, cb){
            checkFileType(file, cb);
        }
    }).fields([{ name: 'myImage1', maxCount: 1 }]);
    upload(req, res, (err) => {
    console.log(req.files)
        if(err){
            console.log(err)
            /*res.render('index', {
                msg: err
            });*/
        } else {
            if(req.files == undefined){
                console.log('no image')
                /*res.render('index', {
                    msg: 'Error: No File Selected!'
                });*/
            } else {
                console.log('upload')
                /*res.render('index', {
                    msg: 'File Uploaded!',
                    file: `uploads/${req.file.filename}`
                });*/
            }
        }
    })//.single('myImage1');
});

/*const txtupload = multer().any()
txtupload(req,res,(err)=>{
    let validate = true
    const validate_value = ['event_title','event_summary','event_desc','event_cat_content1','event_cat_id_content1','event_artist_content1','event_start_date_content1','event_end_date_content1','event_start_time_content1','event_end_time_content1','place_address2_content1','place_city_content1','place_state_content1','place_zip_content1','place_country_content1','contact_name_content1','contact_desc_content1','contact_phone_content1']
    validate_value.forEach(element => {
        if(!req.body[element]||req.body[element]==''||req.body[element]==' ')
            validate = false
    });
    if(!req.body.ticket_type)
        validate = false
    if(req.body.ticket_type == 'free' || req.body.ticket_type == 'paid'){
        let ticket_validate = ['ticket_name_content1','ticket_capacity_content1'];
        if(req.body.ticket_type == 'paid'){
            ticket_validate.push('ticket_currency_content1','ticket_price_content1')
        }
        ticket_validate.forEach(element => {
            if(!req.body[element]||req.body[element]==''||req.body[element]==' ')
                validate = false
        });
    }
    if(!validate){
        console.log('not validate')
    }else {
        console.log('validate')
        upload(req, res, (err) => {
            if(err){
                console.log(err)
                res.render('index', {
                    msg: err
                });
            } else {
                if(req.file == undefined){
                    console.log('no image')
                    res.render('index', {
                        msg: 'Error: No File Selected!'
                    });
                } else {
                    console.log('upload')
                    res.render('index', {
                        msg: 'File Uploaded!',
                        file: `uploads/${req.file.filename}`
                    });
                }
            }
        });
    }
})*/ 