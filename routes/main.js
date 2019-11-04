//routes/main.js

module.exports = function(app){

    app.get('/',function(req,res){
        res.render('index', {
            title : 'CNAE',
            curUrl: encodeURIComponent(req.originalUrl),
            username: (req.user) ? req.user.name : false
        });
    });

    app.get('/register', checkNotAuthenticated, (req,res)=>{
        res.render('register',{
            title: 'CNAE - Register',
            curUrl: '',
            username: false
        });
    });

    app.get('/login', checkNotAuthenticated, (req,res)=>{
        res.render('login',{
            title: 'CNAE - Login',
            curUrl: '',
            redirectUrl: req.params.url,
            username: false
        });
    });

    app.get('/map',(req,res)=>{
        res.render('map', {
            title: 'CNAE - MAP',
            curUrl: encodeURIComponent(req.originalUrl),
            username: (req.user) ? req.user.name : false
        });
    });

    app.get('/test',(req,res)=>{
        res.render('test',{
            title: 'CNAE -TEST'
        });
    });

    app.get('/event_add' ,(req,res)=>{
        res.render('addEvent',{
            title: 'CNAE - Add Event',
            username: (req.user) ? req.user.name : false
        });
    });

    function checkAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            next()
        }
        return res.redirect('/error/404')
    }

    function checkNotAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return res.redirect('/error/404')
        }
        next()
    }
} 