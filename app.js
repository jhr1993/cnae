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
const fs = require('fs')


// [CONFIGURE EJS]
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// [FLASH]
app.use(flash());

// [CONFIGURE SERVER PORT]
const portRunning = 8080;
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

const upload = multer({
    storage: storage,
    limits:{fileSize: 10000000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
});

app.post('/upload', upload.any(), (req, res) => {

    let error_value = [];
    const validate_value = ['event_title','event_summary','event_desc','event_cat_content1','event_cat_id_content1','event_artist_content1','event_start_date_content1','event_end_date_content1','event_start_time_content1','event_end_time_content1','place_lat_content1','place_lng_content1','place_address2_content1','place_city_content1','place_state_content1','place_zip_content1','place_country_content1','contact_name_content1','contact_desc_content1','contact_phone_content1']
    validate_value.forEach(element => {
        if (!req.body[element] || req.body[element] == '' || req.body[element] == ' '){
            error_value.push(element)
        }
    });



    if(!req.body.ticket_type)
        error_value.push('ticket_type');
    if(req.body.ticket_type == 'free' || req.body.ticket_type == 'paid'){
        let ticket_validate = ['ticket_name_content1','ticket_capacity_content1'];
        if(req.body.ticket_type == 'paid'){
            ticket_validate.push('ticket_currency_content1','ticket_price_content1')
        }
        ticket_validate.forEach(element => {
            if(!req.body[element]||req.body[element]==''||req.body[element]==' '){
                validate = false
                error_value.push(element)
            }else{
                
            }
        });
    }

    if(error_value.length>0){
        req.files.forEach(file => {
            fs.unlink(file.path,(err)=>{
                //res.redirect()
            });
        });

        let error_get = '?';
        for(let i = 0; i < error_value.length; i++){
            error_get += `${error_value[i]}=1`;
            if(i+1 != error_value.length)
                error_get += '&';
        }

        res.redirect(`/event_add${error_get}`);
    }

    const newEvent = new Event;
    newEvent.title = req.body.event_title;
    //newEvent.title_img = req.files.event_summary;
    newEvent.summary = req.body.event_summary;
    newEvent.content = req.body.event_desc;

    let cat_data = [];
    let i = 1;
    while(req.body[`event_cat_id_content${i}`]){
        cat_data.push(JSON.stringify(req.body[`event_cat_id_content${i}`]))
        i++
    }
    newEvent.category = cat_data;
    console.log(cat_data)

    let date_data = [];
    i = 1
    while(req.body[`event_start_date_content${i}`]&&req.body[`event_end_date_content${i}`]&&req.body[`event_start_time_content${i}`]&&req.body[`event_end_time_content${i}`]){
        let dateData = {}
        dateData.startDate = req.body[`event_start_date_content${i}`]
        dateData.endDate = req.body[`event_end_date_content${i}`]
        dateData.startTime = req.body[`event_start_time_content${i}`]
        dateData.endTime = req.body[`event_end_time_content${i}`]
        if(req.body[`event_date_description_content${i}`]){
            dateData.desc = req.body[`event_date_description_content${i}`]
        }
        date_data.push(JSON.stringify(dateData))
        i++
    }
    newEvent.date = date_data;
    console.log(date_data)

    let place_data = [];
    i = 1
    while(req.body[`place_lat_content${i}`]&&req.body[`place_lng_content${i}`]&&req.body[`place_address2_content${i}`]&&req.body[`place_city_content${i}`]&&req.body[`place_state_content${i}`]&&req.body[`place_zip_content${i}`]&&req.body[`place_country_content${i}`]){
        let placeData = {}
        placeData.lat = req.body[`place_lat_content${i}`]
        placeData.lng = req.body[`place_lng_content${i}`]
        placeData.address2 = req.body[`place_address2_content${i}`]
        placeData.city = req.body[`place_city_content${i}`]
        placeData.state = req.body[`place_state_content${i}`]
        placeData.zip = req.body[`place_zip_content${i}`]
        placeData.country = req.body[`place_country_content${i}`]
        if(req.body[`place_address1_content${i}`]){
            placeData.address1 = req.body[`place_address1_content${i}`]
        }
        if(req.body[`place_description_content${i}`]){
            placeData.desc = req.body[`place_description_content${i}`]
        }
        place_data.push(JSON.stringify(placeData))
        i++
    }
    newEvent.place = place_data;
    console.log(place_data)

    newEvent.ticket_type = req.body.ticket_type
    let ticket_data = [];

    if(req.body.ticket_type != 'open'){
        i = 1
        while(req.body[`ticket_name_content${i}`]&&req.body[`ticket_capacity_content${i}`]){
            let ticketData = {}
            ticketData.ticket_name = req.body[`ticket_name_content${i}`]
            ticketData.ticket_capacity = req.body[`ticket_capacity_content${i}`]
            if(req.body.ticket_tynolpe == 'paid'){
                if(req.body[`ticket_currency_content${i}`]&&req.body[`ticket_price_content${i}`]){
                    ticketData.ticket_currency = req.body[`ticket_currency_content${i}`]
                    ticketData.ticket_price = req.body[`ticket_price_content${i}`]
                }else break;
            }
            if(req.body[`ticket_desc_content${i}`]){
                ticketData.address1 = req.body[`ticket_desc_content${i}`]
            }
            ticket_data.push(JSON.stringify(ticketData))
            i++
        }
        newEvent.ticket = ticket_data;
        console.log(ticket_data)
    }

    let contact_data = [];
    i = 1
    while(req.body[`contact_name_content${i}`]&&req.body[`contact_desc_content${i}`]&&req.body[`contact_phone_content${i}`]){
        let contactData = {}
        contactData.contact_name = req.body[`contact_name_content${i}`]
        contactData.contact_desc = req.body[`contact_desc_content${i}`]
        contactData.contact_phone = req.body[`contact_phone_content${i}`]
        if(req.body[`contact_email_content${i}`]){
            contactData.email = req.body[`contact_email_content${i}`]
        }
        contact_data.push(JSON.stringify(contactData))
        i++
    }
    newEvent.contact = contact_data;

    newEvent.lat = 121.021;
    newEvent.lng = 83.012;
    newEvent.user = 'test user';
    let event_artists_img = []
    const patt = /event_artist_img_content[0-9]*/i
    req.files.forEach(file => {
        if(file.fieldname == 'event_title_image1') newEvent.title_img = 'event_title_image1';
        else if(file.fieldname.match(/event_artist_img_content[0-9]*/i)) event_artists_img.push(file.fieldname)
    });

    let artist_data = [];
    i = 1;
    while(req.body[`event_artist_content${i}`]){
        let artData = {}
        if(req.body[`event_artist_id_content${i}`]){
            artData.id = req.body[`event_artist_id_content${i}`]
        }
        if(event_artists_img.includes(`event_artist_img_content${i}`)){
            artData.img = event_artists_img[event_artists_img.indexOf(`event_artist_img_content${i}`)];
        }
        artData.artist = req.body[`event_artist_content${i}`]
        artist_data.push(JSON.stringify(artData))
        i++
    }
    newEvent.artists = artist_data;
    console.log(artist_data)


    newEvent.save((err)=>{
        if(err) {
            console.log(err)
        }
        console.log('good')
    })
});