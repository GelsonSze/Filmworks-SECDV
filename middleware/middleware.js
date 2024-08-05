const multer = require('multer')
const passport = require('passport');
const winston = require('winston')

const rateLimit = require('express-rate-limit');

const Recaptcha = require('express-recaptcha').RecaptchaV3
var options = { hl: 'de' }
var recaptcha = new Recaptcha(process.env.CAPTCHA_KEY_1, process.env.CAPTCHA_KEY_2, options)

const credentials_controller = require('../controller/credentials_controller')
const devLogger = winston.loggers.get('DevLogger')

const flagProfileUpload = (req, res, next) => {
    req.uploadType = "profile"
    next()
}

const storage = multer.diskStorage({
    destination: function(req, file, callback){
        if(req.uploadType == "profile"){
            callback(null, './public/uploads/profiles')
        }else{
            callback(null, './public/uploads/movies')
        }
    },
    filename: function(req, file, callback){

        if(process.env.NODE_ENV == "development"){
            devLogger.info(JSON.stringify(file))
        }

        callback(null, Date.now() + "_" + file.originalname)
    }
})

const fileFilter = function(req, file, callback) {
    // if there is no file uploaded
    if (file == undefined) {
        callback(new Error('LIMIT_FILE_NONE'), false);
    } // if it is not a picture (jpeg, png, gif)
    else if (!(file.mimetype === 'image/jpeg') && !(file.mimetype === 'image/png') && !(file.mimetype === 'image/gif')) { 
        callback(new Error('LIMIT_FILE_TYPE'), false);
    } else {
        callback(null, true)
    } 
    // if file signature / magic numbers is not a picture (jpeg, png, gif)
};

const upload = multer({
    storage: storage,
    limits: {fileSize: 5242880},  // 5MB = 5 * 1024 * 1024
    fileFilter: fileFilter
})

const multerError = (err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        var info = {
            error: 'Exceeded file size limit of 5MB'
        };
        res.render('sign_up', { layout: '/layouts/prelogin.hbs',
            error: info.error,
            title: 'Sign-Up - Filmworks'
        });
        return;

    } else if (err.message === 'LIMIT_FILE_TYPE'){
        var info = {
            error:'Invalid photo format'
        }
        res.render('sign_up',{layout: '/layouts/prelogin.hbs', 
            error: info.error,
            title: 'Sign-Up - Filmworks'
        });
        return;
        
    } else if (err.message === 'LIMIT_FILE_NONE') {
        var info = {
            error:'No file uploaded'
        }
        res.render('sign_up',{layout: '/layouts/prelogin.hbs', 
            error: info.error,
            title: 'Sign-Up - Filmworks'
        });
        return;
    } else {
        next(err);
    }
}

const limiter = rateLimit({
    requestWasSuccessful: (req, res) => res.statusCode == 200,
    skipSuccessfulRequests: true,
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 3, // limit each IP to 3 requests per windowMs
    handler:  credentials_controller.banIP,
    keyGenerator: (req, res) => {
        return req.clientIp // IP address 
    }
})

const checkValidInput = (req, res, next) => {

    if (!req.recaptcha.error) {
        res.status(200);
        next();
    } else {
        res.status(403).send("Incorrect Captcha"); // change to whatever we need to do when captcha is failed
    }
}

module.exports = {
    fileHandler: [flagProfileUpload, upload.single("file"), multerError],
    loginAuth: [recaptcha.middleware.verify, checkValidInput, limiter, passport.authenticate('local', { failureRedirect: '/invalid-login', successRedirect: '/post-login'})]
}