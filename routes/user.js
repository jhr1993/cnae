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

    app.post('/login', NotauthenticateRedirect, passport.authenticate('local', {failureRedirect: '/login',failureFlash: true}),(req,res)=>{
        res.redirect('/map');
    });

    app.get('/logout', authenticateRedirect, (req,res) => {
        req.logOut();
        res.redirect('/login');
    });

    app.put('/user/add/event/:id', authenticateMessage, (req,res) => {
        const id = req.params.id.split('_')[1];
        const user = req.user;
        User.findById(user._id, (err, userData) => {
            if(err) res.status(500).json({error:'Connection lost'});
            if(!userData) res.status(404).json({error:'Failed to upload'});
            
            let user_add_event = JSON.parse(userData.event_sub);
            if(user_add_event.includes(`${id}`)) {
                return; 
            }
            user_add_event.unshift(`${id}`);
            userData.event_sub = JSON.stringify(user_add_event);

            userData.save((err) => {
                if(err) res.status(500).json({error:'failed to update'});
                res.json({error:false});
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

    app.get('/user/get_event/:dir', authenticateMessage, (req, res) => {
        const id = req.user._id;
        const dir = req.params.dir;
        User.findById(id).select('event_sub').exec((err, data)=>{
            if(err) res.status(500).json({error:'Connection lost'});
            if(!data) res.status(404).json({error:'Failed to upload'});
            const events = JSON.parse(data.event_sub);
        });
    });
} 