const express = require(`express`);
const requestIp = require('request-ip');

const app = express();

const credentials_controller = require('../controller/credentials_controller')
const cart_controller = require('../controller/cart_controller')
const movie_controller = require('../controller/movie_controller')
const middleware = require('../middleware/middleware')

app.use(requestIp.mw());
app.use(credentials_controller.findBannedIP);
app.use(credentials_controller.checkAuth)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', function(req, res) {
    if (!req.user){
        res.render('sign_in',  {layout: '/layouts/prelogin.hbs',  title: 'Sign-In - Filmworks'})
    }
});

app.get('/register', function(req, res) {
    res.render('sign_up', {layout: '/layouts/prelogin.hbs',  title: 'Sign-Up - Filmworks'})
});

app.post('/postregister', middleware.fileHandler, credentials_controller.successfulRegister)

app.get('/login', function(req, res) {
    res.render('sign_in',  {layout: '/layouts/prelogin.hbs',  title: 'Sign-In - Filmworks'})
});

app.post('/login', middleware.loginAuth);

app.get('/getmovie/:movieID', movie_controller.redirectToMoviePage)

app.post('/addcart', cart_controller.addMovieToCart)
app.delete('/deletecart/:cartItemID', cart_controller.deleteMovieFromCart)

app.get('/post-login', credentials_controller.userRedirect)

app.get('/invalid-login', function(req, res){
    res.render('sign_in',  {layout: '/layouts/prelogin.hbs',  title: 'Sign-In - Filmworks', error: 'Invalid user or password'})
})

app.get('/logout', credentials_controller.logoutAccount);

app.get('/main', movie_controller.getMovies)

app.get('/account', credentials_controller.displayAccount)

app.get(['/admin', '/analytics'], credentials_controller.displayadminPage)

app.get('/payment', cart_controller.getPayment) 

app.post('/postpayment', cart_controller.postPayment)

app.get('/cart', cart_controller.getCart) 

app.post(`/add-review/:movieID`, movie_controller.addReview)

app.post(`/delete-review/:reviewID`, movie_controller.deleteReview)

app.post(`/edit-review/:reviewID`, movie_controller.editReview)

app.post(`/find-movie`, movie_controller.findMovie)

app.get('/movie-details', movie_controller.getAddMovies) 

app.get('/add-movie-db', movie_controller.addMovie)

app.post('/post-add-movie', middleware.fileHandler, movie_controller.postaddMovie)

app.get('/delete-movie', movie_controller.getDeleteMovie)

app.post('/post-delete-movie', movie_controller.listMoviesDelete)

app.post('/final-delete', movie_controller.postDeleteMovie)

app.get('/update-movie', movie_controller.getUpdateMovie)

app.post('/post-update-movie', movie_controller.listMoviesUpdate)

app.get('/update-movie-details/:movieID', movie_controller.updateMovieDetails)

app.post('/final-update', movie_controller.postUpdateMovieDetails)


app.get('/add-timeslot', movie_controller.getAddTimeSlot);

app.post('/list-movies-timeslot', movie_controller.listMoviesTime);

app.get('/final-timeslot/:movieID', movie_controller.showTimeSlotOptions)

app.post('/update-movie-timeslot', movie_controller.postAddTimeSlot)

app.post('/ban-user', credentials_controller.banUser)

app.get(['*','/error'], function(req, res){
    res.render('error',  {layout: '/layouts/prelogin.hbs',  title: 'Error', error: 'Unknown Page'})
})

module.exports = app