//routes/main.js

module.exports = function(app){

    app.get('/',function(req,res){
        res.render('index', {
            title : 'CNAE',
            curUrl: encodeURIComponent(req.originalUrl),
            user: (req.user) ? req.user : false
        });
    });

    app.get('/register', checkNotAuthenticated, (req,res)=>{
        res.render('register',{
            title: 'CNAE - Register',
            curUrl: '',
            user: false
        });
    });

    app.get('/login', checkNotAuthenticated, (req,res)=>{
        res.render('login',{
            title: 'CNAE - Login',
            curUrl: '',
            redirectUrl: req.params.url,
            user: false
        });
    });

    app.get('/map',(req,res)=>{
        res.render('map', {
            title: 'CNAE - MAP',
            curUrl: encodeURIComponent(req.originalUrl),
            user: (req.user) ? req.user : false
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
            user: (req.user) ? req.user : false
        });
    });

    app.get('/profile/:id' ,(req,res)=>{
        res.render('profile',{
            title: 'CNAE - Profile',
            user: (req.user) ? req.user : false,
            id: req.params.id
        });
    });

    app.get('/beta' ,(req,res)=>{
        res.render('beta',{
            title: 'CNAE - beta',
            user: (req.user) ? req.user : false,
            id: req.params.id
        });
    });

    function checkAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            next();
            return;
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