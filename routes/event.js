//routes/db.js
module.exports = function(app, Event, User, multer){
    //GET ALL DATA
    app.get('/db/get_event', (req,res)=>{
        Event.find(function(err,data){
            if(err) return res.status(500).send({error : 'database failure'});
            res.json(data);
        });
    });

    /* Get all event data */
    app.get('/db/get_event/:id', (req,res)=>{
        let result = {test:"test"};
        const historyAmout = 4;
        // Return if no id param
        if(!req.params.id)
            return;
        const id = req.params.id;

        // Session
        const sess = req.session; // Session open
        if(!sess.markerHistory) // Declare marker history array 
            sess.markerHistory = [];

        // if history includes id move it to front
        if(sess.markerHistory.includes(id)){
            const index = sess.markerHistory.indexOf(id);
            sess.markerHistory.splice(index,1);
            sess.markerHistory.unshift(id);
        }else{// else just unshift
            sess.markerHistory.unshift(id); 
        }

        // Find data by id
        Event.findOne({_id: id},(err,data)=>{
            if(err) return res.status(500).json({error: err});
            if(!data) return res.status(404).json({error: 'data not found'});
            result.data = data;
            result.login = (req.user) ? true : false; //check user has logged
            if(req.user) result.include = JSON.parse(req.user.event_sub).includes(id) ? true : false;// check user sub
            User.findById(data.user,'-_id name',(err,userData)=>{
                result.username = userData.name;
                res.json(result);
            })
        }); 
    });

    /* Get history info */
    app.get('/db/get_history',(req, res)=>{
        const sess = req.session;
        if(!sess.markerHistory || sess.markerHistory.length == 0)
            return;
        const mongoose = require('mongoose');
        const historyData = sess.markerHistory;
        const historyList = [];

        // convert array to objectId
        for(let i=0;i<historyData.length;i++)
            historyList.push(mongoose.Types.ObjectId(historyData[i]));

        // Get history elements' value
        Event.find({'_id': {$in: historyList}},(err,data)=>{
            if(err) return res.status(500).json({error: err});
            if(!data) return res.status(404).json({error: 'data not found'});
            let dataList = [];

            //sort history
            for(let i=0; i<historyList.length; i++){
                for(let j=0; j<data.length; j++){
                    if(`${historyList[i]}` == `${data[j]._id}`){
                        dataList.push(data[j]);
                    }
                }
            }
            res.json(dataList);
        });
    });

    // Get subed 
    app.get('/user/get_event/:dir', authenticateMessage, (req, res) => {
        const mongoose = require('mongoose');
        const id = req.user._id;
        const dir = req.params.dir;
        User.findById(id).select('event_sub').exec((err, data)=>{
            if(err) res.status(500).json({error:'Connection lost'});
            if(!data) res.status(404).json({error:'Failed to upload'});

            // Change value to mongoose object ID
            const events = JSON.parse(data.event_sub);
            const likeyList = [];

            for(let i=0;i<events.length;i++)
                likeyList.push(mongoose.Types.ObjectId(events[i]));

            // Get info of array elements
            Event.find({'_id': {$in: likeyList}},(err,data)=>{
                if(err) return res.status(500).json({error: err});
                if(!data) return res.status(404).json({error: 'data not found'});
                let dataList = [];
                for(let i=0; i<likeyList.length; i++){
                    for(let j=0; j<data.length; j++){
                        if(`${likeyList[i]}` == `${data[j]._id}`){
                            dataList.push(data[j]);
                        }
                    }
                }
                res.json({data:dataList});
            });
        });
    });

    

    /* Event add */
    app.post('/db/add_event',(req,res)=>{
        let event_title = req.body._sector1_subSector1_content1_subContent1_input1;
        console.log(event_title);
        /*let event_summary = req.body._sector1_subSector1_content1_subContent1_input1;
        console.log(event_summary);
        let event_desc = req.body._secotr1_subSector4_content1_subContent1_input1;
        console.log(event_desc);
        let event_categories = []
        let i = 1
        while(true){
            let value = req.body[`_secotr2_subSector1_content${i}_subContent1_input2`];
            if(value){
                event_categories.unshift(value);
                i++;
            }else
                break;
        }
        console.log(event_categories);
        let event_artists = []
        i = 1
        while(true){
            let value = req.body[`_secotr3_subSector1_content${i}_subContent1_input2`];
            if(value){
                event_artists.unshift(value);
                i++;
            }else
                break;
        }
        let event_data = []
        i = 1
        while(true){
            let value = req.body[`_secotr4_subSector1_content${i}_subContent1_input1`];
            if(value){
                event_artists[i-1] = [
                    req.body[`_secotr4_subSector1_content${i}_subContent1_input1`],
                    req.body[`_secotr4_subSector1_content${i}_subContent2_input1`],
                    req.body[`_secotr4_subSector1_content${i}_subContent3_input1`],
                    req.body[`_secotr4_subSector1_content${i}_subContent4_input1`],
                ];
                if(req.body[`_secotr4_subSector1_content${i}_subContent5_input1`])
                    event_artists[i-1].push(req.body[`_secotr4_subSector1_content${i}_subContent5_input1`]);
                i++;
            }else
                break;
        }
        

        //console.log(req.body.title)
        /*const event = new Event();
        event.title = req.body.name;
        event.lat = req.body.lat;
        event.lng = req.body.lng;
        event.user = req.user._id;

        event.save((err)=>{
            if(err){
                res.json({error:err});
                return;
            }
            res.json({error:0})
        })*/
    })

    
    const storage = multer.diskStorage({
        destination: './public/uploads/',
        filename: function(req, file, cb){
            cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    });
    
    const upload = multer({
        storage: storage,
        limits:{fileSize: 1000000},
        fileFilter: function(req, file, cb){
            checkFileType(file, cb);
        }
    }).single('event_title_img');
    
    function checkFileType(file, cb){
        if(!file){
            console.log('no file')
        }
        console.log(file)
        // Allowed ext
        const filetypes = /jpeg|jpg|png|gif/;
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
    
    app.post('/test/upload', upload, function (req, res, next) {
        const event_title = req.body.event_title;
        console.log(event_title)
        const event_img = req.body.event_img;
        console.log(event_img)
        const event_summary = req.body.event_summary;
        console.log(event_summary)
        const event_desc = req.body.event_desc;
        console.log(event_desc)
        const event_cat = [];
        let i = 1;
        while(true){
            if(req.body[`event_cat_id_content${i}`]){
                event_cat.push(req.body[`event_cat_id_content${i}`])
                i++;
            }else{
                break;
            }
        }
        console.log(event_cat)
        const event_artist = [];
        i = 1;
        while(true){
            if(req.body[`event_artist_content${i}`]){
                const artist = {}
                if(req.body[`event_artist_id_content${i}`])
                    artist.id = req.body[`event_artist_id_content${i}`]
                if(req.body[`event_artist_content${i}`])
                    artist.name = req.body[`event_artist_content${i}`]
                event_artist.push(artist)
                i++;
            }else{
                break;
            }
        }
        console.log(event_artist)
        const event_date = [];
        i = 1;
        while(true){
            if(req.body[`event_start_date_content${i}`] && req.body[`event_end_date_content${i}`] && req.body[`event_start_time_content${i}`] && req.body[`event_end_time_content${i}`]){
                const date = {}
                date.start_date = req.body[`event_start_date_content${i}`];
                date.end_date = req.body[`event_end_date_content${i}`];
                date.start_time = req.body[`event_start_time_content${i}`];
                date.end_time = req.body[`event_end_time_content${i}`];
                if(req.body[`event_date_description_content${i}`])
                    date.date_desc = req.body[`event_date_description_content${i}`];
                event_date.push(date)
                i++;
            }else{
                break;
            }
        }
        console.log(event_date)
        const event_place = [];
        i = 1;
        while(true){
            if(req.body[`place_address2_content${i}`] && req.body[`place_city_content${i}`] && req.body[`place_state_content${i}`] && req.body[`place_zip_content${i}`]){
                const place = {}
                if(req.body[`place_description_content${i}`])
                    place.place_address1 = req.body[`place_description_content${i}`];
                place.place_address2 = req.body[`place_address2_content${i}`];
                place.place_city = req.body[`place_city_content${i}`];
                place.place_state = req.body[`place_state_content${i}`];
                place.place_zip = req.body[`place_zip_content${i}`];
                place.place_country = req.body[`place_country_content${i}`];
                if(req.body[`place_description_content${i}`])
                    place.place_desc = req.body[`place_description_content${i}`];
                event_place.push(place)
                i++;
            }else{
                break;
            }
        }
        console.log(event_place)
        const event_ticket = [];
        if(!(req.body[`ticket_type`] == 'open')){  
            i = 1;
            while(true){
                if((req.body[`ticket_type`] == 'free' && req.body[`ticket_name_content${i}`] && req.body[`ticket_capacity_content${i}`]) || (req.body[`ticket_type`] == 'paid' && req.body[`ticket_name_content${i}`] && req.body[`ticket_capacity_content${i}`] && req.body[`ticket_price_content${i}`] && req.body[`ticket_capacity_content${i}`])){
                    const ticket = {}
                    ticket.ticket_name = req.body[`ticket_name_content${i}`];
                    if(req.body[`ticket_type`] == 'paid'){
                        ticket.ticket_currency = req.body[`ticket_currency_content${i}`];
                        ticket.ticket_price = req.body[`ticket_price_content${i}`];
                    }
                    ticket.ticket_cap = req.body[`ticket_capacity_content${i}`];
                    if(req.body[`ticket_desc_content${i}`])
                        ticket.ticket_price = req.body[`ticket_desc_content${i}`];
                    event_ticket.push(ticket)
                    i++;
                }else{
                    break;
                }
            }
        }
        console.log(event_ticket)
        const event_url = [];
        i = 1;
        while(true){
            if(req.body[`url_content${i}`] && req.body[`url_type_content${i}`]){
                const url = {}
                url.url_url = req.body[`url_content${i}`];
                url.url_urlType = req.body[`url_type_content${i}`];
                event_url.push(url)
                i++;
            }else{
                break;
            }
        }
        console.log(event_url)
        const event_contact = [];
        i = 1;
        while(true){
            if(req.body[`contact_name_content${i}`] && req.body[`contact_desc_content${i}`] && req.body[`contact_phone_content${i}`]){
                const contact = {}
                contact.contact_name = req.body[`contact_name_content${i}`];
                contact.contact_desc = req.body[`contact_desc_content${i}`];
                contact.contact_phone = req.body[`contact_phone_content${i}`];
                contact.contact_contactType = req.body[`contact_desc_content${i}`];
                event_contact.push(contact)
                i++;
            }else{
                break;
            }
        }
        console.log(event_contact)
    })

    function authenticateRedirect(req, res, next) {
        if (req.isAuthenticated()) {
            next();
        }
        return res.redirect('/error/404');
    }

    function NotauthenticateRedirect(req, res, next) {
        if (req.isAuthenticated()) {
            return res.redirect('/error/404');
        }
        next();
    }

    function authenticateMessage(req, res, next) {
        if (req.isAuthenticated()) {
            next();
        }
        return;
    }

    function NotauthenticateMessage(req, res, next) {
        if (req.isAuthenticated()) {
            return;
        }
        next();
    }
}