const express = require(`express`);
const app = express();

const multer = require('multer')
const storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, './public/uploads/')
    },
    filename: function(req, file, callback){
        console.log(file)

        callback(null, Date.now() + "_" + file.originalname)
    }
})
const upload = multer({storage: storage})

const credentials_controller = require('../controller/credentials_controller')

// import rate limiter
const rateLimit = require('express-rate-limit');
const requestIp = require('request-ip');

// temporary list, will move to db? when implemented
const bannedIPs = {};
const checkBan = (req, res, next) => {
    const ip = req.clientIp;
    const currentTime = Date.now();
    
    // If IP ban has expired, remove it from the banned list
    if (bannedIPs[ip] && bannedIPs[ip] <= currentTime) {
        delete bannedIPs[ip];
    }
    
    if (bannedIPs[ip] && bannedIPs[ip] > currentTime) {
        return res.status(403).json({ message: 'Your IP has been banned.' });
    }
    
    next();
};

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 3, // limit each IP to 3 requests per windowMs
    message: 'rate limit reached',
    skip: (req,res ) => res.statusCode == 200,
    handler:  (req, res, next, options) => {
        const ip = req.ip;
        const banDuration = 60 * 1000; // 1 min ban for testing
        const banExpiry = Date.now() + banDuration;

        // Add IP to the banned list
        bannedIPs[ip] = banExpiry;
        res.status(400).json({
            message: 'You have been banned',
        });
    },
    keyGenerator: (req, res) => {
        return req.clientIp // IP address 
    }
})

const checkValidInput = (req, res, next) => {
    console.log("TESTING");
    console.log(req.body)
    if(req.body.l_email == '123@gmail.com' && req.body.l_password == "123"){
        res.status(200);
        next();
    }
    else{
        res.status(400);
        next();
    }
}

app.use(requestIp.mw());
app.use(checkBan);


app.get(`/`, function(req, res) {
    if (req.session.email == undefined)
    res.render('sign_in',  {layout: '/layouts/prelogin.hbs',  title: 'Sign-In - Filmworks'})
});

app.get(`/register`, function(req, res) {
    if (req.session.email == undefined)
        res.render('sign_up', {layout: '/layouts/prelogin.hbs',  title: 'Sign-Up - Filmworks'})
});

app.post(`/postregister`, upload.single("file"), credentials_controller.successfulRegister)

app.get(`/login`, function(req, res) {
    if (req.session.email == undefined)
        res.render('sign_in',  {layout: '/layouts/prelogin.hbs',  title: 'Sign-In - Filmworks'})
});

app.post(`/login`, checkValidInput, limiter, function(req, res) {
    console.log(req.rateLimit);
    if(res.statusCode == 200)
        res.render('index', {layout: '/layouts/layout.hbs', movie:{}, title: "Main - Filmworks"}) // move to controller next time when db is functioning
    else{
        res.render('sign_in',{layout: '/layouts/prelogin.hbs', 
            error: "",
            title: 'Sign-In - Filmworks'
        });
    }
});


module.exports = app;
