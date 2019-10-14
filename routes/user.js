//routes/users.js
module.exports = (app, User, passport) => {
    app.post('/register/newUser', (req, res)=>{

        User.findOne({email:req.body.email}, (err,data)=>{
            if(err) res.status(500).redirect('/error/500');
            if(data) {
                req.flash('error',"That email is already used. Try another.")
                res.redirect('/register')
                return;
            }
            
            var password = req.body.pw;
            var password2 = req.body.pw2;

            if (password == password2){
                var newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.pw
                });

                User.createUser(newUser, function(err, user){
                    if(err) res.redirect('/register');
                    res.redirect('/login');
                });
            } else {
                res.redirect('/register');
            }
        });

    });

    const LocalStrategy = require('passport-local').Strategy
    const bcrypt = require('bcrypt')

    function initialize(passport) {
        const authenticateUser =  (email, password, done) => {
            User.findOne({email:email}, async (err,data)=>{
                if(err) return done (null, false, { message: "Unable to login" })
                if(!data) return done (null, false, { message: "No such user with that eamil" })
                try{
                    return (await bcrypt.compare(password, data.password)) ? done(null, data) : done(null, false, { message: 'Email or password is incorrect' });
                } catch (e){
                    return done(e)
                }
            })
        }

        passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
        passport.serializeUser((user, done) => done(null, user.id))
        passport.deserializeUser((id, done) => {
            User.findById(id,(err, data)=>{
                if(err) return done(err)
                return done(null, data);
            })
        })
    }

    initialize(passport);

    app.post('/login', checkNotAuthenticated, passport.authenticate('local', {failureRedirect: '/login',failureFlash: true}),(req,res)=>{
        console.log(req.params.url);
        res.redirect(decodeURIComponent(req.params.url))
    });

    app.get('/logout', checkAuthenticated, (req,res) => {
        req.logOut();
        res.redirect('/login');
    });

    app.put('/user/add/event/:id', checkAuthenticated, (req,res) => {
        const id = req.params.id;
        const user = req.user;
        User.findById(user, (err, user) => {
            if(err) res.redirect('/error/500');
            if(!user) res.redirect('/error/404');
            
            let user_add_event = JSON.parse(user.event_sub);
            if(user_add_event.includes(`user_${id}`)) {
                return; 
            }
            user_add_event.unshift(`user_${id}`);
            user.event_sub = JSON.stringify(user_add_event);

            user.save((err) => {
                if(err) res.status(500).json({error:'falied to update'});
                res.json({error:false});
            });
        });
    });

    function checkAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            next();
        }
        return res.redirect('/error/404');
    }

    function checkNotAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return res.redirect('/error/404');
        }
        next();
    }

    app.get('/user/get_event/:dir', (req, res) => {
        if(!req.user){
            res.redirect('/error/404');
        }
        const id = req.user._id;
        const dir = req.params.dir;
        User.findById(id).select('event_sub').exec((err, data)=>{
            if(data._id == id)
                console.log(data);
        });
    });
} 