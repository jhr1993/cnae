//routes/db.js
module.exports = function(app, Event){
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
}