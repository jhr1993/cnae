//routes/users.js
module.exports = (app, Category, Event) => {
    app.get('/db/get_categories/:title', (req,res)=>{
        const title = req.params.title;
        Category.find({title:{ "$regex": title, "$options": "i" }}, async (err,data)=>{
            const categoriesList = [];
            for(let i = 0; i<data.length; i++){
                let parentString = ''
                let parentId = data[i].parent
                while(parentId != 'false'){
                    await Category.findById(parentId,'-_id title parent',(err,parentdata)=>{
                        parentId = parentdata.parent;
                        parentString = `${parentdata.title} | ${parentString}`;
                    })
                }
                const catInfo = {
                    origin : data[i],
                    parent : parentString
                }
                categoriesList.push(catInfo)
            }
            return res.json({data:categoriesList})
        })
    })
    
} 