//routes/db.js
module.exports = function(app, Event, User){
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
        console.log(id);

        // Session
        const sess = req.session; // Session open
        if(!sess.markerHistory) // Declare marker history array 
            sess.markerHistory = [];

        if(sess.markerHistory.includes(id)){
            const index = sess.markerHistory.indexOf(id);
            sess.markerHistory.splice(index,1);
            sess.markerHistory.unshift(id);
        }else{
            sess.markerHistory.unshift(id);
        }

        // Find data by id
        Event.findOne({_id: id},(err,data)=>{
            if(err) return res.status(500).json({error: err});
            if(!data) return res.status(404).json({error: 'data not found'});
            result.data = data;
            result.login = (req.user) ? true : false;
            if(req.user) result.include = JSON.parse(req.user.event_sub).includes(id) ? true : false;
            res.json(result);
        }); 
    });

    /* Get history info */
    app.get('/db/get_history',(req,res)=>{
        const sess = req.session;
        if(!sess.markerHistory || sess.markerHistory.length == 0)
            return;
        const mongoose = require('mongoose');
        const historyData = sess.markerHistory;
        const historyList = [];

        for(let i=0;i<historyData.length;i++)
            historyList.push(mongoose.Types.ObjectId(historyData[i]));

        Event.find({'_id': {$in: historyList}},(err,data)=>{
            if(err) return res.status(500).json({error: err});
            if(!data) return res.status(404).json({error: 'data not found'});
            let dataList = [];
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

    /* Event add */
    app.post('/db/add_event',(req,res)=>{
        const event = new Event();
        event.title = req.body.name;
        event.lat = req.body.lat;
        event.lng = req.body.lng;
        event.user = 'test';

        event.save((err)=>{
            if(err){
                res.json({error:err});
                return;
            }
            res.json({error:0})
        })
    })

    app.get('/user/get_event/:dir', authenticateMessage, (req, res) => {
        console.log('ha')
        const mongoose = require('mongoose');
        const id = req.user._id;
        const dir = req.params.dir;
        User.findById(id).select('event_sub').exec((err, data)=>{
            if(err) res.status(500).json({error:'Connection lost'});
            if(!data) res.status(404).json({error:'Failed to upload'});
            const events = JSON.parse(data.event_sub);
            const likeyList = [];

            for(let i=0;i<events.length;i++)
                likeyList.push(mongoose.Types.ObjectId(events[i]));

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