const express = require(`express`);
const multer = require('multer')

const app = express();

const credentials_controller = require('../controller/credentials_controller')
const cart_controller = require('../controller/cart_controller')
const movie_controller = require('../controller/movie_controller')
const passport = require('passport');


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
            console.log(file)
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

function multerError(err, req, res, next) {
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

// import rate limiter
const rateLimit = require('express-rate-limit');
const requestIp = require('request-ip');

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

    if(process.env.NODE_ENV == "development"){
        console.log(req.body)
        console.log(req.recaptcha)
    }

    if (!req.recaptcha.error) {
        res.status(200);
        next();
    } else {
        res.status(403).send("Incorrect Captcha"); // change to whatever we need to do when captcha is failed
    }
}

//import captcha
const Recaptcha = require('express-recaptcha').RecaptchaV3
var options = { hl: 'de' }
var recaptcha = new Recaptcha('6LcWdvQpAAAAAGmO7xTH5juQyGA99Ye46XycpBif', '6LcWdvQpAAAAACw4JmltpAPbZ_xPJlQag-JNfpDY', options)

app.use(requestIp.mw());
app.use(credentials_controller.findBannedIP);
// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));


app.get('/', credentials_controller.checknoAuth, function(req, res) {
    if (!req.user){
        res.render('sign_in',  {layout: '/layouts/prelogin.hbs',  title: 'Sign-In - Filmworks'})
    }
});

app.get('/register', credentials_controller.checknoAuth, function(req, res) {
    res.render('sign_up', {layout: '/layouts/prelogin.hbs',  title: 'Sign-Up - Filmworks'})
});

app.post(`/postregister`, credentials_controller.checknoAuth, flagProfileUpload, upload.single("file"), multerError, credentials_controller.successfulRegister)

app.get('/login', credentials_controller.checknoAuth, function(req, res) {
    res.render('sign_in',  {layout: '/layouts/prelogin.hbs',  title: 'Sign-In - Filmworks'})
});

app.post('/login', credentials_controller.checknoAuth, recaptcha.middleware.verify, checkValidInput, limiter, passport.authenticate('local', { failureRedirect: '/invalid-login', successRedirect: '/post-login'}));

app.get('/getmovie/:movieID', credentials_controller.checkAuth, flagProfileUpload, upload.single("file"), multerError, movie_controller.redirectToMoviePage)

app.get('/addcart/:movieID', credentials_controller.checkAuth, cart_controller.addMovieToCart)
app.delete('/deletecart/:movieID', credentials_controller.checkAuth, cart_controller.deleteMovieFromCart)

app.get('/post-login', credentials_controller.userRedirect)

app.get('/invalid-login', credentials_controller.checknoAuth, function(req, res){
    res.render('sign_in',  {layout: '/layouts/prelogin.hbs',  title: 'Sign-In - Filmworks', error: 'Invalid user or password'})
})

app.get('/logout', credentials_controller.checkAuth, credentials_controller.logoutAccount);

app.get('/main', credentials_controller.checkAuth, movie_controller.getMovies)

app.get('/account', credentials_controller.checkAuth, credentials_controller.displayAccount)

app.get(['/admin', '/analytics'], credentials_controller.checkAuth, credentials_controller.displayadminPage)

app.get('/payment', cart_controller.getPayment) 

app.post('/postpayment', credentials_controller.checkAuth, flagProfileUpload, upload.single("file"), multerError, cart_controller.postPayment)

app.get('/cart', credentials_controller.checkAuth, cart_controller.getCart) 

app.post(`/add-review/:movieID`, credentials_controller.checkAuth, flagProfileUpload, upload.single("file"), multerError, movie_controller.addReview)

app.post(`/find-movie`, credentials_controller.checkAuth, flagProfileUpload, upload.single("file"), multerError, movie_controller.findMovie)

app.get('/movie-details', movie_controller.getAddMovies) 

app.get('/add-movie-db', movie_controller.addMovie)

app.post('/post-add-movie', credentials_controller.checkAuth, flagProfileUpload, upload.single("file"), multerError, movie_controller.postaddMovie)

app.get('/delete-movie', movie_controller.getDeleteMovie)

app.post('/post-delete-movie', credentials_controller.checkAuth, flagProfileUpload, upload.single("file"), multerError, movie_controller.postDeleteMovie)

app.get('/update-movie', movie_controller.getUpdateMovie)

app.post('/update-movie-details', credentials_controller.checkAuth, flagProfileUpload, upload.single("file"), multerError, movie_controller.updateMovieDetails)

app.post('/post-update-movie', credentials_controller.checkAuth, flagProfileUpload, upload.single("file"), multerError, movie_controller.postUpdateMovieDetails)


app.get(['*','/error'], function(req, res){
    res.render('error',  {layout: '/layouts/layout.hbs',  title: 'Error', error: 'Unknown Page'})
})








module.exports = app
