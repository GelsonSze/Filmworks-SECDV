const express = require(`express`);
const accountcontroller = require(`../controller/controller.js`);
const moviecontroller = require(`../controller/movie_controller.js`);
const cartcontroller = require(`../controller/cart_controller.js`);
const app = express();


app.get(`/`, accountcontroller.getInitial);
app.get('/main', moviecontroller.getMain);

//account controller
app.get(`/verify`, accountcontroller.checkEmail);
app.get('/username', accountcontroller.checkUsername);
app.get(`/register`, accountcontroller.getRegister);
app.post(`/register`, accountcontroller.postRegister);
app.get('/account', accountcontroller.getAccount);
app.get('/login', accountcontroller.getLogin);
app.post(`/login`, accountcontroller.postLogin); 
app.get('/delete_account', accountcontroller.getDeleteAccount);
app.get('/logout', accountcontroller.getLogout);
app.get('/checkStatus', accountcontroller.getStatus);
app.get('/ticket', accountcontroller.getAccount);
app.post('/ticket', accountcontroller.postTicket);

// movie controller
app.get('/find-movie', moviecontroller.getMain);
app.get('/find-quantity', moviecontroller.getQuantity);
app.post('/find-movie', moviecontroller.findMovie); 
app.get('/redirect-movie', moviecontroller.getMain); 
app.post('/redirect-movie', moviecontroller.postMoviePage); 
app.get('/error', moviecontroller.getError);


//cart controller
app.get('/cart', cartcontroller.getCart);
app.get('/deleteTicket', cartcontroller.deleteItem);
app.get('/add-cart', cartcontroller.addMovieCart); 
app.get('/payment', cartcontroller.getPayment);
app.post('/payment', cartcontroller.postPayment);

module.exports = app;
