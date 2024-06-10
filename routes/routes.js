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
const upload = multer({
    storage: storage,
    limits: { fileSize: 5242880}}) // 5MB = 5 * 1024 * 1024

function multerError(err, req, res, next) {
    if (err.code === 'LIMIT_FILE_SIZE') {
        var info = {
            error: 'Exceeded file size limit of 5MB'
        };
        res.render('sign_up', { layout: '/layouts/prelogin.hbs',
            error: info.error,
            title: 'Sign-Up - Filmworks'
        });
    } else {
        next(err);
    }
}

const credentials_controller = require('../controller/credentials_controller')
const movie_controller = require('../controller/movie_controller')

// import rate limiter
const rateLimit = require('express-rate-limit');
const requestIp = require('request-ip');

// temporary list, will move to db? when implemented
const bannedIPs = [];
const checkBan = (req, res, next) => {
    const ip = req.clientIp;
    
    // If IP ban has expired, remove it from the banned list
    if (bannedIPs.length != 0 && bannedIPs.includes(ip)) {
        return res.status(403).json({ message: 'Your IP has been permanently banned.' });
    }
    
    next();
};

const limiter = rateLimit({
    requestWasSuccessful: (req, res) => res.statusCode == 200,
    skipSuccessfulRequests: true,
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 3, // limit each IP to 3 requests per windowMs
    handler:  (req, res, next, options) => {
        const ip = req.clientIp;

        // Add IP to the banned list
        bannedIPs.push(ip);
        res.status(400).json({
            message: 'Your IP has been permanently banned',
        });
    },
    keyGenerator: (req, res) => {
        return req.clientIp // IP address 
    }
})

const checkValidInput = (req, res, next) => {
    console.log("TESTING");
    console.log(req.body)
    console.log(req.recaptcha)
    if (!req.recaptcha.error) {
        res.status(200);
    } else {
        res.status(403).send("Forbidden"); // change to whatever we need to do when captcha is failed
    }
}

//import captcha
const Recaptcha = require('express-recaptcha').RecaptchaV3
var options = { hl: 'de' }
var recaptcha = new Recaptcha('6LcWdvQpAAAAAGmO7xTH5juQyGA99Ye46XycpBif', '6LcWdvQpAAAAACw4JmltpAPbZ_xPJlQag-JNfpDY', options)

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

app.post(`/postregister`, upload.single("file"), multerError, credentials_controller.successfulRegister)

app.get(`/login`, function(req, res) {
    if (req.session.email == undefined)
        res.render('sign_in',  {layout: '/layouts/prelogin.hbs',  title: 'Sign-In - Filmworks'})
});

app.post(`/login`, recaptcha.middleware.verify, checkValidInput, limiter, credentials_controller.checkLogin);

app.get('/main', movie_controller.getMovies);

app.get('/account', credentials_controller.displayAccount)

app.get('/admin', credentials_controller.displayadminPage)

module.exports = app;
